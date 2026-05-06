"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useActionState } from "react";
import { demoPolicyUpdateAction } from "@/server/modules/demo-policy/next/actions/demo-policy.update.action";
import { toast } from "sonner";
import { useEffect } from "react";

export const DemoPolicyForm = ({ policy }: { policy: any }) => {
  const [state, action, isPending] = useActionState(async (_prevState: any, formData: FormData) => {
      const data = {
          isEnabled: formData.get("isEnabled") === "on",
          maxUsers: parseInt(formData.get("maxUsers") as string),
          maxGuestSignupsPerIpPerDay: parseInt(formData.get("maxGuestSignupsPerIpPerDay") as string),
          guestTtlDays: parseInt(formData.get("guestTtlDays") as string),
      };
      return await demoPolicyUpdateAction(policy.id, data);
  }, null);

  useEffect(() => {
    if (state?.success) toast.success("Política actualizada");
    if (state?.message) toast.error(state.message);
  }, [state]);

  return (
    <form action={action} className="space-y-4 max-w-lg p-6 border rounded-xl bg-card">
        <div className="flex items-center justify-between">
            <label>Habilitar Acceso Invitado</label>
            <Switch name="isEnabled" defaultChecked={policy.isEnabled} />
        </div>
        <div className="flex flex-col gap-2">
            <label>Máximo Usuarios</label>
            <Input name="maxUsers" defaultValue={policy.maxUsers} type="number" />
        </div>
        <div className="flex flex-col gap-2">
            <label>Máximo Registro por IP/Día</label>
            <Input name="maxGuestSignupsPerIpPerDay" defaultValue={policy.maxGuestSignupsPerIpPerDay} type="number" />
        </div>
        <div className="flex flex-col gap-2">
            <label>Días de expiración (TTL)</label>
            <Input name="guestTtlDays" defaultValue={policy.guestTtlDays} type="number" />
        </div>
        <Button type="submit" disabled={isPending}>Guardar Cambios</Button>
    </form>
  );
};
