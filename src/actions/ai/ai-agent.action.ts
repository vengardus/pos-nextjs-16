"use server";

import { updateTag } from "next/cache";

import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import { aiAgentService } from "@/server/ai/agent/ai-agent.service";

export const aiAgentAction = async (
  prompt: string,
  authCode: string | null = null
): Promise<ResponseAction> => {
  const resp = await aiAgentService(prompt, authCode);

  if (resp.success && resp.data) 
    updateTag(`categories-${resp.data.companyId}`);

  return resp;
};
