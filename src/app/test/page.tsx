import { authGetSessionUseCase } from "@/server/modules/auth/use-cases/auth.get-session.use-case";
import { TemplatePage } from "./template-page";

export default async function TestPage() {
  const resp = await authGetSessionUseCase();
  //console.log("resp", resp);
  if (!resp.data.isAuthenticated) {
    return <div>No autenticqdo</div>;
  }
  
  return <TemplatePage userId={"0c372b0a-8c59-42d9-bbc7-56430a5a4f2a"} role={"admin"} />;
}
