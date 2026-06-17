import { NextRequest, NextResponse } from "next/server";
import { generateContent } from "@/lib/gemini";
import { buildCoverLetterPrompt } from "@/lib/aiPrompts";
import { parseRawCVText } from "@/lib/cvParser";

function generateFallbackCoverLetter(cvText: string, jobTitle: string, companyName: string): string {
  const parsed = parseRawCVText(cvText);
  const name = parsed.fullName || "Applicant";
  const email = parsed.email || "email@domain.com";
  const phone = parsed.phone || "";
  const location = parsed.location || "";
  
  return `Dear Hiring Manager,

I am writing to express my strong interest in the ${jobTitle || "Software Engineer"} position at ${companyName || "your company"}. With my background as detailed in my resume, I am confident in my ability to contribute effectively to your team.

My experience includes working on relevant projects and collaborating with cross-functional teams to deliver high-quality solutions. I am eager to bring my skills in technical execution, problem-solving, and professional excellence to this new opportunity.

Thank you for your time and consideration. I look forward to the opportunity to discuss my qualifications further.

Sincerely,

${name}
${email}
${phone}
${location}`;
}

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
      console.log("GEMINI_API_KEY not configured. Returning fallback cover letter.");
      const letter = generateFallbackCoverLetter(cvText, jobTitle, companyName);
      return NextResponse.json({ coverLetter: letter });
    }

    const prompt = buildCoverLetterPrompt(cvText, jobDescription, jobTitle, companyName, selectedTone);

    try {
      const resultText = await generateContent(prompt, { jsonMode: false });
      return NextResponse.json({ coverLetter: resultText });
    } catch (apiError) {
      console.error("Gemini API call failed during cover letter generation, falling back to custom cover letter:", apiError);
      const letter = generateFallbackCoverLetter(cvText, jobTitle, companyName);
      return NextResponse.json({
        coverLetter: letter,
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
