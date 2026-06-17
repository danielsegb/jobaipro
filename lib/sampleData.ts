import { CVData, AnalysisResult, CoverLetterData, JobDescriptionData } from "./types";

export const emptyCVData: CVData = {
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

export const emptyCoverLetterData: CoverLetterData = {
  recipient: "Hiring Manager",
  companyName: "",
  jobTitle: "",
  content: "",
  tone: "professional",
};

export const sampleCVData: CVData = {
  fullName: "Alexander Sterling",
  email: "alexander.sterling@email.co.uk",
  phone: "+44 7700 900077",
  location: "London, UK",
  linkedin: "linkedin.com/in/alexandersterling",
  portfolio: "alexandersterling.dev",
  professionalSummary: "Results-driven Software Engineering Manager with over 8 years of experience leading cross-functional teams to deliver scalable web applications. Expert in React, Next.js, Node.js, and cloud architecture. Passionate about mentoring developers, optimizing development lifecycles, and aligning technical strategy with business objectives.",
  skills: [
    "JavaScript (ES6+)",
    "TypeScript",
    "React",
    "Next.js",
    "Node.js",
    "Express.js",
    "GraphQL",
    "PostgreSQL",
    "MongoDB",
    "AWS (S3, EC2, Lambda)",
    "CI/CD (GitHub Actions)",
    "Agile / Scrum Methodologies"
  ],
  experience: [
    {
      jobTitle: "Lead Software Engineer",
      company: "InnovateTech Solutions Ltd",
      location: "London, UK",
      startDate: "2022-03",
      endDate: "Present",
      current: true,
      responsibilities: [
        "Lead a high-performing team of 6 engineers developing an enterprise SaaS platform.",
        "Architected and migrated the legacy frontend codebase to Next.js, improving load times by 42%.",
        "Implement CI/CD workflows and Docker containerization to streamline deployments.",
        "Collaborate with product and design teams to translate features into high-quality code."
      ],
      achievements: [
        "Reduced page loading speed by 42% through code-splitting and server-side rendering optimizations.",
        "Successfully delivered three major product releases on time and within budget, increasing enterprise customer satisfaction by 15%."
      ]
    },
    {
      jobTitle: "Senior Frontend Developer",
      company: "CloudCommerce Partners",
      location: "Manchester, UK",
      startDate: "2019-06",
      endDate: "2022-02",
      current: false,
      responsibilities: [
        "Developed and maintained highly responsive React-based e-commerce applications.",
        "Optimized state management using Redux Toolkit, decreasing state-related bugs by 30%.",
        "Mentored junior and mid-level developers, conducting constructive code reviews."
      ],
      achievements: [
        "Led the developer team that rebuilt the check-out flow, boosting conversion rates by 8.5%.",
        "Introduced automated testing with Jest and React Testing Library, achieving 80% code coverage."
      ]
    }
  ],
  education: [
    {
      qualification: "MSc in Advanced Computer Science",
      institution: "University of Manchester",
      location: "Manchester, UK",
      startDate: "2017-09",
      endDate: "2018-09",
      details: "Graduated with Distinction. Focused on distributed systems, advanced databases, and machine learning."
    },
    {
      qualification: "BSc (Hons) in Software Engineering",
      institution: "University of Bristol",
      location: "Bristol, UK",
      startDate: "2014-09",
      endDate: "2017-06",
      details: "First Class Honours. Awarded Best Capstone Project for building a collaborative coding editor."
    }
  ],
  projects: [
    {
      title: "TaskFlow Manager",
      description: "A collaborative project management application with real-time updates and interactive Kanban boards.",
      link: "github.com/alexsterling/taskflow",
      technologies: ["Next.js", "Socket.io", "Tailwind CSS", "MongoDB"]
    },
    {
      title: "DevMetrics Dashboard",
      description: "An analytics dashboard aggregating git commits, code reviews, and deployment cycles from GitHub API.",
      link: "devmetrics.co.uk",
      technologies: ["React", "Express.js", "Chart.js", "PostgreSQL"]
    }
  ],
  certifications: [
    "AWS Certified Solutions Architect – Associate (2023)",
    "Certified ScrumMaster (CSM) – Scrum Alliance (2021)"
  ],
  additionalSections: "Volunteered as a coding instructor at CodeYourFuture, teaching programming basics to refugees and underrepresented individuals. Active contributor to open-source libraries in the React ecosystem."
};

export const sampleJobDescription: JobDescriptionData = {
  jobTitle: "Engineering Manager (Frontend Focus)",
  companyName: "FinTech Hub Global",
  industry: "Finance / Technology",
  description: `About the Role:
FinTech Hub Global is looking for an Engineering Manager with a strong frontend background to lead our customer portal team. You will guide technical decisions, mentor developers, and drive software quality.

Requirements:
- 8+ years of software engineering experience, with at least 2 years in leadership or management roles.
- Expert-level knowledge of React, Next.js, TypeScript, and modern frontend architectures.
- Experience with cloud platforms (AWS preferred) and setting up robust CI/CD pipelines.
- Strong focus on performance optimization, SEO, and web accessibility standards (WCAG).
- Outstanding communication and stakeholder engagement skills.
- Experience in Agile/Scrum environments.

Nice to Have:
- Background in fintech, banking, or security-sensitive applications.
- Experience with GraphQL and PostgreSQL.`
};

export const sampleAnalysisResult: AnalysisResult = {
  overallScore: 78,
  keywordScore: 72,
  contentStrengthScore: 80,
  atsReadinessScore: 84,
  matchedKeywords: [
    "React",
    "Next.js",
    "TypeScript",
    "Software Engineering",
    "AWS",
    "CI/CD",
    "Agile",
    "Scrum",
    "performance optimization"
  ],
  missingKeywords: [
    "stakeholder engagement",
    "web accessibility",
    "WCAG",
    "fintech",
    "SEO"
  ],
  suggestedSkills: [
    "Stakeholder Engagement",
    "Web Accessibility (WCAG)",
    "SEO Best Practices",
    "Fintech Operations"
  ],
  improvementSuggestions: [
    "Specifically mention 'stakeholder engagement' in your Lead Software Engineer role, as you collaborate across teams.",
    "Add details about optimizing for web accessibility (WCAG) and SEO, which are highly requested in the job description.",
    "Integrate a brief mention of the fintech/banking domain or security awareness if applicable.",
    "Reframe professional summary to explicitly highlight 'Engineering Manager' rather than 'Lead Software Engineer' to match the target title."
  ],
  weakSections: [
    "Professional summary (needs alignment to Engineering Manager title)",
    "Skills (missing web accessibility and stakeholder engagement keywords)"
  ]
};

export const sampleOptimisedCVData: CVData = {
  ...sampleCVData,
  fullName: "Alexander Sterling",
  professionalSummary: "Results-driven Software Engineering Manager with over 8 years of experience leading cross-functional teams to deliver scalable web applications. Expert in React, Next.js, Node.js, and cloud architecture. Proven track record in stakeholder engagement, optimizing development lifecycles, and aligning technical strategy with business objectives.",
  skills: [
    ...sampleCVData.skills,
    "Stakeholder Engagement",
    "Web Accessibility (WCAG)",
    "SEO Best Practices"
  ],
  experience: [
    {
      ...sampleCVData.experience[0],
      jobTitle: "Software Engineering Manager / Lead Engineer",
      responsibilities: [
        "Lead a high-performing team of 6 engineers developing an enterprise SaaS platform, managing stakeholder engagement across product, design, and business units.",
        "Architected and migrated the legacy frontend codebase to Next.js, improving load times by 42% and implementing SEO best practices.",
        "Implement CI/CD workflows and Docker containerization to streamline deployments.",
        "Ensure all client-facing portals comply with WCAG web accessibility standards.",
        "Collaborate with product and design teams to translate features into high-quality code."
      ]
    },
    sampleCVData.experience[1]
  ]
};

export const sampleCoverLetter: CoverLetterData = {
  recipient: "Hiring Manager",
  companyName: "FinTech Hub Global",
  jobTitle: "Engineering Manager (Frontend Focus)",
  tone: "professional",
  content: `Dear Hiring Manager,

I am writing to express my strong interest in the Engineering Manager (Frontend Focus) position at FinTech Hub Global, as advertised. With over eight years of software engineering experience—including leading high-performing teams, architecting scalable frontend systems, and managing stakeholder engagement—I am confident in my ability to drive engineering excellence and mentor your customer portal team.

In my current role as Lead Software Engineer at InnovateTech Solutions, I lead a team of six developers to deliver and support our enterprise SaaS platform. A key highlight of my tenure was leading the migration of our legacy frontend to Next.js. This initiative reduced load times by 42% and improved SEO rankings, demonstrating my focus on high performance and modern web standards. Additionally, I championed the implementation of WCAG accessibility standards across our interfaces, ensuring a highly inclusive user experience.

Your job description emphasizes the need for robust CI/CD systems, Agile methodologies, and strong cloud experience. At InnovateTech, I built CI/CD pipelines using GitHub Actions and deployed microservices on AWS, which significantly cut build failures and improved release velocity. Furthermore, I have extensive experience in stakeholder engagement, translating complex product requirements into clear technical roadmaps and fostering a collaborative environment in fast-paced Agile setups.

I am particularly excited about FinTech Hub Global's reputation for innovative, security-focused financial solutions. Having worked extensively with secure state management and high-volume e-commerce applications, I understand the precision and stability needed in fintech platforms.

I welcome the opportunity to discuss how my leadership style and technical expertise can contribute to the success of your team. Thank you for your time and consideration.

Yours sincerely,

Alexander Sterling`
};
