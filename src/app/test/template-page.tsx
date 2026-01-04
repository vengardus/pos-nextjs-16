import { companyGetByUserCached } from "@/server/modules/company/next/cache/company.get-by-user.cache";

interface TemplatePageProps {
    userId: string;
    role: string;
}
export async function TemplatePage({ userId, role }: TemplatePageProps) {
    console.log("PreGet-test1", userId, role);
    const respCompany = await companyGetByUserCached(userId, role);
    console.log("PostGet-test2");
  
    if (!respCompany.success) {
      return <div>Error en company</div>;
    }

    return <div>{JSON.stringify(respCompany.data)}</div>;
}
