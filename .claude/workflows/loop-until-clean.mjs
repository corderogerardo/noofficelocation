/**
 * loop-until-clean — a convergence loop built on the project's specialist harness.
 *
 * LOOP ENGINEERING, in one file. A loop is a controller with three parts:
 *
 *   ACTUATOR   — does work that changes state   → the `implementer` agent (fix mode)
 *   ORACLE     — measures the gap to "done"     → the quality gate + the review fan-out
 *   CONTROLLER — decides next action + when stop → the while-loop + its guards below
 *
 * Two topologies are composed here:
 *   • generate→verify : reviewers PROPOSE findings, independent skeptics CONFIRM them
 *   • convergence     : fix → re-measure → repeat until the oracle is satisfied
 *
 * Modes (pass via Workflow `args`):
 *   { mode: "report" }  (default) — one read-only pass: gate + review + verify. No edits.
 *   { mode: "fix" }               — the full loop: also delegates fixes and re-gates.
 *
 * Other args (all optional):
 *   maxRounds   number   fix-mode iteration cap (backstop against infinite loops). default 3
 *   gate        string[] gate commands to run. default ["typecheck","lint","test","build"]
 *   scope       string   what to review. default the current uncommitted git diff
 *   minBudget   number   stop fix loop if fewer than this many output tokens remain. default 80000
 */

export const meta = {
  name: 'loop-until-clean',
  description: 'Fan out the specialist agents to review the diff, adversarially verify each finding, fix the real ones, and re-run the quality gate until it converges.',
  whenToUse: 'After making changes, to drive the codebase to a green quality gate with no outstanding review findings. Run mode:"report" for a read-only audit, mode:"fix" to auto-correct.',
  phases: [
    { title: 'Gate', detail: 'run typecheck/lint/test/build and capture pass/fail' },
    { title: 'Review', detail: 'reviewer ∥ security ∥ a11y ∥ perf ∥ design-fidelity (parallel)' },
    { title: 'Verify', detail: 'adversarially confirm each finding is real' },
    { title: 'Fix', detail: 'implementer applies fixes for confirmed findings + gate failures' },
  ],
}

// ── Config (args with safe defaults) ─────────────────────────────────────────
const mode = (args && args.mode) || 'report'
const maxRounds = (args && args.maxRounds) || 3
const gateCmds = (args && args.gate) || ['typecheck', 'lint', 'test', 'build']
const scope = (args && args.scope) || 'the current uncommitted changes (run `git diff` and `git diff --staged`)'
const minBudget = (args && args.minBudget) || 80_000

// ── Structured-output schemas (validated at the tool layer; agents retry on miss) ─
const FINDINGS_SCHEMA = {
  type: 'object', additionalProperties: false, required: ['findings'],
  properties: {
    findings: {
      type: 'array',
      items: {
        type: 'object', additionalProperties: false,
        required: ['severity', 'file', 'title', 'why', 'fix'],
        properties: {
          severity: { type: 'string', enum: ['blocker', 'should-fix', 'nit'] },
          file: { type: 'string' },
          line: { type: 'number' },
          title: { type: 'string' },
          why: { type: 'string' },
          fix: { type: 'string' },
        },
      },
    },
  },
}

const VERDICT_SCHEMA = {
  type: 'object', additionalProperties: false,
  required: ['isReal', 'confidence', 'reasoning'],
  properties: {
    isReal: { type: 'boolean' },
    confidence: { type: 'string', enum: ['low', 'medium', 'high'] },
    reasoning: { type: 'string' },
  },
}

const GATE_SCHEMA = {
  type: 'object', additionalProperties: false, required: ['pass', 'results'],
  properties: {
    pass: { type: 'boolean' },
    results: {
      type: 'array',
      items: {
        type: 'object', additionalProperties: false, required: ['command', 'pass'],
        properties: {
          command: { type: 'string' },
          pass: { type: 'boolean' },
          summary: { type: 'string' },
          errorCount: { type: 'number' },
        },
      },
    },
  },
}

const FIX_SCHEMA = {
  type: 'object', additionalProperties: false, required: ['fixed', 'summary'],
  properties: {
    fixed: { type: 'array', items: { type: 'string' } },
    skipped: { type: 'array', items: { type: 'string' } },
    summary: { type: 'string' },
  },
}

// ── The five review dimensions — each maps to one specialist agent in .claude/agents/ ─
const DIMENSIONS = [
  { key: 'correctness', agentType: 'reviewer' },
  { key: 'security', agentType: 'security' },
  { key: 'accessibility', agentType: 'accessibility' },
  { key: 'performance', agentType: 'performance' },
  { key: 'design-fidelity', agentType: 'design-fidelity' },
]

// ── Helpers ──────────────────────────────────────────────────────────────────
const fkey = (f) =>
  `${(f.file || '').toLowerCase()}:${f.line || ''}:${(f.title || '').toLowerCase().slice(0, 80)}`

// ORACLE #1: the deterministic quality gate. A plain agent runs the commands and
// reports machine-checkable pass/fail. nvm is sourced because Node is nvm-managed.
async function runGate(roundLabel) {
  const prompt =
    `Run this project's quality gate and report each command as structured output. Do NOT fix anything.\n\n` +
    `Prepare the toolchain first (Node is managed by nvm; there is no system node):\n` +
    `  source "$HOME/.nvm/nvm.sh" && nvm use default && corepack enable pnpm\n\n` +
    `Then run each command below from the repo root, one at a time, capturing pass/fail, a short summary, ` +
    `and an approximate error count:\n` +
    gateCmds.map((c) => `  pnpm ${c}`).join('\n') +
    `\n\nSet pass=true only if every command exits 0.`
  return agent(prompt, { label: `gate${roundLabel ? ':' + roundLabel : ''}`, phase: 'Gate', schema: GATE_SCHEMA })
}

// ORACLE #2 (actuator-free): fan out every specialist over the diff. Each reviewer
// is BLIND to the others — that diversity is the point (a security smell ≠ an a11y smell).
async function review(roundLabel) {
  const reviews = await parallel(
    DIMENSIONS.map((d) => () =>
      agent(
        `Review ${scope}. Report EVERY finding as structured output per the schema — ` +
          `severity blocker|should-fix|nit, with file, line, why it matters, and a concrete fix. ` +
          `Style nits are owned by Prettier/ESLint; skip them. If nothing, return an empty findings array.`,
        { agentType: d.agentType, label: `review:${d.key}${roundLabel ? ':' + roundLabel : ''}`, phase: 'Review', schema: FINDINGS_SCHEMA },
      ).then((r) => (r && r.findings ? r.findings.map((f) => ({ ...f, dimension: d.key })) : [])),
    ),
  )
  return reviews.filter(Boolean).flat()
}

// generate→VERIFY: an independent skeptic tries to refute each finding. Default to
// not-real unless it can confirm by reading the code. This is the reward-hacking guard
// for the *finders* — it stops plausible-but-wrong findings from driving fixes.
async function verify(findings) {
  const judged = await parallel(
    findings.map((f) => () =>
      agent(
        `Adversarially verify this code-review finding. Default isReal=false unless you can confirm it by reading the actual code.\n\n` +
          `[${f.severity}] (${f.dimension}) ${f.title}\n` +
          `File: ${f.file}${f.line ? ':' + f.line : ''}\n` +
          `Why claimed: ${f.why}\nProposed fix: ${f.fix}\n\n` +
          `Read the referenced code and decide whether this is a real, worth-fixing issue.`,
        { label: `verify:${(f.file || '').split('/').pop()}`, phase: 'Verify', schema: VERDICT_SCHEMA },
      ).then((v) => ({ ...f, verdict: v })),
    ),
  )
  return judged.filter(Boolean)
}

// ACTUATOR: the implementer applies fixes to the real working tree. We batch all
// fixes into ONE agent call per round so parallel edits never clobber each other.
async function applyFixes(gateFailures, findings) {
  const gateBlock = gateFailures.length
    ? gateFailures.map((r) => `  - \`pnpm ${r.command}\` failed: ${r.summary || ''}`).join('\n')
    : '  (none)'
  const findBlock = findings.length
    ? findings.map((f, i) => `  ${i + 1}. [${f.severity}/${f.dimension}] ${f.file}${f.line ? ':' + f.line : ''} — ${f.title}\n     fix: ${f.fix}`).join('\n')
    : '  (none)'
  return agent(
    `Apply minimal, focused fixes to the working tree for the issues below. Match existing conventions ` +
      `(read AGENTS.md). Make NO unrelated changes. Do not run the full gate — the workflow re-runs it.\n\n` +
      `Quality-gate failures:\n${gateBlock}\n\nConfirmed review findings:\n${findBlock}\n\n` +
      `Report which titles you fixed, which you skipped (with why), and a one-line summary.`,
    { agentType: 'implementer', label: 'fix', phase: 'Fix', schema: FIX_SCHEMA },
  )
}

// ── CONTROLLER ───────────────────────────────────────────────────────────────

// REPORT MODE: a single read-only pass. No actuator runs, so looping would be
// pointless — the state the oracle measures never changes.
if (mode === 'report') {
  phase('Gate')
  const gate = await runGate()
  phase('Review')
  const found = await review()
  // dedup within the pass
  const seen = new Set()
  const unique = found.filter((f) => (seen.has(fkey(f)) ? false : seen.add(fkey(f))))
  phase('Verify')
  const judged = await verify(unique)
  const real = judged.filter((f) => f.verdict && f.verdict.isReal)
  const dismissed = judged.filter((f) => !(f.verdict && f.verdict.isReal))
  log(`report: gate ${gate.pass ? 'PASS' : 'FAIL'} · ${real.length} confirmed / ${dismissed.length} dismissed of ${unique.length} raw`)
  return {
    mode, gatePass: gate.pass, gate: gate.results,
    confirmed: real.map((f) => ({ severity: f.severity, dimension: f.dimension, file: f.file, line: f.line, title: f.title, why: f.why, fix: f.fix, confidence: f.verdict.confidence })),
    dismissed: dismissed.map((f) => ({ dimension: f.dimension, title: f.title, reason: f.verdict && f.verdict.reasoning })),
  }
}

// FIX MODE: the convergence loop.
const seen = new Set()        // dedup vs ALL rounds, so verified-then-deferred findings don't reappear forever
const confirmedAll = []
let round = 0
let prevErrorTotal = Infinity // for the no-progress / oscillation guard
const trace = []

while (round < maxRounds) {
  round++
  const tag = `r${round}`

  // 1. MEASURE — gate + fresh review
  phase('Gate')
  const gate = await runGate(tag)
  phase('Review')
  const found = await review(tag)
  const fresh = found.filter((f) => (seen.has(fkey(f)) ? false : seen.add(fkey(f))))

  // 2. STOP — converged: gate green AND no new findings
  if (gate.pass && fresh.length === 0) {
    log(`✔ converged after ${round} round(s): gate green, no new findings`)
    trace.push({ round, gatePass: true, fresh: 0, action: 'converged' })
    break
  }

  // 3. CONFIRM — verify the fresh findings before spending fixes on them
  phase('Verify')
  const judged = await verify(fresh)
  const real = judged.filter((f) => f.verdict && f.verdict.isReal)
  confirmedAll.push(...real)
  const gateFailures = gate.results.filter((r) => !r.pass)

  if (real.length === 0 && gateFailures.length === 0) {
    log(`round ${round}: nothing actionable (gate green, ${fresh.length} findings all dismissed)`)
    trace.push({ round, gatePass: gate.pass, fresh: fresh.length, confirmed: 0, action: 'no-op' })
    break
  }

  // 4. ACT — fix gate failures + confirmed findings
  phase('Fix')
  const fix = await applyFixes(gateFailures, real)
  const fixedCount = (fix && fix.fixed && fix.fixed.length) || 0
  log(`round ${round}: gate ${gate.pass ? 'green' : gateFailures.length + ' failing'} · ${real.length} confirmed · fixed ${fixedCount}`)
  trace.push({ round, gatePass: gate.pass, fresh: fresh.length, confirmed: real.length, fixed: fixedCount })

  // 5. GUARD — no progress (oscillation): errors didn't drop AND nothing got fixed → bail
  const errTotal = gateFailures.reduce((a, r) => a + (r.errorCount || 1), 0)
  if (errTotal >= prevErrorTotal && fixedCount === 0) {
    log(`⚠ no progress (errors ${prevErrorTotal}→${errTotal}, 0 fixed) — bailing to avoid an infinite loop`)
    trace.push({ round, action: 'bail:no-progress' })
    break
  }
  prevErrorTotal = errTotal

  // 6. GUARD — budget: stop while there's headroom to report cleanly
  if (budget.total && budget.remaining() < minBudget) {
    log(`⚠ budget low (${Math.round(budget.remaining() / 1000)}k left) — stopping`)
    trace.push({ round, action: 'bail:budget' })
    break
  }
}

if (round >= maxRounds) log(`reached maxRounds=${maxRounds} — stopping (run again to continue)`)

// Final read of the oracle so the caller knows the real end state.
phase('Gate')
const finalGate = await runGate('final')
return {
  mode, rounds: round, converged: finalGate.pass,
  finalGatePass: finalGate.pass, finalGate: finalGate.results,
  confirmedFixed: confirmedAll.map((f) => ({ dimension: f.dimension, file: f.file, title: f.title })),
  trace,
}
