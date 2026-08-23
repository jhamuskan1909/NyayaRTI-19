import { NextRequest, NextResponse } from "next/server";
import { processGrievanceWithAI } from "@/lib/ai-extractor";
import { initialRtiData } from "@/lib/rti-template";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, history = [], currentRti = initialRtiData } = body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const extractionResult = await processGrievanceWithAI(
      message.trim(),
      history,
      currentRti
    );

    return NextResponse.json(extractionResult);
  } catch (error: any) {
    console.error("API /chat error:", error);
    return NextResponse.json(
      {
        error: "Failed to process grievance",
        details: error?.message || "Internal server error"
      },
      { status: 500 }
    );
  }
}
