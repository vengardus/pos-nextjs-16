"use client";

import { useEffect, useRef, useActionState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";

interface LoginGuestResumeActionsProps {
  callbackUrl: string;
  nickname: string;
  action: (state: any, formData: FormData) => Promise<any>;
}

export function LoginGuestResumeActions({ callbackUrl, nickname, action }: LoginGuestResumeActionsProps) {
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
    <div className="mt-4 grid gap-2 sm:grid-cols-2">
      <form action={formAction}>
        <input type="hidden" name="callbackUrl" value={callbackUrl} />
        <input type="hidden" name="nickname" value={nickname} />
        <input type="hidden" name="continueExisting" value="1" />
        <input type="hidden" name="timezone" ref={timezoneRef} />
        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-full bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-700 disabled:opacity-50"
        >
          {isPending ? "Procesando..." : "Continuar sesión demo"}
        </button>
      </form>

      <Link
        href={callbackUrl ? `/login-guest?callbackUrl=${encodeURIComponent(callbackUrl)}` : "/login-guest"}
        className="inline-flex items-center justify-center rounded-full border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
      >
        Cambiar nick
      </Link>
    </div>
  );
}
