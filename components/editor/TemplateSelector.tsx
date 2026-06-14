import { TemplateStyle } from "@/lib/types";
import { Check } from "lucide-react";

export interface TemplateSelectorProps {
  selectedStyle: TemplateStyle;
  onChange: (style: TemplateStyle) => void;
}

export function TemplateSelector({ selectedStyle, onChange }: TemplateSelectorProps) {
  const templates: { id: TemplateStyle; name: string; desc: string }[] = [
    { id: "classic", name: "Classic ATS", desc: "Single column, clean, simple layout. Recommended for traditional roles." },
    { id: "modern", name: "Modern Pro", desc: "Visual header with balanced columns. Recommended for management/sales." },
    { id: "tech", name: "Tech Minimal", desc: "Technical font with highlighted skills tags. Ideal for software/IT." },
    { id: "healthcare", name: "Healthcare / NHS", desc: "Emphasizes profile and clinical/care skills. Best for care roles." },
    { id: "graduate", name: "Graduate", desc: "Puts education and projects at the top. Perfect for recent students." },
  ];

  return (
    <div className="bg-white border border-slate-100 p-4 rounded-xl space-y-3 shadow-sm">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold text-slate-800">Select CV Style</h4>
        <span className="text-xs text-slate-400 font-medium">Instantly updates preview</span>
      </div>
      
      {/* Scrollable list or grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5">
        {templates.map((temp) => {
          const isActive = selectedStyle === temp.id;
          return (
            <button
              key={temp.id}
              onClick={() => onChange(temp.id)}
              className={`flex flex-col items-start text-left p-3 rounded-lg border text-xs transition-all duration-200 cursor-pointer focus:outline-none ${
                isActive
                  ? "border-blue-600 bg-blue-50/20 ring-2 ring-blue-500/15"
                  : "border-slate-100 bg-slate-50/30 hover:border-slate-200 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center justify-between w-full font-bold">
                <span className={isActive ? "text-blue-700" : "text-slate-700"}>{temp.name}</span>
                {isActive && <Check className="w-3.5 h-3.5 text-blue-600 stroke-[3]" />}
              </div>
              <span className="text-[10px] text-slate-400 mt-1 leading-normal line-clamp-2">
                {temp.desc}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
