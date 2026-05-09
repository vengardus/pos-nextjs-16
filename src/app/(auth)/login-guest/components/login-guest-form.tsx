"use client";

import { useEffect, useRef, useActionState } from "react";
import { AlertTriangle } from "lucide-react";
import { signIn } from "next-auth/react";

interface LoginGuestFormProps {
  callbackUrl: string;
  defaultNickname?: string;
  action: (state: any, formData: FormData) => Promise<any>;
  error?: string;
}

export function LoginGuestForm({ callbackUrl, defaultNickname, action, error }: LoginGuestFormProps) {
  const timezoneRef = useRef<HTMLInputElement>(null);
  const [state, formAction, isPending] = useActionState(action, null);

  useEffect(() => {
    if (timezoneRef.current) {
      timezoneRef.current.value = Intl.DateTimeFormat().resolvedOptions().timeZone;
    }
  }, []);

  useEffect(() => {
    if (state?.success && state?.data?.email && state?.data?.password) {
      signIn("credentials", {
        email: state.data.email,
        password: state.data.password,
        redirectTo: callbackUrl,
      });
    }
  }, [state, callbackUrl]);

  return (
    <form action={formAction} className="mt-8 space-y-4">
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <input type="hidden" name="timezone" ref={timezoneRef} />

      <div className="space-y-2">
        <label
          htmlFor="nickname"
          className="text-sm font-medium text-slate-700 dark:text-slate-200"
        >
          Nickname
        </label>
        <input
          id="nickname"
          name="nickname"
          defaultValue={defaultNickname || ""}
          maxLength={10}
          required
          className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none ring-emerald-500/40 transition focus:ring dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          placeholder="demo_user"
        />
      </div>

      {(error || state?.message) ? (
        <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-100">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error || state?.message}</span>
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:-translate-y-0.5 hover:bg-primary/90 disabled:opacity-50"
      >
        {isPending ? "Procesando..." : "Entrar como invitado"}
      </button>
    </form>
  );
}
