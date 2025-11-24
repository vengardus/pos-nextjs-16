import { ShowPageMessage } from "@/components/common/messages/show-page-message";
import { Title } from "@/components/common/titles/Title";
import { UserList } from "@/app/(admin)/super-admin/users/components/users/user-list";
import { UserWithRelations } from "@/types/interfaces/user/user-with-relations.interface";
import { userGetAllWithRelations } from "@/lib/data/users/user.get-all-with-relations";

export default async function UsersPage() {
  const respUsers = await userGetAllWithRelations();
  if (!respUsers.success) {
    return (
      <ShowPageMessage modelName={'Usuarios'} errorMessage={respUsers.message} />
    );
  }


  return (
    <section className="content flex flex-col gap-3 text-foreground/70">
      <Title label="Usuarios registrados" />
      <UserList users={respUsers.data as UserWithRelations[]} />
    </section>
  );
}
