"use client";

import { useState, useTransition } from "react";
import { demoPolicyUpsertAction } from "@/server/modules/demo-policy/next/actions/demo-policy.upsert.action";
import type { DemoPolicy } from "@/server/modules/demo-policy/domain/demo-policy.base.schema";

interface DemoPolicyFormProps {
  companyId: string;
  initialPolicy: DemoPolicy | null;
}

export const DemoPolicyForm = ({
  companyId,
  initialPolicy,
}: DemoPolicyFormProps) => {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string>("");

  const [isEnabled, setIsEnabled] = useState(initialPolicy?.isEnabled ?? false);
  const [maxUsers, setMaxUsers] = useState(initialPolicy?.maxUsers ?? 10);
  const [maxRecordsPerEntity, setMaxRecordsPerEntity] = useState(
    initialPolicy?.maxRecordsPerEntity ?? 20
  );
  const [maxGuestSignupsPerIpPerDay, setMaxGuestSignupsPerIpPerDay] =
    useState(initialPolicy?.maxGuestSignupsPerIpPerDay ?? 5);
  const [guestTtlDays, setGuestTtlDays] = useState(
    initialPolicy?.guestTtlDays ?? 15
  );
  const [allowCsvImportForGuest, setAllowCsvImportForGuest] = useState(
    initialPolicy?.allowCsvImportForGuest ?? false
  );

  const handleSubmit = () => {
    setMessage("");
    startTransition(async () => {
      const resp = await demoPolicyUpsertAction({
        companyId,
        isEnabled,
        maxUsers,
        maxRecordsPerEntity,
        maxGuestSignupsPerIpPerDay,
        guestTtlDays,
        allowCsvImportForGuest,
      });

      setMessage(
        resp.success
          ? "Política guardada."
          : resp.message ?? "Error al guardar política."
      );
    });
  };

  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white/90 p-6 shadow-sm dark:border-slate-800/70 dark:bg-slate-950/60">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={isEnabled}
            onChange={(event) => setIsEnabled(event.target.checked)}
          />
          Habilitar modo demo
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={allowCsvImportForGuest}
            onChange={(event) => setAllowCsvImportForGuest(event.target.checked)}
          />
          Permitir importación CSV para GUEST
        </label>

        <label className="space-y-1 text-sm">
          <span>Máximo de usuarios demo</span>
          <input
            type="number"
            min={1}
            value={maxUsers}
            onChange={(event) => setMaxUsers(Number(event.target.value))}
            className="h-10 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900"
          />
        </label>

        <label className="space-y-1 text-sm">
          <span>Máximo de registros por entidad (GUEST)</span>
          <input
            type="number"
            min={1}
            value={maxRecordsPerEntity}
            onChange={(event) =>
              setMaxRecordsPerEntity(Number(event.target.value))
            }
            className="h-10 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900"
          />
        </label>

        <label className="space-y-1 text-sm">
          <span>Altas de invitado por IP por día</span>
          <input
            type="number"
            min={1}
            value={maxGuestSignupsPerIpPerDay}
            onChange={(event) =>
              setMaxGuestSignupsPerIpPerDay(Number(event.target.value))
            }
            className="h-10 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900"
          />
        </label>

        <label className="space-y-1 text-sm">
          <span>Días de retención para usuarios GUEST</span>
          <input
            type="number"
            min={1}
            value={guestTtlDays}
            onChange={(event) => setGuestTtlDays(Number(event.target.value))}
            className="h-10 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900"
          />
        </label>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isPending}
          className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-70"
        >
          {isPending ? "Guardando..." : "Guardar política"}
        </button>
        {message ? (
          <span className="text-sm text-slate-600 dark:text-slate-300">
            {message}
          </span>
        ) : null}
      </div>
    </div>
  );
};
