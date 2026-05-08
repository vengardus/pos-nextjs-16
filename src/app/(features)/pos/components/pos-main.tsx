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
    <div className="flex flex-col lg:flex-row w-full h-full gap-4">
      <div className="w-full lg:w-[70%] bg-zinc-900/50 border border-white/5 rounded-2xl shadow-sm backdrop-blur-sm overflow-hidden flex flex-col">
        <PosMainLeft />
      </div>
      <div className="w-full lg:w-[30%] bg-zinc-900/50 border border-white/5 rounded-2xl shadow-sm backdrop-blur-sm overflow-hidden">
        <Suspense fallback={<div className="h-full flex items-center justify-center text-zinc-500">Cargando totales...</div>}>
          <PosMainRight companyId={data.companyId} />
        </Suspense>
      </div>
    </div>
  );
};
