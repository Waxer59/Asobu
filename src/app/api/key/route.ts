import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return new NextResponse(JSON.stringify({ bool: false }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  return new NextResponse(JSON.stringify({ bool: true }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}


// Get the API key from the request body and store it in the environment
export async function POST(req: NextRequest) {
  const { content } = await req.json();
  console.log(content)
  return new NextResponse("Hello, World!");
}

