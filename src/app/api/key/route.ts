import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  const body = await req.formData();
  const apiKey = body.get("apiKey");

  redirect("/chat/[[...chatId]]");
}
