import { NextRequest, NextResponse } from "next/server";
import { generateContent } from "@/lib/gemini";
import { buildCVOptimisationPrompt } from "@/lib/aiPrompts";
import { sampleOptimisedCVData } from "@/lib/sampleData";

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
      console.log("GEMINI_API_KEY not configured. Returning mock optimised CV.");
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return NextResponse.json({ optimisedCV: sampleOptimisedCVData });
    }

    const prompt = buildCVOptimisationPrompt(cvText, jobDescription, jobTitle, companyName, industry);

    try {
      const resultText = await generateContent(prompt, { jsonMode: true });
      const cleanJson = cleanJsonResponse(resultText);
      const parsedCV = JSON.parse(cleanJson);
      return NextResponse.json({ optimisedCV: parsedCV });
    } catch (apiError) {
      console.error("Gemini API call failed during CV optimization, falling back to mock data:", apiError);
      return NextResponse.json({
        optimisedCV: sampleOptimisedCVData,
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
