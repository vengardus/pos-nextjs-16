"use client";

import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import type { AuthorizedProviderEmail } from "@/server/modules/authorized-provider-email/domain/authorized-provider-email.base.schema";
import { authorizedProviderEmailUpsertAction } from "@/server/modules/authorized-provider-email/next/actions/authorized-provider-email.upsert.action";

interface AuthorizedProviderEmailCustomFormProps {
  currentRow: AuthorizedProviderEmail | null;
  handleCloseForm: () => void;
}

interface FormState {
  id?: string;
  email: string;
  clientName: string;
  expirationDate: string;
  isActive: boolean;
  isSuperAdmin: boolean;
}

const getInitialFormState = (): FormState => ({
  email: "",
  clientName: "",
  expirationDate: "",
  isActive: true,
  isSuperAdmin: false,
});

const normalizeDateForInput = (value: string): string => {
  const normalized = value.trim().slice(0, 10).replaceAll("/", "-");
  return /^\d{4}-\d{2}-\d{2}$/.test(normalized) ? normalized : "";
};

const getFormStateFromRow = (
  currentRow: AuthorizedProviderEmail | null
): FormState => {
  if (!currentRow) return getInitialFormState();

  return {
    id: currentRow.id,
    email: currentRow.email,
    clientName: currentRow.clientName,
    expirationDate: normalizeDateForInput(currentRow.expirationDate),
    isActive: currentRow.isActive,
    isSuperAdmin: currentRow.isSuperAdmin,
  };
};

export const AuthorizedProviderEmailCustomForm = ({
  currentRow,
  handleCloseForm,
}: AuthorizedProviderEmailCustomFormProps) => {
  const [isPending, startTransition] = useTransition();
  const [formState, setFormState] = useState<FormState>(() =>
    getFormStateFromRow(currentRow)
  );
  const isEdit = useMemo(() => Boolean(currentRow?.id), [currentRow?.id]);

  const handleSubmit = () => {
    startTransition(async () => {
      const resp = await authorizedProviderEmailUpsertAction(formState);

      if (!resp.success) {
        toast.error("No se pudo guardar", {
          description: resp.message,
        });
        return;
      }

      toast.success(isEdit ? "Registro actualizado" : "Registro agregado");
      handleCloseForm();
    });
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-5">
        <label className="space-y-1 text-sm">
          <span>Email</span>
          <input
            type="email"
            value={formState.email}
            onChange={(event) =>
              setFormState((prev) => ({ ...prev, email: event.target.value }))
            }
            placeholder="admin@empresa.com"
            className="h-10 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900"
          />
        </label>

        <label className="space-y-1 text-sm">
          <span>Cliente</span>
          <input
            type="text"
            value={formState.clientName}
            onChange={(event) =>
              setFormState((prev) => ({
                ...prev,
                clientName: event.target.value,
              }))
            }
            placeholder="Nombre del cliente"
            className="h-10 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900"
          />
        </label>

        <label className="space-y-1 text-sm">
          <span>Fecha Expiración (yyyy-MM-dd)</span>
          <input
            type="date"
            value={formState.expirationDate}
            onChange={(event) =>
              setFormState((prev) => ({
                ...prev,
                expirationDate: event.target.value,
              }))
            }
            className="h-10 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900"
          />
        </label>

        <div className="flex items-center gap-6 text-sm">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formState.isActive}
              onChange={(event) =>
                setFormState((prev) => ({
                  ...prev,
                  isActive: event.target.checked,
                }))
              }
            />
            Activo
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formState.isSuperAdmin}
              onChange={(event) =>
                setFormState((prev) => ({
                  ...prev,
                  isSuperAdmin: event.target.checked,
                }))
              }
            />
            Bootstrap SUPER_ADMIN
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={handleCloseForm}
          disabled={isPending}
          className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-70 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isPending}
          className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-70"
        >
          {isPending ? "Guardando..." : "Guardar"}
        </button>
      </div>
    </div>
  );
};
