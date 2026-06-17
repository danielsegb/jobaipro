import { NextRequest, NextResponse } from "next/server";
import { generateContent } from "@/lib/gemini";
import { buildCVOptimisationPrompt } from "@/lib/aiPrompts";
import { parseRawCVText } from "@/lib/cvParser";

function cleanJsonResponse(text: string): string {
  let clean = text.trim();
  if (clean.startsWith("```")) {
    clean = clean.replace(/^```json\s*/i, "");
    clean = clean.replace(/^```\s*/, "");
    clean = clean.replace(/```$/, "");
  }
  return clean.trim();
}

export async function POST(req: NextRequest) {
  try {
    const { cvText, jobDescription, jobTitle, companyName, industry } = await req.json();

    if (!cvText || !jobDescription) {
      return NextResponse.json(
        { error: "CV text and Job Description are required." },
        { status: 400 }
      );
    }

    // Fallback if key missing
    if (!process.env.GEMINI_API_KEY) {
      console.log("GEMINI_API_KEY not configured. Returning parsed user CV.");
      const parsed = parseRawCVText(cvText);
      return NextResponse.json({ optimisedCV: parsed });
    }

    const prompt = buildCVOptimisationPrompt(cvText, jobDescription, jobTitle, companyName, industry);

    try {
      const resultText = await generateContent(prompt, { jsonMode: true });
      const cleanJson = cleanJsonResponse(resultText);
      const parsedCV = JSON.parse(cleanJson);
      return NextResponse.json({ optimisedCV: parsedCV });
    } catch (apiError) {
      console.error("Gemini API call failed during CV optimization, falling back to parsed user CV:", apiError);
      const parsed = parseRawCVText(cvText);
      return NextResponse.json({
        optimisedCV: parsed,
        warning: "CV optimization completed using fallback engine."
      });
    }
  } catch (error) {
    console.error("Error in generate-cv API route:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during CV optimization." },
      { status: 500 }
    );
  }
}
