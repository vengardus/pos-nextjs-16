"use server";

import { generateText, tool } from "ai";
import { groq } from "@ai-sdk/groq";
import { z } from "zod";

import { AppConstants } from "@/constants/app.constants";
import { ModuleEnum } from "@/types/enums/module.enum";
import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import { checkAuthenticationAndPermission } from "@/services/auth/check-authentication-and-permission.use-case";
import { companyGetByUserCached } from "@/lib/data/companies/company.cache";
import { userGetByColumnCached } from "@/lib/data/users/user.cache";
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
  // const vercelUrl = process.env.VERCEL_URL;

  // if (vercelUrl) {
  //   return `https://${vercelUrl}${path}`;
  // }

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ??
    (process.env.VERCEL_URL ? "" : "http://localhost:3000");

  // console.log("Base URL for API:", baseUrl);
  // console.log("next public url:", process.env.NEXT_PUBLIC_APP_URL);

  return `${baseUrl}${path}`;
};

const createCategoryWithMcp = async ({
  name,
  color,
  companyId,
}: CreateCategoryPayload): Promise<ResponseAction> => {
  const url = buildApiUrl(API_PATHS.createCategory);

  console.log("--Creating category with MCP:", url);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, color, companyId }),
  });

  const data = (await response.json()) as ResponseAction;

  console.log("--Response from MCP:", data);

  if (!response.ok || !data.success) {
    return {
      success: false,
      message: data.message ?? "Error al crear la categoría",
      data: null,
      errorCode: data.errorCode ?? response.status,
      pagination: data.pagination ?? { currentPage: 1, totalPages: 1 },
    };
  }

  return data;
};

export const aiAgentAction = async (
  prompt: string,
  authCode: string | null = null
): Promise<ResponseAction> => {
  console.log("1. [aiAgentAction] ejecutando en", {
    vercelUrl: process.env.NEXT_PUBLIC_APP_URL ?? "local",
    nodeEnv: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    prompt,
  });

  const resp = initResponseAction();
  let companyId = "";

  if (!prompt.trim()) {
    resp.message = "El mensaje no puede estar vacío.";
    return resp;
  }

  try {
    if (authCode === null) {
      console.log("2. [aiAgentAction] verificando autenticación y permisos");
      const authResult = await checkAuthenticationAndPermission(
        ModuleEnum.aiAgent
      );

      if (!authResult.isAuthenticated || !authResult.company) {
        resp.message =
          authResult.errorMessage ?? "No se pudo autenticar la sesión.";
        return resp;
      }

      companyId = authResult.company.id;

      console.log("3. Se ha autenticado al usuario:", {
        companyId,
      });
    } else {
      const userResult = await userGetByColumnCached("phone", authCode);

      if (!userResult.success || !userResult.data) {
        resp.message = userResult.message ?? "Usuario no encontrado.";
        return resp;
      }

      const companyResult = await companyGetByUserCached(
        userResult.data.id,
        ""
      );

      if (!companyResult.success || !companyResult.data) {
        resp.message = companyResult.message ?? "Compañía no encontrada.";
        return resp;
      }

      companyId = companyResult.data.id;
    }

    console.log("4. [aiAgentAction] configurando herramientas del agente AI");

    const tools = {
      createCategory: tool({
        description:
          "Crea una categoría de productos usando únicamente el nombre proporcionado en español.",
        inputSchema: z.object({
          name: z
            .string()
            //.min(2, "El nombre debe tener al menos 2 caracteres")
            .max(30, "El nombre no puede exceder 30 caracteres.")
            //.describe("Nombre exacto de la categoría a registrar")
            .catch(""),
        }),

        // 👇 Devolvemos directamente el ResponseAction del fetch
        execute: async ({ name }) => {
          console.log("NAME:", name);
          const result = await createCategoryWithMcp({
            name,
            color: AppConstants.DEFAULT_VALUES.categoryColor,
            companyId,
          });

          // devolvemos SIEMPRE un ResponseAction, sin throws
          return result;
        },
      }),
    } as const;

    const messages = [
      {
        role: "system" as const,
        content: [
          "Eres un asistente especializado en alta de recursos. ",
          "SOLO debes usar la herramienta createCategory cuando el mensaje del usuario **incluya ",
          "explícitamente la palabra 'categoría' o 'categoria'. **",
          "Ejemplos válidos: 'agrega categoría Embutidos', 'adiciona categoría Lácteos', 'crear categoría Bebidas'. ",
          "Si el mensaje no contiene esas palabras, **NO llames a ninguna herramienta** y responde ",
          "de forma concisa que solo puedes ayudar a crear categorías cuando el usuario lo indique explícitamente.",
          "NO inventes ni corrijas el nombre. **Pásalo tal cual lo escribió el usuario.**",
          "Si no puedes extraer un nombre literal, llama a la herramienta con name='' (vacío)",
          "El nombre de la categoria no puede ser categoría ni categoria por sí sola, ",
          "El prompt debe contener al menos 3 palabras incluyendo la palabra categoría o categoria.",
        ].join("\n"),
      },
      {
        role: "user" as const,
        content: prompt,
      },
    ];

    console.log(
      "5. [aiAgentAction] llama a generateText con el prompt del usuario y configuración de herramientas"
    );

    const { toolResults } = await generateText({
      model: groq("llama-3.1-8b-instant"),
      messages,
      tools,
      temperature: 0,
      // Si quisieras forzar multi-step (tool + resumen), podrías usar:
      // stopWhen: stepCountIs(2),
    });

    console.log(
      "6. [aiAgentAction] procesamiento de resultados de herramientas",
      toolResults
    );

    // 🧠 Patrón recomendado en la doc: leer toolResults del resultado
    const categoryToolResult = toolResults.find(
      (result) => result.toolName === "createCategory"
    );

    console.log(
      "7. [aiAgentAction] determinación de herramienta",
      categoryToolResult
    );

    // En v5, output suele ser `unknown`, lo casteamos a tu tipo:
    const categoryResult = categoryToolResult?.output as
      | ResponseAction
      | undefined;

    console.log(
      "8. [aiAgentAction] respuesta de ejecucion de herramienta",
      categoryResult
    );

    if (categoryResult?.success) {
      return {
        ...resp,
        success: true,
        message: categoryResult.message ?? "Categoría creada correctamente.",
        data: categoryResult.data,
        pagination: categoryResult.pagination,
      };
    }

    return {
      ...resp,
      message:
        categoryResult?.message ?? "No se pudo interpretar la solicitud.",
    };
  } catch (error) {
    if (error instanceof Error && error.message.includes("failed_generation"))
      resp.message = "Categoría inválida";
    else resp.message = getActionError(error) + "xxxxxxxxxxxxxxxxx";
    return resp;
  }
};
