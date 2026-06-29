import { CVData, ExperienceItem, EducationItem, ProjectItem } from "./types";

/**
 * A client-side parser utility that uses regex and text scanning heuristics
 * to convert raw text into a structured CVData object.
 */
export function parseRawCVText(text: string): CVData {
  const data: CVData = {
    fullName: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    portfolio: "",
    professionalSummary: "",
    skills: [],
    experience: [],
    education: [],
    projects: [],
    certifications: [],
    additionalSections: ""
  };

  if (!text || !text.trim()) {
    return data;
  }

  // Strip page-break / separator artifacts
  const cleanLines: string[] = [];
  const rawLines = text.split(/\r?\n/);
  for (const rawLine of rawLines) {
    const trimmedLine = rawLine.trim();
    if (/-*\s*Page \(\d+\) Break\s*-*/gi.test(trimmedLine)) {
      continue;
    }
    // Strip runs of dashes
    const sanitizedLine = trimmedLine.replace(/-{2,}/g, "");
    cleanLines.push(sanitizedLine.trim());
  }

  const lines = cleanLines.filter(line => line.length > 0);
  if (lines.length === 0) {
    return data;
  }

  // Helper patterns
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  const phoneRegex = /(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?/;
  const linkedinRegex = /(?:linkedin\.com\/in\/[a-zA-Z0-9-_]+)/i;
  const portfolioRegex = /(?:[a-zA-Z0-9-]+\.(?:com|co\.uk|org|net|dev|io|me))/i;

  // Find contact details first to use in name search proximity
  for (const line of lines) {
    // Email
    if (!data.email) {
      const match = line.match(emailRegex);
      if (match) data.email = match[0];
    }
    // Phone
    if (!data.phone) {
      const match = line.match(phoneRegex);
      if (match) data.phone = match[0];
    }
    // LinkedIn
    if (!data.linkedin) {
      const match = line.match(linkedinRegex);
      if (match) data.linkedin = match[0];
    }
    // Portfolio
    if (!data.portfolio && !line.includes("@") && !line.includes("linkedin.com")) {
      const match = line.match(portfolioRegex);
      if (match) data.portfolio = match[0];
    }
  }

  // Choose the name from the line nearest the email/phone in the header (first 15 lines),
  // rejecting all-caps lines longer than ~3 words as names, and avoiding common document titles.
  let contactLineIdx = -1;
  for (let i = 0; i < Math.min(15, lines.length); i++) {
    if (lines[i].match(emailRegex) || lines[i].match(phoneRegex)) {
      contactLineIdx = i;
      break;
    }
  }

  const invalidNameKeywords = ["cv", "resume", "curriculum vitae", "portfolio", "linkedin", "contact", "experience", "education", "skills", "summary", "profile", "about", "page", "break", "software engineer", "developer", "designer"];
  let bestName = "";
  let bestDist = Infinity;

  for (let i = 0; i < Math.min(15, lines.length); i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Reject lines with contact details, colons, slashes, or pipes which are usually sections or contact blocks
    if (line.includes("@") || line.match(/\+?\d/) || line.includes(":") || line.includes("|") || line.includes("/")) continue;

    const words = line.split(/\s+/).filter(Boolean);
    if (words.length === 0 || words.length > 4) continue; // Real names are usually 1 to 4 words

    // Reject all-caps lines longer than ~3 words
    const isAllCaps = line === line.toUpperCase() && /[A-Z]/.test(line);
    if (isAllCaps && words.length > 3) continue;

    // Reject if line contains generic/invalid headers
    const lowerLine = line.toLowerCase();
    if (invalidNameKeywords.some(kw => lowerLine.includes(kw))) continue;

    // Proximity logic
    const dist = contactLineIdx !== -1 ? Math.abs(i - contactLineIdx) : i;
    if (dist < bestDist) {
      bestDist = dist;
      bestName = line;
    }
  }

  data.fullName = bestName;

  // Guess location (look for UK postcodes or common words in header)
  const headerLines = lines.slice(0, 10);
  for (const line of headerLines) {
    if (line.toLowerCase().includes("london") || line.toLowerCase().includes("manchester") || line.toLowerCase().includes("uk") || line.toLowerCase().includes("united kingdom")) {
      data.location = line.replace(/^[|•,\s]+|[|•,\s]+$/g, "").trim();
      break;
    }
  }
  if (!data.location) data.location = ""; // Default

  // Section Tracking
  let currentSection = "summary"; // Start in summary
  let sectionTextBuffer: string[] = [];

  const sectionHeaders = {
    summary: ["summary", "profile", "objective", "professional summary", "about me"],
    skills: ["skills", "key skills", "technical skills", "competencies", "expertise"],
    experience: ["experience", "employment", "work experience", "career history", "work history"],
    education: ["education", "academic", "qualifications", "education history"],
    projects: ["projects", "personal projects", "key projects"],
    certifications: ["certifications", "certs", "courses", "licenses"],
    additional: ["additional", "interests", "volunteering", "references", "additional information"]
  };

  const findSection = (line: string): string | null => {
    const cleanLine = line.toLowerCase().replace(/[^a-z ]/g, "").trim();
    for (const [key, headers] of Object.entries(sectionHeaders)) {
      if (headers.includes(cleanLine)) {
        return key;
      }
    }
    return null;
  };

  // Buffer aggregator helper
  const flushSectionBuffer = (section: string, buffer: string[]) => {
    const sectionText = buffer.join("\n").trim();
    if (!sectionText) return;

    if (section === "summary") {
      data.professionalSummary = sectionText;
    } else if (section === "skills") {
      // Split by commas, bullet points, pipe, or newlines
      const rawTokens = sectionText.split(/[,\n•|]/);
      const filteredSkills: string[] = [];
      for (const token of rawTokens) {
        const trimmed = token.trim();
        if (!trimmed) continue;

        // Check word count (must be <= 6 words)
        const words = trimmed.split(/\s+/).filter(Boolean);
        if (words.length > 6) continue;

        // Check for sentence punctuation (. ! ? ;)
        if (/[.?!;](\s|$)/.test(trimmed)) {
          // Allow single word abbreviations like .NET but reject sentence punctuation
          if (words.length > 1 || !trimmed.startsWith(".")) {
            continue;
          }
        }

        if (trimmed.length > 1 && trimmed.length < 50) {
          filteredSkills.push(trimmed);
        }
      }
      data.skills.push(...filteredSkills);
    } else if (section === "experience") {
      // Heuristic parsing of experience items
      const blockLines = sectionText.split("\n");
      let currentItem: ExperienceItem | null = null;

      for (const bLine of blockLines) {
        const lineVal = bLine.trim();
        if (!lineVal) continue;

        // Check if this looks like a date range or title
        // e.g. "Software Engineer | InnovateTech - 2020 to Present"
        const hasDate = lineVal.match(/\b(19|20)\d{2}\b/);
        const isBullet = lineVal.startsWith("•") || lineVal.startsWith("-") || lineVal.startsWith("*");

        if (!isBullet && (hasDate || lineVal.length < 80 && currentItem === null)) {
          // Flush previous
          if (currentItem) data.experience.push(currentItem);
          
          // Basic split by separator
          const parts = lineVal.split(/[|,-]/).map(p => p.trim());
          const title = parts[0] || "Software Engineer";
          const company = parts[1] || "Technology Solutions";
          const dates = parts.slice(2).join(" - ") || "2020 - Present";

          currentItem = {
            jobTitle: title,
            company: company,
            location: "United Kingdom",
            startDate: dates.split("-")[0]?.trim() || "2020",
            endDate: dates.split("-")[1]?.trim() || "Present",
            current: dates.toLowerCase().includes("present"),
            responsibilities: [],
            achievements: []
          };
        } else if (currentItem) {
          const cleanedText = lineVal.replace(/^[•\s-*]+/, "").trim();
          if (cleanedText.toLowerCase().startsWith("achievement:") || cleanedText.toLowerCase().startsWith("achieved:")) {
            currentItem.achievements.push(cleanedText.replace(/^(achievement|achieved):\s*/i, "").trim());
          } else {
            currentItem.responsibilities.push(cleanedText);
          }
        }
      }
      if (currentItem) data.experience.push(currentItem);
    } else if (section === "education") {
      const blockLines = sectionText.split("\n");
      let currentItem: EducationItem | null = null;

      for (const bLine of blockLines) {
        const lineVal = bLine.trim();
        if (!lineVal) continue;

        const hasDate = lineVal.match(/\b(19|20)\d{2}\b/);
        const isBullet = lineVal.startsWith("•") || lineVal.startsWith("-") || lineVal.startsWith("*");

        if (!isBullet && (hasDate || currentItem === null)) {
          if (currentItem) data.education.push(currentItem);
          const parts = lineVal.split(/[|,-]/).map(p => p.trim());
          currentItem = {
            qualification: parts[0] || "Degree",
            institution: parts[1] || "University",
            location: "UK",
            startDate: "2015",
            endDate: parts[2] || "2018",
            details: ""
          };
        } else if (currentItem) {
          const cleanedText = lineVal.replace(/^[•\s-*]+/, "").trim();
          currentItem.details += (currentItem.details ? " " : "") + cleanedText;
        }
      }
      if (currentItem) data.education.push(currentItem);
    } else if (section === "projects") {
      const blockLines = sectionText.split("\n");
      let currentItem: ProjectItem | null = null;

      for (const bLine of blockLines) {
        const lineVal = bLine.trim();
        if (!lineVal) continue;

        const isBullet = lineVal.startsWith("•") || lineVal.startsWith("-") || lineVal.startsWith("*");

        if (!isBullet && currentItem === null) {
          if (currentItem) data.projects.push(currentItem);
          currentItem = {
            title: lineVal,
            description: "",
            technologies: []
          };
        } else if (currentItem) {
          const cleanedText = lineVal.replace(/^[•\s-*]+/, "").trim();
          currentItem.description += (currentItem.description ? " " : "") + cleanedText;
        }
      }
      if (currentItem) data.projects.push(currentItem);
    } else if (section === "certifications") {
      const certList = sectionText
        .split(/[\n•]/)
        .map(c => c.trim().replace(/^[•\s-*]+/, "").trim())
        .filter(c => c.length > 2);
      data.certifications.push(...certList);
    } else if (section === "additional") {
      data.additionalSections = sectionText;
    }
  };

  // Loop through lines to detect sections
  for (const line of lines) {
    const detected = findSection(line);
    if (detected) {
      flushSectionBuffer(currentSection, sectionTextBuffer);
      currentSection = detected;
      sectionTextBuffer = [];
    } else {
      sectionTextBuffer.push(line);
    }
  }
  // Flush final section
  flushSectionBuffer(currentSection, sectionTextBuffer);

  // If we parsed nothing into major structures, load template sample data structure with parsed headers
  if (data.experience.length === 0 && data.education.length === 0 && data.skills.length === 0) {
    // If it's a completely unparsed copy, put the entire text block in professional summary
    data.professionalSummary = text;
    data.fullName = data.fullName || "";
    data.email = data.email || "";
  }

  return data;
}
