import "server-only";

import { generateText } from "ai";
import { groq } from "@ai-sdk/groq";

import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import { getActionError } from "@/utils/errors/get-action-error";
import { initResponseAction } from "@/utils/response/init-response-action";

export const groqGenerateText = async (prompt: string): Promise<ResponseAction> => {
  const resp = initResponseAction();

  if (!prompt.trim()) {
    resp.message = "El mensaje no puede estar vacío.";
    return resp;
  }

  try {
    const { text } = await generateText({
      model: groq("llama-3.1-8b-instant"),
      prompt,
    });

    resp.success = true;
    resp.data = {
      text,
    };
  } catch (error) {
    resp.message = getActionError(error);
  }

  return resp;
};
