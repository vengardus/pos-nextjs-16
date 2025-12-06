import { NextResponse } from "next/server";
import { z } from "zod";

import { aiAgentAction } from "@/actions/ai/ai-agent.action";

class ApiError extends Error {
  constructor(message: string, public readonly status: number = 500) {
    super(message);
  }
}

const requestSchema = z.object({
  prompt: z
    .string({
      required_error: "Error en la solicitud",
      invalid_type_error: "Error en la solicitud",
    })
    .trim()
    .min(1, "Error en la solicitud")
    .max(50, "El prompt no puede exceder 50 caracteres"),
  auth_code: z
    .string({
      required_error: "El código de autenticación es obligatorio",
      invalid_type_error: "El código de autenticación es obligatorio",
    })
    .trim()
    .min(1, "El código de autenticación es obligatorio"),
});

export async function POST(request: Request) {
  console.log("Received request for ai agent");

  try {
    const body = await request.json().catch(() => null);

    if (!body) {
      throw new ApiError("Solicitud inválida", 400);
    }

    const parsedBody = requestSchema.safeParse(body);

    if (!parsedBody.success) {
      const [error] = parsedBody.error.errors;
      const message = error?.message ?? "Solicitud inválida";

      throw new ApiError(message, 400);
    }

    const { prompt, auth_code } = parsedBody.data;

    const response = await aiAgentAction(prompt, auth_code);

    return NextResponse.json(response, {
      status: response.success ? 200 : 400,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Error al procesar la solicitud del agente AI";
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
