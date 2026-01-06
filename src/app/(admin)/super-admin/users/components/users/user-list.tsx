import type { UserWithRelations } from "@/server/modules/user/domain/user-with-relations.interface";
import { UserItem } from "./user-item";

interface UserListProps {
  users: UserWithRelations[];
}
export const UserList = ({ users }: UserListProps) => {
  return (
    <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
      {users.map((user) => (
        <UserItem key={user.id} user={user} />
      ))}
    </section>
  );
};
