"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LoginHeader } from "@/app/(auth)/login/components/login-header";
import { Footer } from "@/components/layout/footer/footer";
import { authSignupDemoGuestAction } from "@/server/modules/auth/next/actions/auth.signup-demo-guest.action";
import { LoginGuestForm } from "@/app/(auth)/login-guest/components/login-guest-form";
import { LoginGuestResumeActions } from "@/app/(auth)/login-guest/components/login-guest-resume-actions";
import { useActionState, use, useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { signIn } from "next-auth/react";

export default function LoginGuestPage({ searchParams }: { searchParams: Promise<any> }) {
  const params = use(searchParams);
  const callbackUrl = params?.callbackUrl || "";
  const backHref = callbackUrl ? `/login?callbackUrl=${encodeURIComponent(callbackUrl)}` : "/login";

  const [state, formAction, isPending] = useActionState(authSignupDemoGuestAction, null);

  const nickname = state?.data?.nickname ?? params?.nickname ?? "";
  const canResume = state?.data?.requiresGuestResumeDecision === true;

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
    <div className="min-h-screen bg-background text-foreground">
      <div className="relative flex min-h-screen flex-col items-center justify-between px-4 py-10">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-emerald-300/25 blur-3xl dark:bg-emerald-500/10" />
          <div className="absolute right-0 top-24 h-80 w-80 rounded-full bg-sky-300/25 blur-3xl dark:bg-sky-500/10" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(15,23,42,0.08),transparent_55%)] dark:bg-[radial-gradient(circle_at_top,rgba(15,23,42,0.35),transparent_60%)]" />
        </div>

        <div className="relative w-full max-w-lg space-y-6">
          <LoginHeader />

          <div className="rounded-3xl border border-slate-200/70 bg-white/90 p-8 shadow-xl backdrop-blur dark:border-slate-800/70 dark:bg-slate-950/60 sm:p-10">
            <Link
              href={backHref}
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Link>

            <div className="mt-6 space-y-1 text-center">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
                Modo Invitado
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Crea un nickname de hasta 10 caracteres para probar Pulse.
              </p>
            </div>

            <div className="mt-6">
              {(params?.error || state?.message) ? (
                <div className="mb-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-100">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{decodeURIComponent(params?.error || "") || state?.message}</span>
                </div>
              ) : null}

              {canResume ? (
                <LoginGuestResumeActions
                  callbackUrl={callbackUrl}
                  nickname={nickname}
                  action={formAction}
                  isPending={isPending}
                />
              ) : (
                <LoginGuestForm
                  callbackUrl={callbackUrl}
                  defaultNickname={nickname}
                  action={formAction}
                  isPending={isPending}
                />
              )}
            </div>
          </div>
        </div>

        <div className="relative w-full">
          <Footer />
        </div>
      </div>
    </div>
  );
}