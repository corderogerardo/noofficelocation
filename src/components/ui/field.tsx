import type { ReactNode } from "react";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/** Shared control styling for inputs/textarea/select trigger (design `.field`). */
export const fieldControlClass =
  "h-auto w-full rounded-[12px] border border-border bg-surface-3 px-4 py-3.5 text-[15px] text-fg placeholder:text-fg-3 md:text-[15px] dark:bg-surface-3";

interface FieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  className?: string;
  children: ReactNode;
}

/** Labelled form field with an inline error message. */
export function Field({
  label,
  htmlFor,
  error,
  className,
  children,
}: FieldProps) {
  return (
    <div className={cn("flex flex-col", className)}>
      <Label
        htmlFor={htmlFor}
        className="text-fg-3 mb-[9px] font-mono text-[11px] font-normal tracking-[0.14em] uppercase"
      >
        {label}
      </Label>
      {children}
      {error ? (
        <p
          role="alert"
          className="mt-[7px] font-mono text-xs text-[color:var(--danger-text)]"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
