import * as React from "react";
import { Upload, FileText, Clipboard } from "lucide-react";
import { Button } from "../ui/Button";
import { Textarea } from "../ui/Textarea";
import { Card, CardContent } from "../ui/Card";
import { sampleCVData } from "@/lib/sampleData";

export interface CVInputFormProps {
  cvText: string;
  setCvText: (text: string) => void;
  onNext: () => void;
}

export function CVInputForm({ cvText, setCvText, onNext }: CVInputFormProps) {
  const [dragActive, setDragActive] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      simulateFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      simulateFileUpload(e.target.files[0]);
    }
  };

  const simulateFileUpload = (file: File) => {
    // Show a basic notice and load the sample CV data for MVP ease
    console.log("File dropped/selected:", file.name);
    
    // Create a text representation of the sample CV to put in the text area
    const sampleText = `Alexander Sterling
Email: alexander.sterling@email.co.uk | Phone: +44 7700 900077 | Location: London, UK
LinkedIn: linkedin.com/in/alexandersterling | Portfolio: alexandersterling.dev

PROFESSIONAL SUMMARY
Results-driven Software Engineering Manager with over 8 years of experience leading cross-functional teams to deliver scalable web applications. Expert in React, Next.js, Node.js, and cloud architecture.

KEY SKILLS
JavaScript (ES6+), TypeScript, React, Next.js, Node.js, Express.js, GraphQL, PostgreSQL, MongoDB, AWS (S3, EC2, Lambda), CI/CD, Agile

PROFESSIONAL EXPERIENCE
Lead Software Engineer | InnovateTech Solutions Ltd (2022-03 to Present)
- Lead a high-performing team of 6 engineers developing an enterprise SaaS platform.
- Architected and migrated the legacy frontend codebase to Next.js, improving load times by 42%.
- Reduced page loading speed by 42% through code-splitting.

Senior Frontend Developer | CloudCommerce Partners (2019-06 to 2022-02)
- Developed React-based e-commerce applications.
- Rebuilt check-out flow, boosting conversions by 8.5%.

EDUCATION
MSc in Advanced Computer Science | University of Manchester (2017 - 2018)
BSc (Hons) in Software Engineering | University of Bristol (2014 - 2017)
`;
    setCvText(sampleText);
  };

  const loadSample = () => {
    const sampleText = `Alexander Sterling
Email: alexander.sterling@email.co.uk | Phone: +44 7700 900077 | Location: London, UK
LinkedIn: linkedin.com/in/alexandersterling | Portfolio: alexandersterling.dev

PROFESSIONAL SUMMARY
Results-driven Software Engineering Manager with over 8 years of experience leading cross-functional teams to deliver scalable web applications. Expert in React, Next.js, Node.js, and cloud architecture.

KEY SKILLS
JavaScript (ES6+), TypeScript, React, Next.js, Node.js, Express.js, GraphQL, PostgreSQL, MongoDB, AWS (S3, EC2, Lambda), CI/CD, Agile

PROFESSIONAL EXPERIENCE
Lead Software Engineer | InnovateTech Solutions Ltd (2022-03 to Present)
- Lead a high-performing team of 6 engineers developing an enterprise SaaS platform.
- Architected and migrated the legacy frontend codebase to Next.js, improving load times by 42%.
- Reduced page loading speed by 42% through code-splitting.

Senior Frontend Developer | CloudCommerce Partners (2019-06 to 2022-02)
- Developed React-based e-commerce applications.
- Rebuilt check-out flow, boosting conversions by 8.5%.

EDUCATION
MSc in Advanced Computer Science | University of Manchester (2017 - 2018)
BSc (Hons) in Software Engineering | University of Bristol (2014 - 2017)
`;
    setCvText(sampleText);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Step 1: Upload or paste your CV</h2>
          <p className="text-sm text-slate-500 mt-1">Provide the current version of your CV to establish your background.</p>
        </div>
        <Button variant="outline" size="sm" onClick={loadSample} className="self-start sm:self-center">
          <Clipboard className="w-4 h-4 mr-2" />
          Load Sample CV
        </Button>
      </div>

      {/* Drag & Drop simulated box */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-200 ${
          dragActive 
            ? "border-blue-500 bg-blue-50/30" 
            : "border-slate-200 hover:border-blue-400 hover:bg-slate-50/50"
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".pdf,.docx,.txt"
          className="hidden"
        />
        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
          <Upload className="w-6 h-6" />
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-slate-900">
            Click to upload or drag and drop
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Supports PDF, DOCX, or TXT (Max 10MB)
          </p>
        </div>
      </div>

      <div className="relative flex py-2 items-center">
        <div className="flex-grow border-t border-slate-100"></div>
        <span className="flex-shrink mx-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Or paste CV text</span>
        <div className="flex-grow border-t border-slate-100"></div>
      </div>

      {/* Text area paste */}
      <div className="space-y-2">
        <Textarea
          value={cvText}
          onChange={(e) => setCvText(e.target.value)}
          placeholder="Paste your CV content here... Include your name, work history, education, and skills."
          rows={12}
          className="font-sans leading-relaxed text-sm focus:ring-blue-500/10 focus:border-blue-500"
        />
      </div>

      {/* Action */}
      <div className="flex justify-end pt-4">
        <Button
          disabled={!cvText.trim()}
          onClick={onNext}
          className="px-8"
        >
          Next: Target Job
        </Button>
      </div>
    </div>
  );
}
