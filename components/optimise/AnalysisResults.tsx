import { AnalysisResult } from "@/lib/types";
import { Check, X, Sparkles, HelpCircle, FileCheck, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/Card";
import { Button } from "../ui/Button";

export interface AnalysisResultsProps {
  analysis: AnalysisResult;
  onOptimiseCV: () => void;
  onGenerateCoverLetter: () => void;
  isGeneratingCV: boolean;
  isGeneratingCL: boolean;
}

export function AnalysisResults({
  analysis,
  onOptimiseCV,
  onGenerateCoverLetter,
  isGeneratingCV,
  isGeneratingCL
}: AnalysisResultsProps) {
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-600 border-emerald-100 bg-emerald-50";
    if (score >= 60) return "text-amber-600 border-amber-100 bg-amber-50";
    return "text-rose-600 border-rose-100 bg-rose-50";
  };

  const getScoreRingColor = (score: number) => {
    if (score >= 80) return "stroke-emerald-500";
    if (score >= 60) return "stroke-amber-500";
    return "stroke-rose-500";
  };

  const scores = [
    { label: "Overall Match", value: analysis.overallScore },
    { label: "Keyword Match", value: analysis.keywordScore },
    { label: "Content Strength", value: analysis.contentStrengthScore },
    { label: "ATS Readiness", value: analysis.atsReadinessScore },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Visual Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900">Step 3: ATS & Keyword Match Analysis</h2>
        <p className="text-sm text-slate-500 mt-1">Review how well your CV aligns with the target job description.</p>
      </div>

      {/* Dials / Scores Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {scores.map((score, idx) => {
          // Circular SVG parameters
          const radius = 36;
          const strokeWidth = 6;
          const circumference = 2 * Math.PI * radius;
          const offset = circumference - (score.value / 100) * circumference;
          
          return (
            <Card key={idx} className="border border-slate-100">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center gap-3">
                <span className="text-sm font-semibold text-slate-500">{score.label}</span>
                
                {/* SVG Progress Ring */}
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    {/* Background Circle */}
                    <circle
                      cx="48"
                      cy="48"
                      r={radius}
                      className="stroke-slate-100 fill-none"
                      strokeWidth={strokeWidth}
                    />
                    {/* Progress Circle */}
                    <circle
                      cx="48"
                      cy="48"
                      r={radius}
                      className={`fill-none transition-all duration-1000 ${getScoreRingColor(score.value)}`}
                      strokeWidth={strokeWidth}
                      strokeDasharray={circumference}
                      strokeDashoffset={offset}
                      strokeLinecap="round"
                    />
                  </svg>
                  {/* Inside Text */}
                  <span className="absolute text-2xl font-extrabold text-slate-800">{score.value}%</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Keywords Comparison Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Matched Keywords */}
        <Card className="border border-slate-100">
          <CardHeader className="bg-slate-50/40 p-5">
            <CardTitle className="text-sm font-bold flex items-center gap-2 text-emerald-700">
              <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              Matched Keywords ({analysis.matchedKeywords.length})
            </CardTitle>
            <CardDescription className="text-xs">Keywords found in both the CV and job requirements.</CardDescription>
          </CardHeader>
          <CardContent className="p-5">
            {analysis.matchedKeywords.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {analysis.matchedKeywords.map((kw, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-100/50"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400 italic">No matching keywords found.</p>
            )}
          </CardContent>
        </Card>

        {/* Missing Keywords */}
        <Card className="border border-slate-100">
          <CardHeader className="bg-slate-50/40 p-5">
            <CardTitle className="text-sm font-bold flex items-center gap-2 text-rose-700">
              <div className="w-5 h-5 rounded-full bg-rose-100 flex items-center justify-center text-rose-800">
                <X className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              Missing Keywords ({analysis.missingKeywords.length})
            </CardTitle>
            <CardDescription className="text-xs">Important skills or terms requested in the JD but missing from your CV.</CardDescription>
          </CardHeader>
          <CardContent className="p-5">
            {analysis.missingKeywords.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {analysis.missingKeywords.map((kw, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center px-2.5 py-1 rounded-md bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-100/50"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-emerald-600 font-medium">Excellent! No major missing keywords.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Suggested Skills Section */}
      {analysis.suggestedSkills && analysis.suggestedSkills.length > 0 && (
        <Card className="border border-slate-100">
          <CardHeader className="p-5">
            <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Sparkles className="w-4.5 h-4.5 text-blue-600 fill-current" />
              Recommended Skills to Highlight
            </CardTitle>
            <CardDescription className="text-xs">
              Recommendations to add to your skills list (verify you actually possess these before adding).
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <div className="flex flex-wrap gap-2">
              {analysis.suggestedSkills.map((sk, i) => (
                <span
                  key={i}
                  className="inline-flex items-center px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-100/50"
                >
                  {sk}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action / Suggestions Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Suggestions List */}
        <Card className="md:col-span-2 border border-slate-100 flex flex-col">
          <CardHeader className="p-5 border-b border-slate-50 bg-slate-50/20">
            <CardTitle className="text-base font-bold text-slate-900">
              Improvement Recommendations
            </CardTitle>
            <CardDescription className="text-xs">Follow these actionable steps to optimize your profile.</CardDescription>
          </CardHeader>
          <CardContent className="p-5 flex-grow">
            <ul className="space-y-3">
              {analysis.improvementSuggestions.map((sug, i) => (
                <li key={i} className="flex gap-3 items-start text-sm text-slate-600 leading-relaxed">
                  <span className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xs flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  {sug}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Weak Sections warning */}
        <Card className="border border-red-50/50 bg-amber-50/10 flex flex-col justify-between">
          <CardHeader className="p-5">
            <CardTitle className="text-base font-bold text-amber-800 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-amber-600" />
              Weak Areas Detected
            </CardTitle>
            <CardDescription className="text-xs text-amber-600/80">These sections do not match the job description well.</CardDescription>
          </CardHeader>
          <CardContent className="p-5 pt-0 flex-grow">
            <ul className="space-y-2.5">
              {analysis.weakSections.map((sec, i) => (
                <li key={i} className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-100/50 px-3 py-2 rounded-lg">
                  ⚠️ {sec}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Next Actions CTA */}
      <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center md:text-left">
          <h4 className="text-base font-bold text-slate-900 flex items-center justify-center md:justify-start gap-2">
            <FileCheck className="w-5 h-5 text-blue-600" />
            Ready to generate your documents?
          </h4>
          <p className="text-sm text-slate-500">
            Let our AI optimize your CV and generate a custom cover letter.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <Button
            onClick={onOptimiseCV}
            isLoading={isGeneratingCV}
            className="shadow-sm shadow-blue-600/10 flex-1 sm:flex-none"
          >
            Optimise My CV
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <Button
            variant="outline"
            onClick={onGenerateCoverLetter}
            isLoading={isGeneratingCL}
            className="flex-1 sm:flex-none"
          >
            Generate Cover Letter
          </Button>
        </div>
      </div>
    </div>
  );
}
