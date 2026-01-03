"use server";

import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import { aiChatUseCase } from "@/server/modules/ai/use-cases/ai-chat.use-case";

export const aiChatAction = async (prompt: string): Promise<ResponseAction> => {
  return await aiChatUseCase(prompt);
};
