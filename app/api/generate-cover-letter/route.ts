import { NextRequest, NextResponse } from "next/server";
import { generateContent } from "@/lib/gemini";
import { buildCoverLetterPrompt } from "@/lib/aiPrompts";
import { sampleCoverLetter } from "@/lib/sampleData";

export async function POST(req: NextRequest) {
  try {
    const { cvText, jobDescription, jobTitle, companyName, tone } = await req.json();

    if (!cvText || !jobDescription) {
      return NextResponse.json(
        { error: "CV text and Job Description are required." },
        { status: 400 }
      );
    }

    const selectedTone = tone || "professional";

    // Fallback if key missing
    if (!process.env.GEMINI_API_KEY) {
      console.log("GEMINI_API_KEY not configured. Returning mock cover letter.");
      await new Promise((resolve) => setTimeout(resolve, 1800));
      return NextResponse.json({ coverLetter: sampleCoverLetter.content });
    }

    const prompt = buildCoverLetterPrompt(cvText, jobDescription, jobTitle, companyName, selectedTone);

    try {
      const resultText = await generateContent(prompt, { jsonMode: false });
      return NextResponse.json({ coverLetter: resultText });
    } catch (apiError) {
      console.error("Gemini API call failed during cover letter generation, falling back to mock data:", apiError);
      return NextResponse.json({
        coverLetter: sampleCoverLetter.content,
        warning: "Cover letter generated using fallback engine."
      });
    }
  } catch (error) {
    console.error("Error in generate-cover-letter API route:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during cover letter generation." },
      { status: 500 }
    );
  }
}
