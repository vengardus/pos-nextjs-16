import { groqGenerateText } from "@/lib/groq/groq-chat";
import type { ResponseAction } from "@/shared/types/common/response-action.interface";

export const groqChatRepository = async (
  prompt: string
): Promise<ResponseAction> => {
  return await groqGenerateText(prompt);
};
