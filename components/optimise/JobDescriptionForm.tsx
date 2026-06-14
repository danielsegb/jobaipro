import * as React from "react";
import { Clipboard, ArrowLeft } from "lucide-react";
import { Button } from "../ui/Button";
import { Textarea } from "../ui/Textarea";
import { Input } from "../ui/Input";
import { sampleJobDescription } from "@/lib/sampleData";

export interface JobDescriptionFormProps {
  jobTitle: string;
  setJobTitle: (val: string) => void;
  companyName: string;
  setCompanyName: (val: string) => void;
  industry: string;
  setIndustry: (val: string) => void;
  description: string;
  setDescription: (val: string) => void;
  onBack: () => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export function JobDescriptionForm({
  jobTitle,
  setJobTitle,
  companyName,
  setCompanyName,
  industry,
  setIndustry,
  description,
  setDescription,
  onBack,
  onSubmit,
  isLoading
}: JobDescriptionFormProps) {



  return (
    <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Step 2: Target Job Details</h2>
          <p className="text-sm text-slate-500 mt-1">Provide the details of the job you are targeting for optimal matching.</p>
        </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Target Job Title</label>
          <Input
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="e.g. Frontend Engineering Manager"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Company Name</label>
          <Input
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="e.g. FinTech Global"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Industry (Optional)</label>
          <Input
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            placeholder="e.g. Finance / Tech"
          />
        </div>
      </div>

      {/* Description Textarea */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Job Description</label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Paste the complete job description text here, including requirements, responsibilities, and qualifications..."
          rows={10}
          className="font-sans leading-relaxed text-sm focus:ring-blue-500/10 focus:border-blue-500"
        />
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center pt-4">
        <Button variant="outline" onClick={onBack} disabled={isLoading}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button
          disabled={!description.trim() || isLoading}
          onClick={onSubmit}
          isLoading={isLoading}
          className="px-8"
        >
          Analyse My CV
        </Button>
      </div>
    </div>
  );
}
