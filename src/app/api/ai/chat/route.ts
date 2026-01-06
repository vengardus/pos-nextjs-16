import { NextResponse } from "next/server";

import { aiChatUseCase } from "@/server/modules/ai/use-cases/ai-chat.use-case";

export async function POST(request: Request) {
  const { message } = await request.json().catch(() => ({ message: "" }));

  const response = await aiChatUseCase(typeof message === "string" ? message : "");

  return NextResponse.json(response, {
    status: response.success ? 200 : 400,
  });
}
