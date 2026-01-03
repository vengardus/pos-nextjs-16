import "server-only";

import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
//import { groq } from "@ai-sdk/groq";

import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import type { ExecContext } from "@/server/context/exec-context.type";
import { ModuleEnum } from "@/types/enums/module.enum";
import { AppConstants } from "@/shared/constants/app.constants";

import { initResponseAction } from "@/utils/response/init-response-action";
import { getActionError } from "@/utils/errors/get-action-error";
import { resolveExecContext } from "@/server/context/resolve-exec-context";
import {
  CategoryAgentSchema,
  type CategoryAgentResult,
} from "@/server/modules/ai/domain/category-agent.schema";
import { categoryCreateRepository } from "@/server/modules/ai/repository/category-create.repository";
import { buildAiAgentMessages } from "@/server/modules/ai/domain/ai-agent.messages";

export const aiAgentUseCase = async (
  prompt: string,
  authCode: string | null = null
): Promise<ResponseAction> => {
  const resp = initResponseAction();
  const trimmedPrompt = prompt.trim();
  
  if (!trimmedPrompt) {
    return {
      ...resp,
      message: "El mensaje no puede estar vacío.", 
    }
  }

  try {
    // 0) Resolver contexto para obtener companyId
    const execContextResp = await resolveExecContext({
      authCode,
      module: ModuleEnum.aiAgent,
    });
    if (!execContextResp.success || !execContextResp.data) {
      throw new Error(
        execContextResp.message ?? "No se pudo autenticar la sesión."
      );
    }
    const { companyId } = execContextResp.data as ExecContext;

    // 1) Pedimos structured data al modelo
    const messages = buildAiAgentMessages(trimmedPrompt);
    const { object } = await generateObject({
      //model: groq("llama-3.1-8b-instant"),
      model: google("gemini-2.5-flash-lite"),
      schema: CategoryAgentSchema,
      messages,
      temperature: 0,
    });
    const result = object as CategoryAgentResult;

    // 2) Si no es intención de crear categoría → respondemos sin llamar al MCP
    if (result.intent !== "create_category") {
      const containsCategoryWord = /\bcategor[ií]a\b/i.test(trimmedPrompt);
      if (containsCategoryWord) {
        resp.message =
          "El nombre de la categoría no es válido, no puede ser 'categoría' o 'categoria'. " +
          "Intenta algo como 'agrega categoría Bebidas'.";
      } else {
        resp.message =
          "Solo puedo crear categorías cuando mencionas explícitamente la palabra 'categoría' o 'categoria'.";
      }
      return resp;
    }

    // 3) Validación defensiva extra sobre el name
    if (!isValidCategoryName(result.name)) {
      resp.message =
        "No pude extraer correctamente el nombre de la categoría. Usa algo como 'agrega categoría Bebidas'.";
      return resp;
    }

    // 4) Ejecutamos la creación real (MCP / use-case)
    const createResp = await categoryCreateRepository({
      name: result.name,
      color: AppConstants.DEFAULT_VALUES.categoryColor,
      companyId,
    });

    return createResp;
  } catch (error) {
    if (error instanceof Error && error.message.includes("failed_generation")) {
      resp.message = "Categoría inválida";
    } else {
      resp.message = getActionError(error);
    }

    return resp;
  }
};

// helpers

const isValidCategoryName = (name: string): boolean => {
  const trimmed = name.trim();
  if (!trimmed) return false;
  const lowered = trimmed.toLowerCase();
  if (/\bcategor[ií]a\b/.test(lowered)) return false;

  return true;
};
