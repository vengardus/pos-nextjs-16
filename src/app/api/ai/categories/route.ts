import { NextResponse } from "next/server";

import { toCapitalize } from "@/utils/formatters/to-capitalize";
import type { Category } from "@/types/interfaces/category/category.interface";
import { categoryInsertOrUpdateUseCase } from "@/server/category/use-cases/category.insert-or-update.use-case";
import { revalidateTag } from "next/cache";
import { CacheConfig } from "@/server/next/cache.config";

class ApiError extends Error {
  constructor(message: string, public readonly status: number = 500) {
    super(message);
  }
}

export async function POST(request: Request) {
  console.log("Received request to create category");
  try {
    const body = await request.json().catch(() => null);

    if (!body) {
      throw new ApiError("Solicitud inválida", 400);
    }

    const { name, color, companyId } = body as Partial<Category> & {
      companyId?: string;
    };

    if (!name || !color || !companyId) {
      throw new ApiError("Error en la solicitud", 400);
    }

    const category: Category = {
      id: "",
      name: toCapitalize(name),
      color,
      companyId,
      isDefault: false,
      createdAt: new Date(),
      imageUrl: null,
      updatedAt: null,
    };

    const response = await categoryInsertOrUpdateUseCase(category, []);

    if (!response.success) {
      throw new ApiError(
        response.message ?? "Error al procesar la solicitud de categoría",
        400
      );
    }

    if ( response.data && "companyId" in response.data ) {
      revalidateTag(
        `categories-${response.data.companyId}`,
        CacheConfig.CacheDurations)
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
