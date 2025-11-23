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
    <div className="flex flex-col lg:flex-row  w-full h-full border-t border-gray-500 pt-2">
      <div className="w-full lg:w-[70%]">
        <PosMainLeft />
      </div>
      <div className="w-full lg:w-[30%]">
        <Suspense fallback={<div>Loading...</div>}>
          <PosMainRight companyId={data.companyId} />
        </Suspense>
      </div>
    </div>
  );
};
