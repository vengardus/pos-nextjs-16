import type { Branch } from "@/server/modules/branch/domain/branch.types";
import { CashRegisterItem } from "./cash-register-item";

interface CashRegisterListProps {
  branch: Branch;
}
export const CashRegisterList = ({ branch }: CashRegisterListProps) => {
  console.log("CashRegisterList:branch", branch);
  return (
    <section className="flex flex-col gap-3">
      {branch.CashRegister?.map((cashRegister) => (
        console.log("CAshRegisterList.map:cashRegister", cashRegister),
        <CashRegisterItem key={cashRegister.id} cashRegister={cashRegister} />
      ))}
    </section>
  );
};
