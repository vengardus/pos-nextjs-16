import { companyGetByUserCached } from "@/server/modules/company/next/cache/company.get-by-user.cache";

export default async function TestPage() {
  console.log("PreGet");
  await companyGetByUserCached("0c372b0a-8c59-42d9-bbc7-56430a5a4f2a", "admin");
  console.log("PostGet");

  return <div>TestPage</div>;
}
