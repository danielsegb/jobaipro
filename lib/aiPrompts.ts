/**
 * Prompt templates for the Google Gemini API.
 * All prompts enforce British English spelling (optimisation, categorise, etc.)
 * and demand strict factual accuracy (do not invent details not present in the input).
 */

export function buildCVAnalysisPrompt(
  cvText: string,
  jobDescription: string,
  jobTitle?: string,
  companyName?: string,
  industry?: string
): string {
  return `You are an expert ATS (Applicant Tracking System) parser and professional career consultant.
Compare the user's CV below with the target Job Description to analyze the match quality.

TARGET JOB DETAILS (if available):
- Job Title: ${jobTitle || "Not specified"}
- Company Name: ${companyName || "Not specified"}
- Industry: ${industry || "Not specified"}

JOB DESCRIPTION:
\"\"\"
${jobDescription}
\"\"\"

USER'S CURRENT CV:
\"\"\"
${cvText}
\"\"\"

INSTRUCTIONS:
1. Conduct a rigorous comparison. Use British English spelling throughout.
2. Determine:
   - Matched keywords (exact or semantically similar technical skills, tools, and methodologies).
   - Missing keywords (critical skills, tools, or qualifications in the Job Description but absent or weak in the CV).
   - Suggested skills (highly relevant recommendations for the candidate, labeled as recommendations, NOT confirmed skills).
   - Four scoring categories (0-100):
     * overallScore: Weighted average of match quality.
     * keywordScore: Presence of critical terms.
     * contentStrengthScore: Tone, impact verbs, measurable achievements.
     * atsReadinessScore: Clear formatting, standard headings, parsability.
   - Specific, actionable improvement suggestions.
   - Weak sections that require rewriting or elaboration.
3. CRITICAL: Do NOT invent or assume any work experience, employers, dates, qualifications, or certifications.
4. Respond ONLY with a valid JSON object. Do not include markdown code block formatting (like \`\`\`json). Just return raw JSON.

JSON SCHEMA:
{
  "overallScore": number,
  "keywordScore": number,
  "contentStrengthScore": number,
  "atsReadinessScore": number,
  "matchedKeywords": string[],
  "missingKeywords": string[],
  "suggestedSkills": string[],
  "improvementSuggestions": string[],
  "weakSections": string[]
}
`;
}

export function buildCVOptimisationPrompt(
  cvText: string,
  jobDescription: string,
  jobTitle?: string,
  companyName?: string,
  industry?: string
): string {
  return `You are an expert executive resume writer and career coach.
Your task is to optimise the user's CV to make it highly relevant to the target Job Description.

TARGET JOB DETAILS (if available):
- Job Title: ${jobTitle || "Not specified"}
- Company Name: ${companyName || "Not specified"}
- Industry: ${industry || "Not specified"}

JOB DESCRIPTION:
\"\"\"
${jobDescription}
\"\"\"

USER'S CURRENT CV:
\"\"\"
${cvText}
\"\"\"

INSTRUCTIONS:
1. Rewrite and structure the CV to highlight relevance to the job description, using British English.
2. IDENTIFY CANDIDATE'S NAME: Find the candidate's REAL full name from the contact block of the CV (typically located near the email address or phone number). NEVER use a document title (like "Resume", "CV", "Curriculum Vitae", "Software Engineer"), tagline, tagline header, or section heading as the name.
3. SKILLS EXTRACTION: The "skills" array must consist of short noun phrases, specific tools, libraries, frameworks, languages, or core competencies ONLY (e.g., "TypeScript", "React", "Project Management", "Agile"). NEVER include full sentences, clause fragments, descriptions, or explanations. If a skill line reads like a sentence or contains a verb phrase, it is NOT a skill and must not be put in the skills array.
4. IGNORE LAYOUT ARTIFACTS: Completely ignore and do not output any layout artifacts, page-break indicators (such as "Page Break" or "-----Page (N) Break-----"), footer markers, or separator dashes in any field.
5. FIELD MAPPING: Rigorously map fields to their correct places:
   - Do not put responsibility/achievement sentences or descriptions into "jobTitle".
   - Do not put dates or extra text into the "skills" array.
   - Map jobTitle, company, location, and dates accurately to their respective fields in the Experience and Education arrays.
6. TRUTHFULNESS & ACCURACY: Keep all facts, dates, companies, qualifications, and achievements 100% TRUTHFUL to the original CV text. NEVER invent new employers, projects, degrees, dates, or certifications.
7. Improve grammar, tone, action verbs, and structure. Ensure that keywords from the job description are integrated naturally.
8. Convert responsibilities and achievements into bullet points that emphasize impact and measurable metrics (if mentioned).
9. Output the result ONLY as a valid JSON object matching the JSON schema below. Do not wrap the JSON in markdown code blocks.

JSON SCHEMA:
{
  "fullName": "Candidate's full name",
  "email": "Email address",
  "phone": "Phone number",
  "location": "Location (city, country)",
  "linkedin": "LinkedIn profile URL (or blank if none)",
  "portfolio": "Portfolio or personal website URL (or blank if none)",
  "professionalSummary": "An engaging 3-4 sentence professional profile/summary customized for this target role.",
  "skills": ["Skill 1", "Skill 2", "List only actual skills mentioned in the user's CV that align with the job"],
  "experience": [
    {
      "jobTitle": "Job Title",
      "company": "Company Name",
      "location": "Location",
      "startDate": "YYYY-MM or Month YYYY",
      "endDate": "YYYY-MM, Month YYYY, or Present",
      "current": boolean,
      "responsibilities": ["Responsibility bullet 1", "Responsibility bullet 2"],
      "achievements": ["Achievement bullet 1 (must be based on original CV facts only)"]
    }
  ],
  "education": [
    {
      "qualification": "Degree or Course Name",
      "institution": "University or College Name",
      "location": "Location",
      "startDate": "YYYY or Month YYYY",
      "endDate": "YYYY or Month YYYY",
      "details": "Details like grade or key projects (from original CV only)"
    }
  ],
  "projects": [
    {
      "title": "Project Title",
      "description": "Project description",
      "link": "Project link (optional)",
      "technologies": ["Tech 1", "Tech 2"]
    }
  ],
  "certifications": ["Certification 1", "Certification 2"],
  "additionalSections": "Any other sections from original CV (e.g. volunteering, languages) rewritten cleanly."
}
`;
}

export function buildCoverLetterPrompt(
  cvText: string,
  jobDescription: string,
  jobTitle?: string,
  companyName?: string,
  tone: string = "professional"
): string {
  return `You are a professional career coach and expert copywriter.
Write a highly tailored, professional cover letter for the candidate applying to the target job.

TARGET JOB DETAILS:
- Job Title: ${jobTitle || "Not specified"}
- Company Name: ${companyName || "Not specified"}
- Tone: ${tone}

JOB DESCRIPTION:
\"\"\"
${jobDescription}
\"\"\"

CANDIDATE'S CV:
\"\"\"
${cvText}
\"\"\"

INSTRUCTIONS:
1. Write a cover letter between 350 and 450 words in British English.
2. Structure the letter with formal segments:
   - Greeting (e.g., Dear Hiring Manager,)
   - Opening paragraph: State the role applied for, company, and why you are excited.
   - Body paragraphs (1 or 2): Connect the candidate's actual experience and skills to the key requirements of the job description. Highlight achievements from the CV.
   - Closing paragraph: Express enthusiasm for an interview, state next steps, and sign off politely.
3. CRITICAL: Do NOT invent accomplishments, degrees, dates, previous employers, or skills that are not supported by the candidate's CV.
4. Keep the tone '${tone}' — natural, confident, and professional.
5. Return the raw text of the cover letter only. Do not include instructions, options, or JSON wrappers. Just output the letter itself.
`;
}

export function buildSectionRewritePrompt(
  sectionText: string,
  sectionType: string,
  jobDescription: string
): string {
  return `You are a professional resume writer. Rewrite the following CV section to align it better with the provided job description.

SECTION TYPE: ${sectionType}
CURRENT SECTION CONTENT:
\"\"\"
${sectionText}
\"\"\"

TARGET JOB DESCRIPTION:
\"\"\"
${jobDescription}
\"\"\"

INSTRUCTIONS:
1. Rewrite only this section. Improve flow, strength, and readability, and integrate relevant keywords naturally.
2. Use British English spelling.
3. Keep all factual details (titles, dates, responsibilities, numbers) strictly truthful to the original text. Do NOT invent new achievements or facts.
4. Return ONLY the rewritten text of the section. Do not include headings, introduction, or explanations. Just return the new content.
`;
}
