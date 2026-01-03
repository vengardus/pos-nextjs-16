"use client";

import { useEffect } from "react";
import { supabase } from "@/server/db/supabase";
import { useRealTimeStore } from "@/stores/general/real-time.store";

export function useCashMovementsBroadcast() {
  const updated = useRealTimeStore((state) => state.updated);
  const setUpdated = useRealTimeStore((state) => state.setUpdated);

  useEffect(() => {
    console.log("[Broadcast] montando canal pos:cash_register_movements");

    const channel = supabase
      .channel("pos:cash_register_movements")
      .on(
        "broadcast",
        { event: "movement_inserted" },
        (payload) => {
          // payload.payload viene de jsonb_build_object(...)
          const data = payload.payload as { movement_id: string };

          console.log("[Broadcast] movement_inserted:", data);
          // No filtramos por company, simplemente avisamos al store
          setUpdated(true);
        }
      )
      .subscribe((status) => {
        console.log("[Broadcast] status:", status);
      });

    return () => {
      console.log("[Broadcast] desmontando canal pos:cash_register_movements");
      supabase.removeChannel(channel);
    };
  }, [setUpdated]);

  return {
    updated,
    reset: () => setUpdated(false),
  };
}
