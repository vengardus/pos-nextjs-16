import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

import { initResponseAction } from "@/utils/response/init-response-action";
import { aiAgentUseCase } from "@/server/modules/ai/use-cases/ai-agent.use-case";
import { CacheConfig } from "@/server/next/cache.config";
import { requestSchema } from "./request.schema";

class ApiError extends Error {
  constructor(message: string, public readonly status: number = 500) {
    super(message);
  }
}

export async function POST(request: Request) {
  console.log("Received request for ai agent");

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

    const respAgent = await aiAgentUseCase(prompt, auth_code);

    if (respAgent.success && respAgent.data && "companyId" in respAgent.data) {
      revalidateTag(
        `categories-${respAgent.data.companyId}`,
        CacheConfig.CacheDurations
      );
    }

    return NextResponse.json(respAgent, {
      status: respAgent.success ? 200 : 400,
    });
  } catch (error) {
    const resp = {
      ...initResponseAction(),
      message:
      error instanceof Error
        ? error.message
        : "Error al procesar la solicitud del agente AI"
    }
    const status = error instanceof ApiError ? error.status : 500;

    return NextResponse.json(resp, { status });
  }
}
