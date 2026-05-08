import { PosMainRight } from "./pos-main/pos-main-right";
import { PosMainLeft } from "./pos-main/pos-main-left";
import { Suspense } from "react";

interface PosMainProps {
  data: {
    companyId: string;
  };
}
export const PosMain = ({ data }: PosMainProps) => {
  return (
    <div className="flex flex-col lg:flex-row w-full flex-1 gap-4 items-stretch min-h-0">
      {/* Cart - Takes up most space, scrolls internally */}
      <div className="flex-[2] bg-zinc-900/50 border border-white/5 rounded-2xl shadow-sm backdrop-blur-sm overflow-hidden flex flex-col min-h-0 p-4">
        <PosMainLeft />
      </div>

      {/* Totals - Aligned with cart height */}
      <div className="flex-1 lg:max-w-[320px] bg-zinc-900/50 border border-white/5 rounded-2xl shadow-sm backdrop-blur-sm overflow-hidden flex flex-col min-h-0 p-4">
        <Suspense fallback={<div className="h-full flex items-center justify-center text-zinc-500">Cargando totales...</div>}>
          <PosMainRight companyId={data.companyId} />
        </Suspense>
      </div>
    </div>
  );
};
