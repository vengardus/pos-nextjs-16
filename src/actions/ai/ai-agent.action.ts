"use server";

import { generateText, tool } from "ai";
import { groq } from "@ai-sdk/groq";
import { z } from "zod";

import { AppConstants } from "@/constants/app.constants";
import { ModuleEnum } from "@/types/enums/module.enum";
import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import { checkAuthenticationAndPermission } from "@/services/auth/check-authentication-and-permission.use-case";
import { getActionError } from "@/utils/errors/get-action-error";
import { initResponseAction } from "@/utils/response/init-response-action";

type CreateCategoryPayload = {
  name: string;
  color: string;
  companyId: string;
};

const API_PATHS = {
  createCategory: "/api/ai/categories",
} as const;

const buildApiUrl = (path: string) => {
  const vercelUrl = process.env.VERCEL_URL;

  if (vercelUrl) {
    return `https://${vercelUrl}${path}`;
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  return `${baseUrl}${path}`;
};

const createCategoryWithMcp = async ({
  name,
  color,
  companyId,
}: CreateCategoryPayload): Promise<ResponseAction> => {
  const url = buildApiUrl(API_PATHS.createCategory);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, color, companyId }),
  });

  const data = (await response.json()) as ResponseAction;

  if (!response.ok || !data.success) {
    throw new Error(data.message ?? "Error al crear la categoría");
  }

  return data;
};

export const aiAgentAction = async (prompt: string): Promise<ResponseAction> => {
  const resp = initResponseAction();

  if (!prompt.trim()) {
    resp.message = "El mensaje no puede estar vacío.";
    return resp;
  }

  try {
    const authResult = await checkAuthenticationAndPermission(ModuleEnum.aiAgent);

    if (!authResult.isAuthenticated || !authResult.company) {
      resp.message = authResult.errorMessage ?? "No se pudo autenticar la sesión.";
      return resp;
    }

    let categoryResult: ResponseAction | null = null;

    const tools = {
      createCategory: tool({
        description:
          "Crea una categoría de productos usando únicamente el nombre proporcionado en español.",
        parameters: z.object({
          name: z
            .string()
            .min(2, "El nombre debe tener al menos 2 caracteres")
            .describe("Nombre exacto de la categoría a registrar"),
        }),
        execute: async ({ name }) => {
          categoryResult = await createCategoryWithMcp({
            name,
            color: AppConstants.DEFAULT_VALUES.categoryColor,
            companyId: authResult.company.id,
          });

          return {
            message: categoryResult.message ?? "Categoría creada correctamente.",
          };
        },
      }),
    } as const;

    const messages = [
      {
        role: "system" as const,
        content:
          "Eres un asistente especializado en alta de recursos. El usuario escribirá en español comandos como 'agrega categoría X', 'adiciona categoría X' o 'crear categoría X'. Extrae siempre el nombre de la categoría y usa la herramienta createCategory para registrarla. Si no identificas un nombre válido, responde de forma concisa que no pudiste comprender la solicitud.",
      },
      {
        role: "user" as const,
        content: prompt,
      },
    ];

    await generateText({
      model: groq("llama-3.1-8b-instant"),
      messages,
      tools,
      maxSteps: 3,
    });

    if (categoryResult?.success) {
      resp.success = true;
      resp.message = categoryResult.message ?? "Categoría creada correctamente.";
      resp.data = categoryResult.data;
      return resp;
    }

    resp.message =
      categoryResult?.message ??
      "No se pudo interpretar la solicitud. Intenta nuevamente indicando solo el nombre de la categoría.";
  } catch (error) {
    resp.message = getActionError(error);
  }

  return resp;
};
