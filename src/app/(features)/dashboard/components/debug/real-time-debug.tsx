// RealtimeDebug.tsx
"use client";

import { useEffect } from "react";
import { supabase } from "@/infrastructure/db/supabase";

export function RealtimeDebug() {
  useEffect(() => {
    console.log("[RealtimeDebug] montando");

    const channel = supabase
      .channel("debug-public-schema")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
        },
        (payload) => {
          console.log("[RealtimeDebug] cambio en BD:", payload);
        }
      )
      .subscribe((status) => {
        console.log("[RealtimeDebug] status:", status);
      });

    return () => {
      console.log("[RealtimeDebug] desmontando");
      supabase.removeChannel(channel);
    };
  }, []);

  return null;
}
