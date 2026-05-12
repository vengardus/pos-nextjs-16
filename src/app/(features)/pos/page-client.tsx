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

import { UserRole } from "@/server/modules/role/domain/role.user-role.enum";
import { Info } from "lucide-react";

export const PosPageClient = (data: PosPageClientProps) => {
  const { branchId, company, currentUser, cashRegisterDecision } = data;
  const isGuest = currentUser.role === UserRole.GUEST;

  return (
    <div className="grid grid-rows-[auto_1fr] h-full w-full gap-4 px-3 py-2 bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 overflow-hidden transition-colors duration-300">
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
      <div className="bg-white dark:bg-zinc-900/50 border border-slate-200 dark:border-white/5 rounded-2xl p-4 shadow-sm backdrop-blur-sm shrink-0">
        {isGuest && (
          <div className="mb-4 flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 rounded-xl border border-indigo-100 dark:border-indigo-900/30 text-sm font-medium">
            <Info size={16} />
            Estás operando en modo DEMO. Varias personas comparten esta caja.
          </div>
        )}
        <PosHeader />
        <Suspense fallback={<div className="h-20 flex items-center justify-center text-slate-400 dark:text-zinc-500">Cargando productos...</div>}>
          <PosProduct companyId={company.id} />
        </Suspense>
      </div>

      {/* Main Section - Cart & Totals */}
      <div className="h-full overflow-hidden min-h-0 flex flex-col ">
        <PosMain data={{ companyId: company.id }} />
      </div>
    </div>
  );
};
