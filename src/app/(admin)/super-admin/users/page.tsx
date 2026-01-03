import { ShowPageMessage } from "@/components/common/messages/show-page-message";
import { Title } from "@/components/common/titles/Title";
import { UserList } from "@/app/(admin)/super-admin/users/components/users/user-list";
import { UserWithRelations } from "@/types/interfaces/user/user-with-relations.interface";
import { userGetAllWithRelationsUseCase } from "@/server/modules/user/use-cases/user.get-all-with-relations.use-case";

export default async function UsersPage() {
  const respUsers = await userGetAllWithRelationsUseCase();
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
