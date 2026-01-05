import type { CashRegisterDecision } from "@/server/modules/cash-register/domain/cash-register.types";
import { ModuleEnum } from "@/types/enums/module.enum";
import { checkAuthenticationAndPermission } from "@/server/modules/auth/use-cases/auth.check-authentication-and-permission.use-case";
import { ShowPageMessage } from "@/components/common/messages/show-page-message";
import { PosPageClient } from "./page-client";
import { branchUserGetAllByUserCached } from "@/server/modules/branch-user/next/cache/branch-user.cache";
import { cashRegisterDetermineActiveCashRegisterCached } from "@/server/modules/cash-register/next/cache/cash-register.cache";

export default async function PosPage() {
  // Verify user authentication and permission
  const authenticatationAndPermissionResponse = await checkAuthenticationAndPermission( ModuleEnum.pos);
  if (!authenticatationAndPermissionResponse.isAuthenticated)
    return <ShowPageMessage customMessage={authenticatationAndPermissionResponse.errorMessage} />;
  const company = authenticatationAndPermissionResponse.company!;
  const currentUser = {
    id: authenticatationAndPermissionResponse.userId!,
    userName: authenticatationAndPermissionResponse.userName!,
    role: authenticatationAndPermissionResponse.role!,
  };

  // Obtener sucursales, y asume la primera como sucursal por defecto
  // TODO: agregar columna isDefault en BranchUser para determinar la sucursal por defecto
  // TODO: posteriormente cambiar la forma de obtener la sucursal del usuario.
  // TODO: ya que se podrá asignar el usuario a otrq sucursal
  const [respBranchUsers] = await Promise.all([branchUserGetAllByUserCached(currentUser.id)]);
  if (!respBranchUsers.success || respBranchUsers.data.length === 0) {
    return <ShowPageMessage modelName={`Sucursal`} errorMessage={respBranchUsers.message} />;
  }
  const branchId = respBranchUsers.data[0].branchId;

  // obtener cajas aperturadas
  const respDetermineActiveCashRegister = await cashRegisterDetermineActiveCashRegisterCached(
    currentUser.id,
    branchId
  );

  if (!respDetermineActiveCashRegister.success) {
    return (
      <ShowPageMessage modelName={`Caja`} errorMessage={respDetermineActiveCashRegister.message} />
    );
  }
  if (!respDetermineActiveCashRegister.data) {
    return <ShowPageMessage customMessage={`No se encontraron cajas`} />;
  }

  const cashRegisterDecision = respDetermineActiveCashRegister.data as CashRegisterDecision;

  //console.log("cashRegisterDecision:", cashRegisterDecision);

  return (
    <PosPageClient
      branchId={branchId}
      company={company}
      currentUser={currentUser}
      cashRegisterDecision={cashRegisterDecision}
    />
  );
}
