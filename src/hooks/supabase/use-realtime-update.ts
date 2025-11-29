/*
  ya no se usa este hook, pero lo dejo por si en el futuro se quiere
  hacer pruebas.
  Reemplazado por useCashMovementsBroadcast.ts
*/

import { useEffect } from "react";
import { supabase } from "@/infrastructure/db/supabase";
import { useRealTimeStore } from "@/stores/general/real-time.store";

export function useRealtimeUpdate(tableName: string) {
  const updated = useRealTimeStore((state) => state.updated);
  const setUpdated = useRealTimeStore((state) => state.setUpdated);

  useEffect(() => {
    console.log("SUPABASE_URL_FRONT:", process.env.NEXT_PUBLIC_SUPABASE_URL);

    console.log("[Realtime] montando hook para tabla:", tableName);

    const channel = supabase
      .channel(`public:${tableName}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: tableName },
        (payload) => {
          console.log("[Realtime] POSTGRES_CHANGE recibido:", payload);
          setUpdated(true);
        }
      )
      .subscribe((status) => {
        console.log(`[Realtime] Channel ${tableName} status:`, status);
      });

    return () => {
      console.log("[Realtime] desmontando canal", tableName);
      supabase.removeChannel(channel);
    };
  }, [tableName, setUpdated]);

  return { updated, reset: () => setUpdated(false) };
}
