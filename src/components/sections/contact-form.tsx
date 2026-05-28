"use client";

import { useEffect, useRef } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Send } from "lucide-react";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Field, fieldControlClass } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useContactMutation } from "@/hooks/use-contact-mutation";
import { PROJECT_TYPES } from "@/lib/data/studio";
import { contactSchema, type ContactInput } from "@/lib/validation/contact";
import { cn } from "@/lib/utils";

export function ContactForm() {
  const mutation = useContactMutation();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      type: PROJECT_TYPES[0],
      message: "",
    },
  });

  const onSubmit = handleSubmit((values) => mutation.mutate(values));

  // Move focus to (and announce) the confirmation when the pitch is accepted.
  const successRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (mutation.isSuccess) successRef.current?.focus();
  }, [mutation.isSuccess]);

  if (mutation.isSuccess) {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        aria-live="polite"
        className="animate-in fade-in slide-in-from-bottom-2 py-8 text-center duration-500 outline-none"
      >
        <div
          className="text-fg-on-accent mx-auto mb-[22px] grid size-16 place-items-center rounded-full [&_svg]:size-[30px]"
          style={{ background: "var(--accent-grad)" }}
        >
          <Check />
        </div>
        <h3 className="font-display text-[34px]">Pitch received.</h3>
        <p className="text-fg-2 mt-3">
          Thanks — we&apos;ll get back to you shortly. Keep an eye on your
          inbox.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2">
        <Field label="Name" htmlFor="f-name" error={errors.name?.message}>
          <Input
            id="f-name"
            placeholder="Your name"
            autoComplete="name"
            aria-invalid={Boolean(errors.name)}
            className={fieldControlClass}
            {...register("name")}
          />
        </Field>
        <Field label="Email" htmlFor="f-email" error={errors.email?.message}>
          <Input
            id="f-email"
            type="email"
            placeholder="you@studio.com"
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            className={fieldControlClass}
            {...register("email")}
          />
        </Field>
      </div>

      <div className="mt-[18px] grid grid-cols-1 gap-[18px] sm:grid-cols-2">
        <Field
          label="Company / Studio"
          htmlFor="f-company"
          error={errors.company?.message}
        >
          <Input
            id="f-company"
            placeholder="Optional"
            autoComplete="organization"
            aria-invalid={Boolean(errors.company)}
            className={fieldControlClass}
            {...register("company")}
          />
        </Field>
        <Field label="Project type" htmlFor="f-type">
          <Controller
            control={control}
            name="type"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  id="f-type"
                  className={cn(
                    fieldControlClass,
                    "justify-between data-[size=default]:h-auto",
                  )}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PROJECT_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </Field>
      </div>

      <Field
        label="Tell us about it"
        htmlFor="f-msg"
        error={errors.message?.message}
        className="mt-[18px]"
      >
        <Textarea
          id="f-msg"
          placeholder="What are you building? Scope, timeline, dreams…"
          aria-invalid={Boolean(errors.message)}
          className={cn(fieldControlClass, "min-h-[120px] resize-y")}
          {...register("message")}
        />
      </Field>

      {mutation.isError ? (
        <p
          role="alert"
          className="mt-3 font-mono text-xs text-[color:var(--danger-text)]"
        >
          {mutation.error?.message}
        </p>
      ) : null}

      <div className="mt-2 flex flex-wrap items-center gap-4 pt-1.5">
        <Button
          type="submit"
          variant="primary"
          size="pill"
          disabled={mutation.isPending}
        >
          <Send /> {mutation.isPending ? "Sending…" : "Send pitch"}
        </Button>
        <span className="text-fg-3 font-mono text-[11.5px]">
          No spam. No newsletter. Just a reply.
        </span>
      </div>
    </form>
  );
}
