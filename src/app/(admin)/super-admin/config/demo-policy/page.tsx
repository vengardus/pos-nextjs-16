import { ShowPageMessage } from "@/components/common/messages/show-page-message";
import { Title } from "@/components/common/titles/Title";
import { getAuthCached } from "@/server/modules/auth/next/cache/auth.get-session.cache";
import { companyGetByUserCached } from "@/server/modules/company/next/cache/company.get-by-user.cache";
import { demoPolicyGetByCompanyIdUseCase } from "@/server/modules/demo-policy/use-cases/demo-policy.get-by-company-id.use-case";
import { UserRole } from "@/server/modules/role/domain/role.user-role.enum";
import { DemoPolicyForm } from "@/app/(admin)/super-admin/config/demo-policy/components/demo-policy-form";
import type { DemoPolicy } from "@/server/modules/demo-policy/domain/demo-policy.base.schema";
import { authorizedProviderEmailGetAllUseCase } from "@/server/modules/authorized-provider-email/use-cases/authorized-provider-email.get-all.use-case";
import { AuthorizedProviderEmailListDef } from "@/app/(admin)/super-admin/config/demo-policy/components/authorized-provider-email-list-def";
import type { AuthorizedProviderEmail } from "@/server/modules/authorized-provider-email/domain/authorized-provider-email.base.schema";

export default async function DemoPolicyPage() {
  const authResp = await getAuthCached();

  if (!authResp.data?.isAuthenticated) {
    return <ShowPageMessage customMessage="Usuario no autenticado." />;
  }

  const sessionUser = authResp.data.sessionUser;
  if (sessionUser?.role !== UserRole.SUPER_ADMIN) {
    return <ShowPageMessage customMessage="No autorizado." />;
  }

  const companyResp = await companyGetByUserCached(
    sessionUser.id,
    sessionUser.role
  );

  if (!companyResp.success || !companyResp.data?.id) {
    return (
      <ShowPageMessage
        customMessage={companyResp.message ?? "No se pudo resolver la compañía."}
      />
    );
  }

  const policyResp = await demoPolicyGetByCompanyIdUseCase(companyResp.data.id);
  const whitelistResp = await authorizedProviderEmailGetAllUseCase();
  const whitelist = ((whitelistResp.data as AuthorizedProviderEmail[]) ?? []);
  const initialPolicy = policyResp.success
    ? ((policyResp.data as DemoPolicy | null) ?? null)
    : null;

  return (
    <section className="content flex flex-col gap-4 text-foreground/80">
      <Title label="Políticas demo" />
      {!policyResp.success ? (
        <div className="rounded-xl border border-red-300/80 bg-red-50 px-4 py-3 text-sm text-red-900 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-100">
          No se pudo cargar la política demo:{" "}
          {policyResp.message ?? "error desconocido"}.
        </div>
      ) : (
        <DemoPolicyForm companyId={companyResp.data.id} initialPolicy={initialPolicy} />
      )}
      {!whitelistResp.success ? (
        <div className="rounded-xl border border-red-300/80 bg-red-50 px-4 py-3 text-sm text-red-900 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-100">
          No se pudo cargar la whitelist de emails provider:{" "}
          {whitelistResp.message ?? "error desconocido"}.
        </div>
      ) : (
        <AuthorizedProviderEmailListDef data={whitelist} />
      )}
    </section>
  );
}
