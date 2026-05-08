import { Suspense } from "react";

import type { CashRegisterDecision } from "@/server/modules/cash-register/domain/cash-register.types";
import type { Company } from "@/server/modules/company/domain/company.interface";
import { PosTemplate } from "./components/pos-template";
import { PosFooter } from "./components/pos-footer";
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
    <div className="flex flex-col h-screen w-full gap-4 px-4 py-2 bg-zinc-950">
      <PosTemplate
        data={{
          branchId: branchId,
          company: company,
          cashRegisterDecision: cashRegisterDecision,
          currentUser: currentUser,
        }}
      />

      {/* Header Section - Entry Mode & Search */}
      <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-4 shadow-sm backdrop-blur-sm shrink-0">
        <PosHeader />
        <Suspense fallback={<div className="h-20 flex items-center justify-center text-zinc-500">Cargando productos...</div>}>
          <PosProduct companyId={company.id} />
        </Suspense>
      </div>

      {/* Main Section - Cart & Totals - Allow this to grow and scroll */}
      <div className="flex-1 overflow-hidden min-h-0">
        <PosMain data={{ companyId: company.id }} />
      </div>

      {/* Footer Section - Actions - Sticky at bottom */}
      <div className="sticky bottom-0 z-10 bg-zinc-950 pt-2 pb-2">
        <div className="bg-zinc-900/80 border border-white/5 rounded-2xl p-4 shadow-sm backdrop-blur-md">
           <PosFooter />
        </div>
      </div>
    </div>
  );
};
