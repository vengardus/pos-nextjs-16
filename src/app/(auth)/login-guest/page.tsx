import { Suspense } from "react";
import { LoginGuestForm } from "./components/login-guest-form";

export default function LoginGuestPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="w-full max-w-md bg-card p-8 rounded-2xl shadow-lg border">
        <h1 className="text-2xl font-bold mb-2">Modo Invitado</h1>
        <p className="text-muted-foreground mb-6">Ingresa un alias para explorar el sistema.</p>
        <Suspense fallback={<div>Cargando...</div>}>
            <LoginGuestForm />
        </Suspense>
      </div>
    </div>
  );
}
