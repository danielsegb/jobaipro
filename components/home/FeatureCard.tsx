import * as React from "react";
import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "../ui/Card";

export interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  iconBgColor?: string;
  iconColor?: string;
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  iconBgColor = "bg-blue-50",
  iconColor = "text-blue-600",
}: FeatureCardProps) {
  return (
    <Card className="border border-slate-100 hover:border-slate-200/80 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      <CardContent className="p-6 sm:p-8 flex flex-col items-start gap-4">
        {/* Icon wrapper */}
        <div className={`w-12 h-12 rounded-xl ${iconBgColor} flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>

        {/* Text details */}
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-slate-900">{title}</h3>
          <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
