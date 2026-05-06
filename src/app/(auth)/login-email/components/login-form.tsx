"use client";

import Link from "next/link"

import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"

import { useLoginForm } from "@/app/(auth)/hooks/use-login-form"
import { LoginHeader } from "../../login/components/login-header"
import { InputFieldForm } from "@/components/common/form/input-field-form"
import { Footer } from "@/components/layout/footer/footer"

export function LoginForm() {
  const { form, handleLoginCredentials, isPending, messageLoginError } =
    useLoginForm(false)

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="relative flex min-h-screen flex-col items-center justify-between px-4 py-10">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-16 top-10 h-72 w-72 rounded-full bg-emerald-300/25 blur-3xl dark:bg-emerald-500/10" />
          <div className="absolute right-0 top-24 h-80 w-80 rounded-full bg-sky-300/25 blur-3xl dark:bg-sky-500/10" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(15,23,42,0.08),transparent_55%)] dark:bg-[radial-gradient(circle_at_top,rgba(15,23,42,0.35),transparent_60%)]" />
        </div>

        <div className="relative w-full max-w-lg space-y-6">
          <LoginHeader />

          <div className="rounded-3xl border border-slate-200/70 bg-white/90 p-8 shadow-xl backdrop-blur dark:border-slate-800/70 dark:bg-slate-950/60 sm:p-10">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Link>

            <div className="mt-6 space-y-1 text-center">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
                Modo Empleado
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Accede con tus credenciales institucionales.
              </p>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleLoginCredentials)}
                className="mt-8 space-y-6"
              >
                <InputFieldForm
                  control={form.control}
                  name="email"
                  label="Correo electrónico"
                  flexDirection="column"
                  placeholder="correo@ejemplo.com"
                  className="bg-white/90 text-slate-900 border-slate-200/70 dark:bg-slate-900/70 dark:text-slate-100 dark:border-slate-700/70"
                />

                <InputFieldForm
                  control={form.control}
                  name="password"
                  label="Contraseña"
                  flexDirection="column"
                  type="password"
                  placeholder="contraseña"
                  className="bg-white/90 text-slate-900 border-slate-200/70 dark:bg-slate-900/70 dark:text-slate-100 dark:border-slate-700/70"
                />

                <Button
                  type="submit"
                  className="w-full rounded-full bg-primary py-6 text-base font-semibold text-primary-foreground shadow-lg transition hover:bg-primary/90"
                >
                  {isPending ? "Iniciando sesión..." : "Iniciar sesión"}
                </Button>

                {messageLoginError && (
                  <p className="mt-2 text-center text-sm text-red-500">
                    {messageLoginError}
                  </p>
                )}
              </form>
            </Form>
          </div>
        </div>

        <div className="relative w-full">
          <Footer />
        </div>
      </div>
    </div>
  )
}
