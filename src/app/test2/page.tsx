import { companyGetByUserCached } from "@/actions/companies/cache/company.cache";

export default async function TestPage() {
  console.log("PreGet");
  await companyGetByUserCached("0c372b0a-8c59-42d9-bbc7-56430a5a4f2a", "admin");
  console.log("PostGet");

  return <div>TestPage</div>;
}
