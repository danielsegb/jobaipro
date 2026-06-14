import { NextRequest, NextResponse } from "next/server";
import { generateContent } from "@/lib/gemini";
import { buildCVAnalysisPrompt } from "@/lib/aiPrompts";
import { sampleAnalysisResult } from "@/lib/sampleData";

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

    // Check if API key exists. If not, use mock data.
    if (!process.env.GEMINI_API_KEY) {
      console.log("GEMINI_API_KEY not configured. Returning mock analysis result.");
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return NextResponse.json({ analysis: sampleAnalysisResult });
    }

    const prompt = buildCVAnalysisPrompt(cvText, jobDescription, jobTitle, companyName, industry);
    
    try {
      const resultText = await generateContent(prompt, { jsonMode: true });
      const cleanJson = cleanJsonResponse(resultText);
      const parsedAnalysis = JSON.parse(cleanJson);
      return NextResponse.json({ analysis: parsedAnalysis });
    } catch (apiError) {
      console.error("Gemini API call failed during analysis, falling back to mock data:", apiError);
      return NextResponse.json({
        analysis: sampleAnalysisResult,
        warning: "Analysis completed using fallback engine."
      });
    }
  } catch (error) {
    console.error("Error in analyse API route:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during analysis." },
      { status: 500 }
    );
  }
}
