/* ============================================================
   NO OFFICE LOCATION — Hero 3D scene
   Low-poly sun rising over an animated ocean. Typed port of the
   design prototype's vanilla Three.js scene, encapsulated as a
   self-contained, disposable class.
   ============================================================ */
import * as THREE from "three";

const C = {
  sun_core: 0xffe01b,
  sun_gold: 0xffb200,
  sun_amber: 0xff8a1e,
  sun_ember: 0xf26419,
  royal: 0x1f44e0,
  azure: 0x2e7df6,
  sky: 0x36c5f0,
  foam: 0x87ecf2,
} as const;

export type HeroPreset = "horizon" | "space" | "synth";
export type HeroAccent = "sun" | "ember" | "ocean";

export interface HeroSceneParams {
  preset: HeroPreset;
  waveIntensity: number;
  reduceMotion: boolean;
  accent: HeroAccent;
  starOpacity: number;
  wireframe: boolean;
  banded: boolean;
  sunY: number;
  camY: number;
  fov: number;
  sunScale: number;
  lookY: number;
  sunX: number;
}

const ACCENTS: Record<HeroAccent, { a: number; b: number; core: number }> = {
  sun: { a: C.sun_amber, b: C.sun_gold, core: C.sun_core },
  ember: { a: C.sun_ember, b: C.sun_amber, core: C.sun_gold },
  ocean: { a: C.azure, b: C.sky, core: C.foam },
};

type PresetConfig = Pick<
  HeroSceneParams,
  | "sunY"
  | "camY"
  | "fov"
  | "sunScale"
  | "lookY"
  | "sunX"
  | "starOpacity"
  | "wireframe"
  | "banded"
>;

const PRESETS: Record<HeroPreset, PresetConfig> = {
  horizon: {
    sunY: 4.4,
    camY: 4.2,
    fov: 48,
    sunScale: 1.0,
    lookY: 3.4,
    sunX: 8,
    starOpacity: 0.5,
    wireframe: false,
    banded: false,
  },
  space: {
    sunY: 9.5,
    camY: 6.5,
    fov: 56,
    sunScale: 1.18,
    lookY: 6.0,
    sunX: 5,
    starOpacity: 1.0,
    wireframe: false,
    banded: false,
  },
  synth: {
    sunY: 5.2,
    camY: 3.4,
    fov: 52,
    sunScale: 1.05,
    lookY: 4.2,
    sunX: 7,
    starOpacity: 0.7,
    wireframe: true,
    banded: true,
  },
};

const DEFAULT_PARAMS: HeroSceneParams = {
  preset: "horizon",
  waveIntensity: 1,
  reduceMotion: false,
  accent: "sun",
  starOpacity: 0.55,
  wireframe: false,
  banded: false,
  sunY: 4.4,
  camY: 4.2,
  fov: 48,
  sunScale: 1,
  lookY: 3.4,
  sunX: 8,
};

function radialTexture(stops: Array<[number, string]>): THREE.Texture {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const gradient = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2,
  );
  for (const [offset, color] of stops) gradient.addColorStop(offset, color);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  const texture = new THREE.Texture(canvas);
  texture.needsUpdate = true;
  return texture;
}

function bandTexture(): THREE.Texture {
  const w = 8;
  const h = 256;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "#000";
  for (let i = 0; i < h; i += 22) {
    const band = Math.min(10, 2 + i / 30);
    ctx.fillRect(0, i, w, band);
  }
  const texture = new THREE.Texture(canvas);
  texture.needsUpdate = true;
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 1);
  return texture;
}

export class HeroScene {
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private startTime = 0;
  private world!: THREE.Group;

  private sun?: THREE.Mesh;
  private corona?: THREE.Mesh;
  private sunGlow?: THREE.Sprite;
  private sunHalo?: THREE.Sprite;
  private ocean?: THREE.Mesh;
  private oceanGeo?: THREE.PlaneGeometry;
  private stars?: THREE.Points;

  private sunLight?: THREE.DirectionalLight;
  private fillLight?: THREE.DirectionalLight;

  private canvasEl?: HTMLCanvasElement;
  private resizeObserver?: ResizeObserver;
  private raf: number | null = null;
  private lastW = 0;
  private lastH = 0;

  private _running = false;
  private visible = true;
  private readonly pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  private readonly params: HeroSceneParams = { ...DEFAULT_PARAMS };

  /* ---- bound listeners (so we can remove them on destroy) ---- */
  private readonly onPointer = (e: PointerEvent) => {
    this.pointer.tx = (e.clientX / window.innerWidth) * 2 - 1;
    this.pointer.ty = (e.clientY / window.innerHeight) * 2 - 1;
  };
  private readonly onVisibility = () => {
    this.visible = !document.hidden;
  };
  private readonly frame = () => {
    this.raf = requestAnimationFrame(this.frame);
    if (!this.visible) return;
    this.frameBody();
    this.renderer.render(this.scene, this.camera);
  };

  get running(): boolean {
    return this._running;
  }

  /* ---------- build ---------- */
  private buildSun(): THREE.Group {
    const group = new THREE.Group();
    const ac = ACCENTS[this.params.accent] ?? ACCENTS.sun;

    const geo = new THREE.IcosahedronGeometry(5, 4);
    const mat = new THREE.MeshStandardMaterial({
      color: ac.core,
      emissive: ac.a,
      emissiveIntensity: 1.25,
      roughness: 0.55,
      metalness: 0.0,
      flatShading: true,
    });
    this.sun = new THREE.Mesh(geo, mat);
    group.add(this.sun);

    const coronaGeo = new THREE.IcosahedronGeometry(5.7, 2);
    const coronaMat = new THREE.MeshBasicMaterial({
      color: ac.b,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    this.corona = new THREE.Mesh(coronaGeo, coronaMat);
    group.add(this.corona);

    const glowTex = radialTexture([
      [0, "rgba(255,224,27,0.95)"],
      [0.25, "rgba(255,138,30,0.55)"],
      [0.55, "rgba(242,100,25,0.18)"],
      [1, "rgba(242,100,25,0)"],
    ]);
    this.sunGlow = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: glowTex,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    this.sunGlow.scale.set(34, 34, 1);
    this.sunGlow.position.z = -1;
    group.add(this.sunGlow);

    this.sunHalo = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: glowTex,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        opacity: 0.6,
      }),
    );
    this.sunHalo.scale.set(15, 15, 1);
    group.add(this.sunHalo);

    return group;
  }

  private buildOcean(): THREE.Mesh {
    const geo = new THREE.PlaneGeometry(180, 120, 150, 110);
    geo.rotateX(-Math.PI / 2);

    const pos = geo.attributes.position;
    const colors: number[] = [];
    const cRoyal = new THREE.Color(C.royal);
    const cAzure = new THREE.Color(C.azure);
    const cSky = new THREE.Color(C.sky);
    for (let i = 0; i < pos.count; i++) {
      const z = pos.getZ(i);
      const t = THREE.MathUtils.clamp((z + 60) / 120, 0, 1);
      const col =
        t < 0.5
          ? cRoyal.clone().lerp(cAzure, t / 0.5)
          : cAzure.clone().lerp(cSky, (t - 0.5) / 0.5);
      colors.push(col.r, col.g, col.b);
    }
    geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    geo.userData.base = Float32Array.from(pos.array);

    const mat = new THREE.MeshStandardMaterial({
      vertexColors: true,
      flatShading: true,
      roughness: 0.42,
      metalness: 0.12,
      wireframe: this.params.wireframe,
    });
    this.oceanGeo = geo;
    this.ocean = new THREE.Mesh(geo, mat);
    this.ocean.position.y = -1.4;
    return this.ocean;
  }

  private buildStars(): THREE.Points {
    const n = 1400;
    const arr = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const r = 60 + Math.random() * 120;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(ph) * Math.cos(th);
      arr[i * 3 + 1] = Math.abs(r * Math.cos(ph)) * 0.7 + 4;
      arr[i * 3 + 2] = -Math.abs(r * Math.sin(ph) * Math.sin(th)) - 10;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(arr, 3));
    const mat = new THREE.PointsMaterial({
      color: 0xcfe9ff,
      size: 0.7,
      sizeAttenuation: true,
      transparent: true,
      opacity: this.params.starOpacity,
      depthWrite: false,
    });
    this.stars = new THREE.Points(geo, mat);
    return this.stars;
  }

  /* ---------- presets / accent ---------- */
  private applyPreset(): void {
    const p = PRESETS[this.params.preset] ?? PRESETS.horizon;
    Object.assign(this.params, p);
    if (this.camera) {
      this.camera.fov = this.params.fov;
      this.camera.updateProjectionMatrix();
    }
    if (this.stars) {
      (this.stars.material as THREE.PointsMaterial).opacity =
        this.params.starOpacity;
    }
    if (this.ocean) {
      (this.ocean.material as THREE.MeshStandardMaterial).wireframe =
        this.params.wireframe;
    }
    if (this.sun?.parent) {
      this.sun.parent.position.y = this.params.sunY;
      this.sun.parent.position.x = this.params.sunX;
      this.sun.parent.scale.setScalar(this.params.sunScale);
    }
    if (this.sun) {
      const mat = this.sun.material as THREE.MeshStandardMaterial;
      if (this.params.banded && !mat.alphaMap) {
        mat.alphaMap = bandTexture();
        mat.transparent = true;
        mat.emissiveIntensity = 1.7;
        mat.needsUpdate = true;
      } else if (!this.params.banded && mat.alphaMap) {
        mat.alphaMap = null;
        mat.transparent = false;
        mat.emissiveIntensity = 1.25;
        mat.needsUpdate = true;
      }
    }
    if (this.ocean) {
      const mat = this.ocean.material as THREE.MeshStandardMaterial;
      mat.metalness = this.params.wireframe ? 0.0 : 0.12;
      mat.emissive = new THREE.Color(this.params.wireframe ? C.sky : 0x000000);
      mat.emissiveIntensity = this.params.wireframe ? 0.4 : 0;
    }
  }

  private applyAccent(): void {
    const ac = ACCENTS[this.params.accent] ?? ACCENTS.sun;
    if (this.sun) {
      const mat = this.sun.material as THREE.MeshStandardMaterial;
      mat.color.setHex(ac.core);
      mat.emissive.setHex(ac.a);
    }
    if (this.corona) {
      (this.corona.material as THREE.MeshBasicMaterial).color.setHex(ac.b);
    }
    if (this.sunLight) this.sunLight.color.setHex(ac.a);
  }

  /* ---------- animate ---------- */
  private frameBody(): void {
    const t = (performance.now() - this.startTime) / 1000;
    const speed = this.params.reduceMotion ? 0 : 1;

    if (
      this.ocean &&
      this.oceanGeo &&
      (speed || this.oceanGeo.userData.dirty !== false)
    ) {
      const pos = this.oceanGeo.attributes.position;
      const base = this.oceanGeo.userData.base as Float32Array;
      const amp = this.params.waveIntensity;
      const tt = t * speed;
      for (let i = 0; i < pos.count; i++) {
        const x = base[i * 3];
        const z = base[i * 3 + 2];
        const y =
          Math.sin(x * 0.18 + tt * 0.9) * 0.55 +
          Math.sin(z * 0.22 + tt * 0.7) * 0.65 +
          Math.sin((x + z) * 0.12 + tt * 1.3) * 0.4;
        pos.setY(i, y * amp);
      }
      pos.needsUpdate = true;
      this.oceanGeo.computeVertexNormals();
      this.oceanGeo.userData.dirty = speed ? true : false;
    }

    if (this.sun && this.corona && this.sunHalo && speed) {
      this.sun.rotation.y += 0.0016;
      this.sun.rotation.x += 0.0006;
      this.corona.rotation.y -= 0.0011;
      this.corona.rotation.z += 0.0007;
      const pulse = 1 + Math.sin(t * 1.2) * 0.04;
      this.sunHalo.scale.set(15 * pulse, 15 * pulse, 1);
    }
    if (this.stars && speed) this.stars.rotation.y = t * 0.006;

    this.pointer.x += (this.pointer.tx - this.pointer.x) * 0.05;
    this.pointer.y += (this.pointer.ty - this.pointer.y) * 0.05;
    if (this.world) {
      this.world.rotation.y = this.pointer.x * 0.18;
      this.world.rotation.x = -this.pointer.y * 0.08;
    }
    this.camera.position.x = this.pointer.x * 1.6;
    this.camera.position.y = this.params.camY - this.pointer.y * 1.0;
    this.camera.lookAt(0, this.params.lookY, -8);
  }

  private resize(): void {
    if (!this.canvasEl || !this.renderer) return;
    const w = this.canvasEl.clientWidth;
    const h = this.canvasEl.clientHeight;
    if (w === 0 || h === 0 || (w === this.lastW && h === this.lastH)) return;
    this.lastW = w;
    this.lastH = h;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }

  /* ---------- lifecycle ---------- */
  init(canvas: HTMLCanvasElement, opts: Partial<HeroSceneParams> = {}): void {
    this.canvasEl = canvas;
    Object.assign(this.params, opts);

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    this.renderer.setClearColor(0x000000, 0);
    this.scene = new THREE.Scene();
    this.startTime = performance.now();

    this.camera = new THREE.PerspectiveCamera(this.params.fov, 1, 0.1, 400);
    this.camera.position.set(0, this.params.camY, 26);

    this.world = new THREE.Group();
    this.scene.add(this.world);

    this.sunLight = new THREE.DirectionalLight(C.sun_amber, 2.2);
    this.sunLight.position.set(8, 9, -8);
    this.scene.add(this.sunLight);
    this.fillLight = new THREE.DirectionalLight(C.sky, 0.7);
    this.fillLight.position.set(-6, 4, 14);
    this.scene.add(this.fillLight);
    this.scene.add(new THREE.HemisphereLight(0x9fd4ff, 0x0a1430, 0.55));
    this.scene.add(new THREE.AmbientLight(0x223a66, 0.5));

    this.world.add(this.buildStars());
    this.world.add(this.buildOcean());
    const sunGrp = this.buildSun();
    sunGrp.position.set(this.params.sunX, this.params.sunY, -22);
    this.world.add(sunGrp);

    this.applyPreset();
    this.applyAccent();
    this.resize();

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(canvas);
    document.addEventListener("visibilitychange", this.onVisibility);

    this._running = true;
    if (this.params.reduceMotion) {
      // Reduced motion: render a single static frame — no rAF loop, no parallax.
      this.tick(1);
    } else {
      window.addEventListener("pointermove", this.onPointer);
      this.raf = requestAnimationFrame(this.frame);
    }
  }

  setParams(p: Partial<HeroSceneParams> = {}): void {
    const presetChanged = p.preset && p.preset !== this.params.preset;
    const accentChanged = p.accent && p.accent !== this.params.accent;
    Object.assign(this.params, p);
    if (presetChanged) {
      this.applyPreset();
    } else {
      if ("starOpacity" in p && this.stars) {
        (this.stars.material as THREE.PointsMaterial).opacity =
          this.params.starOpacity;
      }
      if ("wireframe" in p && this.ocean) {
        (this.ocean.material as THREE.MeshStandardMaterial).wireframe =
          this.params.wireframe;
      }
    }
    if (accentChanged) this.applyAccent();
    if ("reduceMotion" in p && this.oceanGeo) {
      this.oceanGeo.userData.dirty = true;
    }
  }

  /** Render synchronously without the rAF loop (used by tests / hidden tabs). */
  tick(steps = 1): void {
    const saved = this.visible;
    this.visible = true;
    for (let i = 0; i < steps; i++) this.frameBody();
    this.renderer.render(this.scene, this.camera);
    this.visible = saved;
  }

  destroy(): void {
    if (this.raf !== null) cancelAnimationFrame(this.raf);
    this.raf = null;
    this.resizeObserver?.disconnect();
    window.removeEventListener("pointermove", this.onPointer);
    document.removeEventListener("visibilitychange", this.onVisibility);
    this._running = false;

    // Release GPU resources.
    this.scene?.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      mesh.geometry?.dispose?.();
      const material = mesh.material;
      if (Array.isArray(material)) material.forEach((m) => m.dispose());
      else material?.dispose?.();
    });
    this.renderer?.dispose();
  }
}
