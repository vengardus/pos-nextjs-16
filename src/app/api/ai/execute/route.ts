import { NextResponse } from "next/server";

import { aiAgentAction } from "@/actions/ai/ai-agent.action";

class ApiError extends Error {
  constructor(message: string, public readonly status: number = 500) {
    super(message);
  }
}

export async function POST(request: Request) {
  console.log("Received request for ai agent");

  try {
    const body = await request.json().catch(() => null);

    if (!body) {
      throw new ApiError("Solicitud inválida", 400);
    }

    const { prompt } = body as { prompt?: unknown };
    const parsedPrompt = typeof prompt === "string" ? prompt.trim() : "";

    if (!parsedPrompt) {
      throw new ApiError("Error en la solicitud", 400);
    }

    if (parsedPrompt.length > 50) {
      throw new ApiError("El prompt no puede exceder 50 caracteres", 400);
    }

    const response = await aiAgentAction(parsedPrompt);

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
