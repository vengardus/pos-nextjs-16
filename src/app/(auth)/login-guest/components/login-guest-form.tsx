"use client";

import { useActionState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ButtonSave } from "@/components/common/buttons/button-save";
import { Input } from "@/components/ui/input";
import { authSignupDemoGuestAction } from "@/server/modules/auth/next/actions/auth.signup-demo-guest.action";
import { toast } from "sonner";
import { ResponseAction } from "@/shared/types/common/response-action.interface";

export const LoginGuestForm = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

// En la Server Action authSignupDemoGuestAction (src/server/modules/auth/next/actions/auth.signup-demo-guest.action.ts):
// export const authSignupDemoGuestAction = async (state: ResponseAction | null, formData: FormData): Promise<ResponseAction> => { ... }

// Recuperamos estado, dispatch (action) y isPending
const [state, action, isPending] = useActionState(async (_prev: ResponseAction | null, formData: FormData) => {
    return await authSignupDemoGuestAction(formData);
}, null);

useEffect(() => {
  if (state && !state.success) {
    toast.error(state.message);
  }
}, [state]);

return (
  <form action={action} className="flex flex-col gap-4 w-full max-w-sm">
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

    <ButtonSave 
      isPending={!!isPending} 
      label="Ingresar como invitado" 
      pendingLabel="Ingresando..." 
      className="h-12 rounded-xl"
    />
  </form>

  );
};
