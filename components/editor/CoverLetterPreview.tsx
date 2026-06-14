import React from "react";
import { CoverLetterData } from "@/lib/types";

export interface CoverLetterPreviewProps {
  data: CoverLetterData;
  printRef?: React.RefObject<HTMLDivElement | null>;
  candidateName?: string;
}

export function CoverLetterPreview({ data, printRef, candidateName }: CoverLetterPreviewProps) {
  const today = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div
      ref={printRef}
      className="bg-white shadow-lg rounded-xl border border-slate-100 print:shadow-none print:rounded-none print:border-none"
    >
      <div className="p-10 max-w-[800px] mx-auto font-sans text-[13.5px] leading-relaxed text-slate-800 print:p-8">
        {/* Date */}
        <p className="text-right text-slate-500 text-xs mb-8">{today}</p>

        {/* Recipient Header */}
        <div className="mb-6">
          <p className="font-bold text-slate-900">{data.recipient || "Hiring Manager"}</p>
          {data.companyName && <p className="text-slate-700">{data.companyName}</p>}
        </div>

        {/* Subject Line */}
        {data.jobTitle && (
          <p className="mb-6 font-semibold text-slate-900">
            Re: Application for {data.jobTitle}
          </p>
        )}

        {/* Letter Body */}
        <div className="space-y-4 text-justify">
          {data.content
            ? data.content.split("\n\n").filter(Boolean).map((para, idx) => (
                <p key={idx} className="leading-relaxed whitespace-pre-line">{para.trim()}</p>
              ))
            : (
              <p className="text-slate-400 italic">
                Your cover letter will appear here once generated. Use the editor panel to modify the content.
              </p>
            )
          }
        </div>
      </div>
    </div>
  );
}
