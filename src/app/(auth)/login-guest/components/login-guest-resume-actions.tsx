"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/utils/tailwind/cn";

interface LoginGuestResumeActionsProps {
  callbackUrl: string;
  nickname: string;
  action: (formData: FormData) => void;
  isPending?: boolean;
}

export function LoginGuestResumeActions({ callbackUrl, nickname, action, isPending }: LoginGuestResumeActionsProps) {
  const timezoneRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (timezoneRef.current) {
      timezoneRef.current.value = Intl.DateTimeFormat().resolvedOptions().timeZone;
    }
  }, []);

  return (
    <div className="grid gap-2 sm:grid-cols-2">
      <form action={action}>
        <input type="hidden" name="callbackUrl" value={callbackUrl} />
        <input type="hidden" name="nickname" value={nickname} />
        <input type="hidden" name="continueExisting" value="1" />
        <input type="hidden" name="timezone" ref={timezoneRef} />
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center justify-center gap-2 w-full rounded-full bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-700 disabled:bg-emerald-800 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
        >
          {isPending && <div className="h-4 w-4 border-2 border-slate-200 border-t-white rounded-full animate-spin" />}
          {isPending ? "Procesando..." : "Continuar sesión demo"}
        </button>
      </form>

      <a
        href={!isPending ? (callbackUrl ? `/login-guest?callbackUrl=${encodeURIComponent(callbackUrl)}` : "/login-guest") : "#"}
        className={cn(
            "inline-flex items-center justify-center rounded-full border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800",
            isPending && "pointer-events-none opacity-50 cursor-not-allowed"
        )}
      >
        Cambiar nick
      </a>
    </div>
  );
}
