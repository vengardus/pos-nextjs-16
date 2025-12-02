"use server";

import { groqGenerateText } from "@/lib/groq/groq-chat";
import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";

export const aiChatAction = async (prompt: string): Promise<ResponseAction> => {
  return await groqGenerateText(prompt);
};
