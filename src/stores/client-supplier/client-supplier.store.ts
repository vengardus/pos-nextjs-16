import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ClientSupplier } from "@/types/interfaces/client-supplier/client-supplier.interface";

interface State {
  clientSupplier: ClientSupplier;
  clientsSuppliers: ClientSupplier[];
  setClientSupplier: (clientSupplier: ClientSupplier) => void;
  setClientsSuppliers: (clientsSuppliers: ClientSupplier[]) => void;
}

export const useClientSupplierStore = create<State>()(
  persist(
    (set) => ({
      clientSupplier: {} as ClientSupplier,
      clientsSuppliers: [],

      setClientSupplier: (clientSupplier: ClientSupplier) => {
        set({ clientSupplier });
      },

      setClientsSuppliers: (clientsSuppliers: ClientSupplier[]) => {
        set({ clientsSuppliers });
      },

    }),
    {
      name: "client-supplier-store",
    }
  )
);
