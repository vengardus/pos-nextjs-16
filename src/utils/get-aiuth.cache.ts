"use server"
import { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import { authGetSessionUseCase } from "@/server/modules/auth/use-cases/auth.get-session.use-case";

export async function getAuthCached(): Promise<ResponseAction> {
  //"use cache";
  return await authGetSessionUseCase();  
}
