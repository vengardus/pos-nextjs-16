import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import { groqChatRepository } from "@/server/modules/ai/repository/groq-chat.repository";

export const aiChatUseCase = async (
  prompt: string
): Promise<ResponseAction> => {
  return await groqChatRepository(prompt);
};
