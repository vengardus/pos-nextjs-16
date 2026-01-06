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
    <div className="flex flex-col h-[calc(100vh-72px)] w-full gap-3 px-2">
      <PosTemplate
        data={{
          branchId: branchId,
          company: company,
          cashRegisterDecision: cashRegisterDecision,
          currentUser: currentUser,
        }}
      />

      <div className="h-auto flex flex-col gap-3">
        <PosHeader />
        <Suspense fallback={<div>Loading...</div>}>
          <PosProduct companyId={company.id} />
        </Suspense>
      </div>

      <div className="flex-1 overflow-y-auto">
        <PosMain data={{ companyId: company.id }} />
      </div>

      <div className="hidden lg:flex lg:h-auto py-5 border-t  border-gray-500">
        <PosFooter />
      </div>
    </div>
  );
};
