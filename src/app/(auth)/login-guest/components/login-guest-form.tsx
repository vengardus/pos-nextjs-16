"use client";

import { useSearchParams } from "next/navigation";
import { ButtonSave } from "@/components/common/buttons/button-save";
import { Input } from "@/components/ui/input";
import { authSignupDemoGuestAction } from "@/server/modules/auth/next/actions/auth.signup-demo-guest.action";
import { useFormStatus } from "react-dom";

// Componente helper para el estado de carga
const SubmitButton = () => {
  const { pending } = useFormStatus();
  return (
    <ButtonSave 
      isPending={pending} 
      label="Ingresar como invitado" 
      pendingLabel="Ingresando..." 
      className="h-12 rounded-xl"
    />
  );
};

export const LoginGuestForm = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  return (
    <form action={async (formData) => { await authSignupDemoGuestAction(formData); }} className="flex flex-col gap-4 w-full max-w-sm">
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <input type="hidden" name="timezone" value={Intl.DateTimeFormat().resolvedOptions().timeZone} />
      
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Alias / Nickname</label>
        <Input 
          name="nickname" 
          placeholder="Ej: usuario_demo" 
          required 
          className="h-12 rounded-xl"
        />
      </div>

      <SubmitButton />
    </form>
  );
};
