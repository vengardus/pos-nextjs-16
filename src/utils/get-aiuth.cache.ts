"use server"
import { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import { authGetSession } from "@/actions/auth/auth.get-session.action";

export async function getAuthCached(): Promise<ResponseAction> {
  //"use cache";
  return await authGetSession();  
}
