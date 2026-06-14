import { CVData, TemplateStyle } from "@/lib/types";
import { ClassicATS } from "../templates/ClassicATS";
import { ModernProfessional } from "../templates/ModernProfessional";
import { TechMinimal } from "../templates/TechMinimal";
import { HealthcareNHS } from "../templates/HealthcareNHS";
import { Graduate } from "../templates/Graduate";

export interface CVPreviewProps {
  data: CVData;
  templateStyle: TemplateStyle;
  printRef?: React.RefObject<HTMLDivElement | null>;
}

import React from "react";

export function CVPreview({ data, templateStyle, printRef }: CVPreviewProps) {
  const renderTemplate = () => {
    switch (templateStyle) {
      case "classic":    return <ClassicATS data={data} />;
      case "modern":     return <ModernProfessional data={data} />;
      case "tech":       return <TechMinimal data={data} />;
      case "healthcare": return <HealthcareNHS data={data} />;
      case "graduate":   return <Graduate data={data} />;
      default:           return <ClassicATS data={data} />;
    }
  };

  return (
    <div
      ref={printRef}
      className="bg-white shadow-lg rounded-xl overflow-hidden border border-slate-100 print:shadow-none print:rounded-none print:border-none"
    >
      {renderTemplate()}
    </div>
  );
}
