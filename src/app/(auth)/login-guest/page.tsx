import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { redirect } from "next/navigation";
import { LoginHeader } from "@/app/(auth)/login/components/login-header";
import { Footer } from "@/components/layout/footer/footer";
import { authSignupDemoGuestAction } from "@/server/modules/auth/next/actions/auth.signup-demo-guest.action";
import { LoginGuestForm } from "@/app/(auth)/login-guest/components/login-guest-form";
import { LoginGuestResumeActions } from "@/app/(auth)/login-guest/components/login-guest-resume-actions";

type LoginGuestPageProps = {
  searchParams?: Promise<{
    callbackUrl?: string;
    error?: string;
    nickname?: string;
    resume?: string;
  }>;
};

async function handleGuestSignup(formData: FormData): Promise<void> {
  "use server";

  const resp = await authSignupDemoGuestAction(formData);
  if (!resp.success) {
    const callbackUrl = (formData.get("callbackUrl") as string | null) || "";
    const nickname = (formData.get("nickname") as string | null) || "";
    const requiresResumeDecision = Boolean(
      (resp.data as { requiresGuestResumeDecision?: boolean } | undefined)
        ?.requiresGuestResumeDecision
    );
    const error = encodeURIComponent(resp.message ?? "No se pudo crear invitado.");
    const callbackQuery = callbackUrl
      ? `&callbackUrl=${encodeURIComponent(callbackUrl)}`
      : "";
    const resumeQuery = requiresResumeDecision ? "&resume=1" : "";
    redirect(
      `/login-guest?error=${error}&nickname=${encodeURIComponent(
        nickname
      )}${resumeQuery}${callbackQuery}`
    );
  }
}

export default async function LoginGuestPage({ searchParams }: LoginGuestPageProps) {
  const params = await searchParams;
  const callbackUrl = params?.callbackUrl || "";
  const canResume = params?.resume === "1";
  const backHref = callbackUrl
    ? `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`
    : "/login";

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

            <LoginGuestForm
              callbackUrl={callbackUrl}
              defaultNickname={params?.nickname || ""}
              action={handleGuestSignup}
              error={params?.error}
            />

            {canResume ? (
              <LoginGuestResumeActions
                callbackUrl={callbackUrl}
                nickname={params?.nickname || ""}
                action={handleGuestSignup}
              />
            ) : null}
          </div>
        </div>

        <div className="relative w-full">
          <Footer />
        </div>
      </div>
    </div>
  );
}
