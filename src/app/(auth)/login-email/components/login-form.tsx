"use client";

import Link from "next/link";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

import { useLoginForm } from "@/hooks/auth/use-login-form";
import { LoginHeader } from "../../login/components/login-header";
import { InputFieldForm } from "@/components/common/form/input-field-form";
import { Footer } from "@/components/layout/footer/footer";

export function LoginForm() {
  const { form, handleLoginCredentials, isPending, messageLoginError } = useLoginForm(false);

  return (
    <div className="min-h-screen bg-background text-white flex flex-col items-center justify-between py-8 pt-20">
      <LoginHeader />

      <Link href="/login" className="flex items-center text-white mb-6">
        <ArrowLeft className="mr-2" />
        <span>Volver</span>
      </Link>

      <h2 className="text-2xl font-bold mb-0">Modo Empleado:</h2>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleLoginCredentials)}
          className="space-y-6  w-full max-w-md rounded-lg p-8"
        >
          <InputFieldForm
            control={form.control}
            name="email"
            label="Correo electrónico"
            flexDirection="column"
            placeholder="correo@ejemplo.com"
            className="dark:bg-[#1a1633] text-foreground border-gray-700"
          />

          <InputFieldForm
            control={form.control}
            name="password"
            label="Contraseña"
            flexDirection="column"
            type="password"
            placeholder="contraseña"
            className="dark:bg-[#1a1633] text-foreground border-gray-700"
          />

          <Button
            type="submit"
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white p-[1.7rem] rounded-full text-lg"
          >
            {isPending ? "Iniciando sesión..." : "Iniciar sesión"}
          </Button>

          {messageLoginError && (
            <p className="text-red-500 text-sm mt-2 text-center">{messageLoginError}</p>
          )}
        </form>
      </Form>

      <Footer />
    </div>
  );
}
