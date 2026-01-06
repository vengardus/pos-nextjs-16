import type { BranchUser } from "@/server/modules/branch-user/domain/branch-user.interface";
import { BranchItem } from "./branch-item";

interface BranchListProps {
  branchUsers: BranchUser[];
}
export const BranchList = ({ branchUsers }: BranchListProps) => {
  return (
    <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
      {branchUsers.map((branchUser) => {
        return (
          <BranchItem key={branchUser.Branch.id} branch={branchUser.Branch} />
        );
      })}
    </section>
  );
};
