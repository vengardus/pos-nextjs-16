"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

interface LoginGuestResumeActionsProps {
  callbackUrl: string;
  nickname: string;
  action: (formData: FormData) => Promise<void>;
}

export function LoginGuestResumeActions({ callbackUrl, nickname, action }: LoginGuestResumeActionsProps) {
  const timezoneRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (timezoneRef.current) {
      timezoneRef.current.value = Intl.DateTimeFormat().resolvedOptions().timeZone;
    }
  }, []);

  return (
    <div className="mt-4 grid gap-2 sm:grid-cols-2">
      <form action={action}>
        <input type="hidden" name="callbackUrl" value={callbackUrl} />
        <input type="hidden" name="nickname" value={nickname} />
        <input type="hidden" name="continueExisting" value="1" />
        <input type="hidden" name="timezone" ref={timezoneRef} />
        <button
          type="submit"
          className="w-full rounded-full bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-700"
        >
          Continuar sesión demo
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
