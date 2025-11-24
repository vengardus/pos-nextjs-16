"use server"
import { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import { authGetSession } from "@/lib/data/auth/auth.get-session";

export async function getAuthCached(): Promise<ResponseAction> {
  //"use cache";
  return await authGetSession();  
}
