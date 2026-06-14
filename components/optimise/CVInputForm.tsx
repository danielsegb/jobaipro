import * as React from "react";
import { Upload, Clipboard, AlertCircle, FileText } from "lucide-react";
import { Button } from "../ui/Button";
import { Textarea } from "../ui/Textarea";

export interface CVInputFormProps {
  cvText: string;
  setCvText: (text: string) => void;
  onNext: () => void;
}

const SAMPLE_CV_TEXT = `Alexander Sterling
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
- Reduced page loading speed by 42% through code-splitting and server-side rendering optimisations.

Senior Frontend Developer | CloudCommerce Partners (2019-06 to 2022-02)
- Developed and maintained highly responsive React-based e-commerce applications.
- Rebuilt check-out flow, boosting conversion rates by 8.5%.
- Mentored junior developers and conducted constructive code reviews.

EDUCATION
MSc in Advanced Computer Science | University of Manchester (2017 - 2018)
Graduated with Distinction. Focused on distributed systems and machine learning.

BSc (Hons) in Software Engineering | University of Bristol (2014 - 2017)
First Class Honours. Awarded Best Capstone Project.

CERTIFICATIONS
AWS Certified Solutions Architect – Associate (2023)
Certified ScrumMaster (CSM) – Scrum Alliance (2021)
`;

export function CVInputForm({ cvText, setCvText, onNext }: CVInputFormProps) {
  const [dragActive, setDragActive] = React.useState(false);
  const [fileNotice, setFileNotice] = React.useState<{ type: "info" | "error"; message: string } | null>(null);
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
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
    // Reset input so the same file can be re-selected
    e.target.value = "";
  };

  const processFile = (file: File) => {
    setFileNotice(null);
    const ext = file.name.split(".").pop()?.toLowerCase();

    if (ext === "txt") {
      // Read plain text files directly
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        if (content && content.trim()) {
          setCvText(content);
          setFileNotice({ type: "info", message: `✓ "${file.name}" loaded successfully. Review and edit below if needed.` });
        } else {
          setFileNotice({ type: "error", message: "The file appears to be empty. Please paste your CV text below instead." });
        }
      };
      reader.onerror = () => {
        setFileNotice({ type: "error", message: "Failed to read the file. Please paste your CV text below instead." });
      };
      reader.readAsText(file, "UTF-8");
    } else if (ext === "pdf" || ext === "docx" || ext === "doc") {
      // PDF/DOCX cannot be parsed in the browser without heavy libraries.
      // Clear any existing text and prompt the user to copy-paste.
      setFileNotice({
        type: "info",
        message: `PDF and Word documents cannot be read directly in the browser. Please open "${file.name}", select all text (Ctrl+A), copy it (Ctrl+C), then paste it into the text area below.`,
      });
    } else {
      setFileNotice({ type: "error", message: "Unsupported file type. Please upload a .txt file or paste your CV text directly below." });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Step 1: Upload or paste your CV</h2>
          <p className="text-sm text-slate-500 mt-1">Provide the current version of your CV to establish your background.</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => { setCvText(SAMPLE_CV_TEXT); setFileNotice(null); }} className="self-start sm:self-center">
          <Clipboard className="w-4 h-4 mr-2" />
          Load Sample CV
        </Button>
      </div>

      {/* Drag & Drop Upload Zone */}
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
          accept=".pdf,.docx,.doc,.txt"
          className="hidden"
        />
        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
          <Upload className="w-6 h-6" />
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-slate-900">Click to upload or drag and drop</p>
          <p className="text-xs text-slate-400 mt-1">
            TXT files load directly · For PDF/DOCX, open the file and paste the text below
          </p>
        </div>
      </div>

      {/* File notice */}
      {fileNotice && (
        <div className={`flex gap-3 items-start p-4 rounded-xl border text-sm ${
          fileNotice.type === "error"
            ? "bg-red-50 border-red-100 text-red-800"
            : "bg-blue-50 border-blue-100 text-blue-800"
        }`}>
          {fileNotice.type === "error"
            ? <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-red-500" />
            : <FileText className="w-4 h-4 mt-0.5 shrink-0 text-blue-500" />
          }
          <p className="leading-relaxed">{fileNotice.message}</p>
        </div>
      )}

      <div className="relative flex py-2 items-center">
        <div className="flex-grow border-t border-slate-100"></div>
        <span className="flex-shrink mx-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Or paste CV text</span>
        <div className="flex-grow border-t border-slate-100"></div>
      </div>

      {/* Text area */}
      <div className="space-y-2">
        <Textarea
          value={cvText}
          onChange={(e) => setCvText(e.target.value)}
          placeholder="Paste your CV content here... Include your name, contact details, work history, education, and skills."
          rows={14}
          className="font-sans leading-relaxed text-sm focus:ring-blue-500/10 focus:border-blue-500"
        />
        {cvText && (
          <p className="text-xs text-slate-400 text-right">
            {cvText.trim().split(/\s+/).length} words · <button className="text-red-400 hover:text-red-600 transition-colors" onClick={() => { setCvText(""); setFileNotice(null); }}>Clear</button>
          </p>
        )}
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
