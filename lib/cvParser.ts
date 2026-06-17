import { CVData, ExperienceItem, EducationItem, ProjectItem } from "./types";

/**
 * A client-side parser utility that uses regex and text scanning heuristics
 * to convert raw text into a structured CVData object.
 */
export function parseRawCVText(text: string): CVData {
  const lines = text.split("\n").map(l => l.trim());
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

  if (lines.length === 0 || !text.trim()) {
    return data;
  }

  // Helper patterns
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  const phoneRegex = /(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?/;
  const linkedinRegex = /(?:linkedin\.com\/in\/[a-zA-Z0-9-_]+)/i;
  const portfolioRegex = /(?:[a-zA-Z0-9-]+\.(?:com|co\.uk|org|net|dev|io|me))/i;

  // Try to find contacts in the first 10 lines
  const headerLines = lines.slice(0, 10);
  
  // Name is usually the first non-empty line
  for (const line of headerLines) {
    if (line && !data.fullName && !line.includes("@") && !line.match(/\+?\d/) && line.length < 50) {
      data.fullName = line;
      break;
    }
  }

  // Parse contact details
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

  // Guess location (look for UK postcodes or common words in header)
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
      // Split by commas, bullet points, or newlines
      const splitSkills = sectionText
        .split(/[,\n•|]/)
        .map(s => s.trim())
        .filter(s => s.length > 1 && s.length < 50);
      data.skills.push(...splitSkills);
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
