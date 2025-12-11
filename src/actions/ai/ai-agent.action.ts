"use server";

import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import { aiAgentUseCase } from "@/server/ai/use-cases/ai-agent.use-case";


export const aiAgentAction = async (
  prompt: string,
  authCode: string | null = null
): Promise<ResponseAction> => {
  return aiAgentUseCase(prompt, authCode);
};
