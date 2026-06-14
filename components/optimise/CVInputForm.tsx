import * as React from "react";
import { Upload, AlertCircle, FileText } from "lucide-react";
import { Button } from "../ui/Button";
import { Textarea } from "../ui/Textarea";

export interface CVInputFormProps {
  cvText: string;
  setCvText: (text: string) => void;
  onNext: () => void;
}

const SAMPLE_CV_TEXT = ``;


export function CVInputForm({ cvText, setCvText, onNext }: CVInputFormProps) {
  const [dragActive, setDragActive] = React.useState(false);
  const [fileNotice, setFileNotice] = React.useState<{ type: "info" | "error"; message: string } | null>(null);
  const [isParsing, setIsParsing] = React.useState(false);
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

  const processFile = async (file: File) => {
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
      setIsParsing(true);
      setFileNotice({ type: "info", message: `Parsing "${file.name}"... Please wait.` });
      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/parse-document", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Failed to parse document");
        }

        const data = await response.json();
        
        if (data.text && data.text.trim()) {
          setCvText(data.text);
          setFileNotice({ type: "info", message: `✓ "${file.name}" loaded successfully. Review and edit below if needed.` });
        } else {
          throw new Error("Empty document");
        }
      } catch (error) {
        console.error(error);
        setFileNotice({
          type: "error",
          message: `Could not extract text automatically from "${file.name}". Please open the document, copy all text, and paste it into the text area below.`,
        });
      } finally {
        setIsParsing(false);
      }
    } else {
      setFileNotice({ type: "error", message: "Unsupported file type. Please upload a .pdf, .docx, or .txt file, or paste your CV text directly below." });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Step 1: Upload or paste your CV</h2>
        <p className="text-sm text-slate-500 mt-1">Provide the current version of your CV to establish your background.</p>
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
          disabled={isParsing}
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
          disabled={isParsing}
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
          disabled={!cvText.trim() || isParsing}
          onClick={onNext}
          className="px-8"
        >
          Next: Target Job
        </Button>
      </div>
    </div>
  );
}
