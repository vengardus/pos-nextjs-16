"use client";

import { useEffect, useRef } from "react";

interface LoginGuestFormProps {
  callbackUrl: string;
  defaultNickname?: string;
  action: (formData: FormData) => void;
  isPending?: boolean;
}

export function LoginGuestForm({ callbackUrl, defaultNickname, action, isPending }: LoginGuestFormProps) {
  const timezoneRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (timezoneRef.current) {
      timezoneRef.current.value = Intl.DateTimeFormat().resolvedOptions().timeZone;
    }
  }, []);

  return (
    <form action={action} className="space-y-4">
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
          key={defaultNickname}
          defaultValue={defaultNickname || ""}
          maxLength={10}
          required
          disabled={isPending}
          className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none ring-emerald-500/40 transition focus:ring disabled:opacity-50 disabled:cursor-not-allowed dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          placeholder="demo_user"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="flex items-center justify-center gap-2 w-full rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:-translate-y-0.5 hover:bg-primary/90 disabled:opacity-50"
      >
        {isPending && <div className="h-4 w-4 border-2 border-slate-200 border-t-white rounded-full animate-spin" />}
        {isPending ? "Procesando..." : "Entrar como invitado"}
      </button>
    </form>
  );
}
