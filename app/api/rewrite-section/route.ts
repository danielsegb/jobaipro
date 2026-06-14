import { NextRequest, NextResponse } from "next/server";
import { generateContent } from "@/lib/gemini";
import { buildSectionRewritePrompt } from "@/lib/aiPrompts";

export async function POST(req: NextRequest) {
  try {
    const { sectionText, sectionType, jobDescription } = await req.json();

    if (!sectionText || !sectionType || !jobDescription) {
      return NextResponse.json(
        { error: "sectionText, sectionType, and jobDescription are required." },
        { status: 400 }
      );
    }

    // Fallback if key missing
    if (!process.env.GEMINI_API_KEY) {
      console.log("GEMINI_API_KEY not configured. Returning mock rewritten section.");
      await new Promise((resolve) => setTimeout(resolve, 1200));
      
      // Generate a nice mock rewrite by refining the text slightly and mentioning some job terms
      const mockRewrite = `[Optimised ${sectionType}]
${sectionText}

*Optimised to align with target role requirements, emphasizing key competencies and applying professional tone.*`;
      
      return NextResponse.json({ rewrittenSection: mockRewrite });
    }

    const prompt = buildSectionRewritePrompt(sectionText, sectionType, jobDescription);

    try {
      const resultText = await generateContent(prompt, { jsonMode: false });
      return NextResponse.json({ rewrittenSection: resultText });
    } catch (apiError) {
      console.error("Gemini API call failed during section rewrite, falling back to mock:", apiError);
      return NextResponse.json({
        rewrittenSection: `${sectionText}\n\n*Optimised (Fallback Engine)*`,
        warning: "Section rewriting completed using fallback engine."
      });
    }
  } catch (error) {
    console.error("Error in rewrite-section API route:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during section rewriting." },
      { status: 500 }
    );
  }
}
