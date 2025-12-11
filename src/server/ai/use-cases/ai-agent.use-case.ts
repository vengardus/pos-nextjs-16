// src/server/ai/agent/ai-agent.use-case.ts
import "server-only";

import { generateObject } from "ai";
//import { groq } from "@ai-sdk/groq";
import { google } from "@ai-sdk/google";

import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import { initResponseAction } from "@/utils/response/init-response-action";
import { getActionError } from "@/utils/errors/get-action-error";
import { ModuleEnum } from "@/types/enums/module.enum";

import { resolveExecContext } from "@/server/context/resolve-exec-context";
import type { ExecContext } from "@/server/context/exec-context.type";

import {
  CategoryAgentSchema,
  type CategoryAgentResult,
} from "@/server/ai/agent/ai-agent.schema.category";

import { categoryCreateWithMcp } from "@/server/ai/mcp/category.create.mcp";
import { buildAiAgentMessages } from "@/server/ai/agent/ai-agent.messages";
import { AppConstants } from "@/constants/app.constants";

export const aiAgentUseCase = async (
  prompt: string,
  authCode: string | null = null
): Promise<ResponseAction> => {
  const resp = initResponseAction();

  const trimmedPrompt = prompt.trim();
  if (!trimmedPrompt) {
    resp.message = "El mensaje no puede estar vacío.";
    return resp;
  }

  console.log("1. [aiAgentUseCase] ejecutando en", {
    url: process.env.NEXT_PUBLIC_APP_URL ?? "local",
    nodeEnv: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    prompt: trimmedPrompt,
  });

  try {
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
      model: google("gemini-2.5-flash"),
      schema: CategoryAgentSchema,
      messages,
      temperature: 0,
    });

    const result = object as CategoryAgentResult;

    console.log("2. [aiAgentUseCase] structured result:", result);

    // 2) Si no es intención de crear categoría → respondemos sin llamar al MCP
    if (result.intent !== "create_category") {
      const containsCategoryWord = /\bcategor[ií]a\b/i.test(trimmedPrompt);
      if (containsCategoryWord) {
        // Ej: "agrega categoria categoria"
        resp.message =
          "El nombre de la categoría no es válido, no puede ser 'categoría' o 'categoria'. " +
          "Intenta algo como 'agrega categoría Bebidas'.";
      } else {
        // Ej: "agrega pescados", "agrega color pescados"
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
    const createResp = await categoryCreateWithMcp({
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

  // Reglas defensivas para evitar cosas como "color pescados" o "categoría algo"
  if (/\bcategor[ií]a\b/.test(lowered)) return false;
  if (/\bcolor\b/.test(lowered)) return false;

  return true;
};
