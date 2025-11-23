import { getAllISOCodes } from "iso-country-currency";
import { ShowPageMessage } from "@/components/common/messages/show-page-message";
import { CompanyCurrency } from "../../components/company-currency";
import { CompaniesSidebar } from "../../components/companies-sidebar";
import { companyGetByUserCached } from "@/actions/companies/cache/company.cache";
import { authGetSession } from "@/actions/auth/auth.get-session.action";

export default async function CompanyCurrencyPage() {
  // authenticated check
  const respSession = await authGetSession();
  if (!respSession.data.isAuthenticated) {
    return (
      <ShowPageMessage
        customMessage={`Error: Usuario no autenticado`}
        errorMessage={respSession.message}
      />
    );
  }
  const userId = respSession.data.sessionUser.id;
  const role = respSession.data.sessionUser.role;

  // get company
  const respCompany = await companyGetByUserCached(userId, role);
  if (!respCompany.success) {
    return (
      <ShowPageMessage
        modelName={`Compañia`}
        errorMessage={respCompany.message}
      />
    );
  }

  const currencies = getAllISOCodes();

  return (
    <div className="grid grid-cols-1 w-full md:grid-cols-[70%_30%] md:w-[80%] mx-auto gap-7 my-3">
      <CompanyCurrency
        currencies={currencies}
        isoCountryCurrency={respCompany.data.iso}
        company={respCompany.data}
      />
      <CompaniesSidebar />
    </div>
  );
}
