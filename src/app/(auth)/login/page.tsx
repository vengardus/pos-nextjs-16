import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

import { LoginHeader } from "@/app/(auth)/login/components/login-header"
import { AUTH_USE_PROVIDER_SELECTOR_FOR_ADMIN } from "@/app/(auth)/login/login.constants"
import { authLoginProviderAction } from "@/server/modules/auth/next/actions/auth.login-provider.action"

export const metadata: Metadata = {
  title: "Ingresar",
  description: "Acceso seguro al sistema POS.",
}

type LoginPageProps = {
  searchParams?: Promise<{
    callbackUrl?: string
    error?: string
  }>
}

async function handleAdminGoogleLogin(formData: FormData): Promise<void> {
  "use server"

  await authLoginProviderAction(formData)
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams
  const callbackUrl = params?.callbackUrl
  const loginError = params?.error
  const loginErrorMessage =
    loginError === "provider_email_not_authorized"
      ? "El email no está autorizado para acceso por proveedor. Usa otro correo."
      : null
  const loginEmailHref = callbackUrl
    ? `/login-email?callbackUrl=${encodeURIComponent(callbackUrl)}`
    : "/login-email"
  const loginGuestHref = callbackUrl
    ? `/login-guest?callbackUrl=${encodeURIComponent(callbackUrl)}`
    : "/login-guest"
  const loginSocialHref = callbackUrl
    ? `/login-social?callbackUrl=${encodeURIComponent(callbackUrl)}`
    : "/login-social"

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="relative flex min-h-screen items-center justify-center px-4 py-12">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-20 top-12 h-72 w-72 rounded-full bg-emerald-300/25 blur-3xl dark:bg-emerald-500/10" />
          <div className="absolute right-0 top-24 h-80 w-80 rounded-full bg-sky-300/25 blur-3xl dark:bg-sky-500/10" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(15,23,42,0.08),transparent_55%)] dark:bg-[radial-gradient(circle_at_top,rgba(15,23,42,0.35),transparent_60%)]" />
        </div>

        <div className="relative w-full max-w-lg space-y-8">
          <LoginHeader />

          <div className="rounded-3xl border border-slate-200/70 bg-white/90 p-8 shadow-xl backdrop-blur dark:border-slate-800/70 dark:bg-slate-950/60 sm:p-10">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
                Ingresar al sistema
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Selecciona tu perfil para continuar con una experiencia segura y personalizada.
              </p>
            </div>

            {loginErrorMessage ? (
              <div className="mt-6 rounded-xl border border-amber-300/80 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-100">
                {loginErrorMessage}
              </div>
            ) : null}

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {AUTH_USE_PROVIDER_SELECTOR_FOR_ADMIN ? (
                <Link href={loginSocialHref} className="group">
                  <AdminAccessCardContent />
                </Link>
              ) : (
                <form action={handleAdminGoogleLogin} className="group">
                  <input type="hidden" name="provider" value="google" />
                  <input
                    type="hidden"
                    name="callbackUrl"
                    value={callbackUrl ?? ""}
                  />
                  <button type="submit" className="w-full text-left">
                    <AdminAccessCardContent />
                  </button>
                </form>
              )}

              <Link href={loginEmailHref} className="group">
                <div className="flex h-full flex-col justify-between gap-6 rounded-2xl border border-transparent bg-slate-900 p-5 text-white transition hover:-translate-y-1 hover:border-slate-700 hover:bg-slate-800 hover:shadow-lg dark:bg-slate-900/70 dark:hover:bg-slate-900">
                  <div className="space-y-2">
                    <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white/80">
                      Empleado
                    </span>
                    <p className="text-sm text-white/70">
                      Operaciones diarias con acceso rápido a tus tareas.
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-white">
                      Acceder
                    </span>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
                      <Image
                        src="/images/androide.png"
                        width={34}
                        height={34}
                        alt="Empleado"
                        className="object-contain"
                      />
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            <div className="mt-4">
              <Link
                href={loginGuestHref}
                className="block rounded-2xl border border-emerald-200/70 bg-emerald-50/80 px-5 py-4 text-sm text-emerald-900 transition hover:-translate-y-0.5 hover:shadow-md dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-100"
              >
                <span className="font-semibold">Entrar como invitado</span>
                <p className="mt-1 text-xs opacity-80">
                  Modo demo con límites controlados.
                </p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function AdminAccessCardContent() {
  return (
    <div className="flex h-full flex-col justify-between gap-6 rounded-2xl border border-transparent bg-amber-50/80 p-5 transition hover:-translate-y-1 hover:border-amber-200 hover:bg-amber-100/80 hover:shadow-lg dark:bg-amber-500/10 dark:hover:border-amber-500/30 dark:hover:bg-amber-500/15">
      <div className="space-y-2">
        <span className="inline-flex rounded-full bg-amber-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-amber-700 dark:bg-amber-500/20 dark:text-amber-200">
          Administrador
        </span>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Crea y gestiona tu empresa con control total.
        </p>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-amber-700 dark:text-amber-200">
          Acceder
        </span>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm dark:bg-slate-900">
          <Image
            src="/images/rey.png"
            width={36}
            height={36}
            alt="Administrador"
            className="object-contain"
          />
        </div>
      </div>
    </div>
  )
}
