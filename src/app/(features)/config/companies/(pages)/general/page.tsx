import { ShowPageMessage } from "@/components/common/messages/show-page-message";
import { Suspense } from "react";
import { ModuleEnum } from "@/types/enums/module.enum";
import { CompanyHeader } from "../../components/company-header";
import { CompanyForm } from "../../components/company-form";
import { CompaniesSidebar } from "../../components/companies-sidebar";
import { checkAuthenticationAndPermission } from "@/services/auth/check-authentication-and-permission.use-case";

export default async function CompaniesGeneralPage() {
  // Verify user authentication and permission
  const authenticatationAndPermissionResponse = await checkAuthenticationAndPermission(
    ModuleEnum.pos
  );
  if (!authenticatationAndPermissionResponse.isAuthenticated)
    return <ShowPageMessage customMessage={authenticatationAndPermissionResponse.errorMessage} />;
  const company = authenticatationAndPermissionResponse.company!;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="grid grid-cols-1 w-full md:grid-cols-[70%_30%] md:w-[80%] mx-auto gap-7 my-3">
        <section>
          <CompanyHeader company={company} />
          <CompanyForm currentCompany={company} companyId={company.id} />
        </section>
        <CompaniesSidebar />
      </div>
    </Suspense>
  );
}
