export interface ExperienceItem {
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  responsibilities: string[];
  achievements: string[];
}

export interface EducationItem {
  qualification: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  details: string;
}

export interface ProjectItem {
  title: string;
  description: string;
  link?: string;
  technologies?: string[];
}

export interface CVData {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  portfolio: string;
  professionalSummary: string;
  skills: string[];
  experience: ExperienceItem[];
  education: EducationItem[];
  projects: ProjectItem[];
  certifications: string[];
  additionalSections: string;
}

export interface JobDescriptionData {
  jobTitle: string;
  companyName: string;
  industry: string;
  description: string;
}

export interface AnalysisResult {
  overallScore: number;
  keywordScore: number;
  contentStrengthScore: number;
  atsReadinessScore: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  suggestedSkills: string[];
  improvementSuggestions: string[];
  weakSections: string[];
}

export interface CoverLetterData {
  recipient: string;
  companyName: string;
  jobTitle: string;
  content: string;
  tone: string;
}

export type TemplateStyle = 'classic' | 'modern' | 'tech' | 'healthcare' | 'graduate';
