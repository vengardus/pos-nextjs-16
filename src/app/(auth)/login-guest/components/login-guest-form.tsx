"use client";

import { useSearchParams } from "next/navigation";
import { ButtonSave } from "@/components/common/buttons/button-save";
import { Input } from "@/components/ui/input";
import { authSignupDemoGuestAction } from "@/server/modules/auth/next/actions/auth.signup-demo-guest.action";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { useFormStatus } from "react-dom";

const SubmitButton = () => {
  const { pending } = useFormStatus();
  return <ButtonSave isPending={pending} label="Ingresar" pendingLabel="Procesando..." className="h-12 rounded-xl" />;
};

export const LoginGuestForm = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const handleAction = async (formData: FormData) => {
    console.log("DEBUG: handleAction iniciado");
    const result = await authSignupDemoGuestAction(formData);
    console.log("DEBUG: Resultado de Server Action:", result);
    
    if (!result.success) {
      toast.error(result.message || "Error desconocido");
      return;
    }

    console.log("DEBUG: Intentando signIn...");
    // Login manual tras el registro/verificación
    const signInResult = await signIn("credentials", {
        email: result.data.email,
        password: result.data.generatedPassword,
        callbackUrl,
    });
    console.log("DEBUG: Resultado de signIn:", signInResult);
  };

  return (
    <form action={handleAction} className="flex flex-col gap-4 w-full max-w-sm">
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <input type="hidden" name="timezone" value={Intl.DateTimeFormat().resolvedOptions().timeZone} />
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Alias / Nickname</label>
        <Input name="nickname" placeholder="Ej: usuario_demo" required className="h-12 rounded-xl" />
      </div>
      <SubmitButton />
    </form>
  );
};
