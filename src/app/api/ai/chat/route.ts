import { NextResponse } from "next/server";

import { groqGenerateText } from "@/lib/groq/groq-chat";

export async function POST(request: Request) {
  const { message } = await request.json().catch(() => ({ message: "" }));

  const response = await groqGenerateText(typeof message === "string" ? message : "");

  return NextResponse.json(response, {
    status: response.success ? 200 : 400,
  });
}
