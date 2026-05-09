"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export const PosFooter = () => {
  const router = useRouter();

  return (
    <div className="flex items-center justify-end">
        <Button variant="ghost" className="text-zinc-400 hover:text-zinc-100" onClick={() => router.push("/")}>
          <X className="w-4 h-4 mr-2" /> Salir
        </Button>
    </div>
  );
};
