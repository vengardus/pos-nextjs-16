import { NextResponse } from "next/server";

import { categoryInsertOrUpdate } from "@/actions/categories/category.insert-or-update.action";
import { toCapitalize } from "@/utils/formatters/to-capitalize";
import type { Category } from "@/types/interfaces/category/category.interface";

class ApiError extends Error {
  constructor(message: string, public readonly status: number = 500) {
    super(message);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);

    if (!body) {
      throw new ApiError("Solicitud inválida", 400);
    }

    const { name, color, companyId } = body as Partial<Category> & {
      companyId?: string;
    };

    if (!name || !color || !companyId) {
      throw new ApiError("name, color y companyId son requeridos", 400);
    }

    const category: Category = {
      id: "",
      name: toCapitalize(name),
      color,
      companyId,
      isDefault: false,
      createdAt: new Date(),
    };

    const response = await categoryInsertOrUpdate(category, []);

    if (!response.success) {
      throw new ApiError(
        response.message ?? "Error al procesar la solicitud de categoría",
        400
      );
    }

    return NextResponse.json(response, {
      status: 200,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Error al procesar la solicitud de categoría";
    const status = error instanceof ApiError ? error.status : 500;

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status }
    );
  }
}
