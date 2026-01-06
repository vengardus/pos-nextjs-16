import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Company } from "@/server/modules/company/domain/company.interface";

interface State {
  company: Company;
  setCompany: (company: Company) => void;
}

export const useCompanyStore = create<State>()(
  persist(
    (set) => ({
      company: {} as Company,

      setCompany: (company: Company) => {
        set({ company });
      },

    }),
    {
      name: "company-store",
    }
  )
);
