"use client";
import * as React from "react";
import { Wand2 } from "lucide-react";
import { CoverLetterData } from "@/lib/types";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";

export interface CoverLetterEditorProps {
  data: CoverLetterData;
  onChange: (data: CoverLetterData) => void;
  onRewrite?: () => void;
  isRewriting?: boolean;
}

export function CoverLetterEditor({ data, onChange, onRewrite, isRewriting }: CoverLetterEditorProps) {
  const update = (field: keyof CoverLetterData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Recipient Name</label>
          <Input
            value={data.recipient}
            onChange={e => update("recipient", e.target.value)}
            placeholder="Hiring Manager"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Company Name</label>
          <Input
            value={data.companyName}
            onChange={e => update("companyName", e.target.value)}
            placeholder="e.g. FinTech Hub Global"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Job Title</label>
          <Input
            value={data.jobTitle}
            onChange={e => update("jobTitle", e.target.value)}
            placeholder="e.g. Engineering Manager"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tone</label>
          <select
            value={data.tone}
            onChange={e => update("tone", e.target.value)}
            className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
          >
            <option value="professional">Professional</option>
            <option value="confident">Confident</option>
            <option value="enthusiastic">Enthusiastic</option>
            <option value="concise">Concise</option>
          </select>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Cover Letter Content</label>
          {onRewrite && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRewrite}
              isLoading={isRewriting}
              className="text-blue-600 border-blue-100 hover:bg-blue-50"
            >
              <Wand2 className="w-3.5 h-3.5 mr-1.5 text-blue-500" />
              Regenerate with Gemini
            </Button>
          )}
        </div>
        <Textarea
          value={data.content}
          onChange={e => update("content", e.target.value)}
          rows={18}
          placeholder="Your cover letter will appear here once generated..."
          className="text-sm font-sans leading-relaxed"
        />
        <p className="text-xs text-slate-400 text-right">
          {data.content.split(/\s+/).filter(Boolean).length} words
        </p>
      </div>
    </div>
  );
}
