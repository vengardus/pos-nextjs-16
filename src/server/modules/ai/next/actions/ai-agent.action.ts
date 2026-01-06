"use server";

import { updateTag } from "next/cache";

import type { ResponseAction } from "@/shared/types/common/response-action.interface";
import { aiAgentUseCase } from "@/server/modules/ai/use-cases/ai-agent.use-case";

export const aiAgentAction = async (
  prompt: string,
  authCode: string | null = null
): Promise<ResponseAction> => {
  const resp = await aiAgentUseCase(prompt, authCode);

  if (resp.success && resp.data) 
    updateTag(`categories-${resp.data.companyId}`);

  return resp;
};
