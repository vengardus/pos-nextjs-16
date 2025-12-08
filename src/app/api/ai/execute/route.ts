import { NextResponse } from "next/server";
import { z } from "zod";

import { aiAgentAction } from "@/actions/ai/ai-agent.action";
import { initResponseAction } from "@/utils/response/init-response-action";

class ApiError extends Error {
  constructor(message: string, public readonly status: number = 500) {
    super(message);
  }
}

const requestSchema = z.object({
  prompt: z
    .string({
      // En Zod 4, unificas ambos mensajes en `error`
      error: "Error en la solicitud",
    })
    .trim()
    .min(1, "Error en la solicitud")
    .max(50, "El prompt no puede exceder 50 caracteres"),
  auth_code: z
    .string({
      error: "El código de autenticación es obligatorio",
    })
    .trim()
    .min(1, "El código de autenticación es obligatorio"),
});

export async function POST(request: Request) {
  console.log("Received request for ai agent");
  const resp = initResponseAction();

  try {
    const body = await request.json().catch(() => null);

    if (!body) throw new ApiError("Solicitud inválida", 400);

    const parsedBody = requestSchema.safeParse(body);

    if (!parsedBody.success) {
      const [issue] = parsedBody.error.issues;
      const message = issue?.message ?? "Solicitud inválida";
      throw new ApiError(message, 400);
    }

    const { prompt, auth_code } = parsedBody.data;

    const respAgent = await aiAgentAction(prompt, auth_code);

    resp.success = respAgent.success;
    resp.message = respAgent.message;
    resp.data = respAgent.data;

    return NextResponse.json(resp, {
      status: respAgent.success ? 200 : 400,
    });
  } catch (error) {
    resp.message =
      error instanceof Error
        ? error.message
        : "Error al procesar la solicitud del agente AI";
    const status = error instanceof ApiError ? error.status : 500;

    return NextResponse.json(resp, { status });
  }
}
