import { tool } from "ai";
import z from "zod";
import type { ResponseAction } from "@/types/interfaces/common/response-action.interface";
import { AppConstants } from "@/constants/app.constants";
import { categoryCreateWithMcp } from "../mcp/category.create.mcp";
import { initResponseAction } from "@/utils/response/init-response-action";

/*
Forma anterior con tools y generateText
No la uso ahora pero queda como referencia por si acaso
*/

export const buildCategoryTools = (companyId: string) => {
  return {
    createCategory: tool({
      description:
        "Crea una categoría de productos usando únicamente el nombre proporcionado en español.",
      // mínimo schema para que no autocomplete
      inputSchema: z.object({
        name: z
          .string()
          .max(30, "El nombre no puede exceder 30 caracteres.")
          .catch(""),
      }),
      execute: async ({ name }) => {
        console.log("NAME:", name);

        if (!isValidCategoryName(name)) {
          return {
            ...initResponseAction(),
            message:
              "El nombre de la categoría no es válido. Por favor, proporciona un nombre adecuado que no incluya la palabra 'categoría'.",
          } as ResponseAction;
        }

        const result = await categoryCreateWithMcp({
          name,
          color: AppConstants.DEFAULT_VALUES.categoryColor,
          companyId,
        });

        return result as ResponseAction;
      },
    }),
  } as const;
};

// helpers

const isValidCategoryName = (name: string): boolean => {
  if (!name.trim()) return false;

  const lowered = name.toLowerCase();

  // no permitir que meta 'categoría' o 'categoria'
  if (/\bcategor[ií]a\b/.test(lowered)) return false;

  return true;
};
