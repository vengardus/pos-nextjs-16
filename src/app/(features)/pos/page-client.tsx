import { Suspense } from "react";

import type { CashRegisterDecision } from "@/server/modules/cash-register/domain/cash-register.types";
import type { Company } from "@/server/modules/company/domain/company.interface";
import { PosTemplate } from "./components/pos-template";
import { PosHeader } from "./components/pos-header";
import { PosMain } from "./components/pos-main";
import { PosProduct } from "./components/pos-product";

interface PosPageClientProps {
  branchId: string;
  company: Company;
  currentUser: {
    id: string;
    userName: string;
    role: string;
  };
  cashRegisterDecision: CashRegisterDecision;
}

export const PosPageClient = (data: PosPageClientProps) => {
  const { branchId, company, currentUser, cashRegisterDecision } = data;

  return (
    <div className="grid grid-rows-[auto_1fr] h-full w-full gap-4 px-3 py-2 bg-zinc-950 overflow-hidden">
      {/* Hidden container for Template logic */}
      <div className="hidden">
        <PosTemplate
          data={{
            branchId: branchId,
            company: company,
            cashRegisterDecision: cashRegisterDecision,
            currentUser: currentUser,
          }}
        />
      </div>

      {/* Header Section */}
      <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-4 shadow-sm backdrop-blur-sm shrink-0">
        <PosHeader />
        <Suspense fallback={<div className="h-20 flex items-center justify-center text-zinc-500">Cargando productos...</div>}>
          <PosProduct companyId={company.id} />
        </Suspense>
      </div>

      {/* Main Section - Cart & Totals */}
      <div className="h1-full overflow-hidden min-h-0 flex flex-col ">
        <PosMain data={{ companyId: company.id }} />
      </div>
    </div>
  );
};
