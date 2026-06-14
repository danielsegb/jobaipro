"use client";

import * as React from "react";
import { useRef } from "react";
import { CheckCircle2, Sparkles } from "lucide-react";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CVInputForm } from "@/components/optimise/CVInputForm";
import { JobDescriptionForm } from "@/components/optimise/JobDescriptionForm";
import { AnalysisResults } from "@/components/optimise/AnalysisResults";
import { CVEditor } from "@/components/editor/CVEditor";
import { CoverLetterEditor } from "@/components/editor/CoverLetterEditor";
import { CVPreview } from "@/components/editor/CVPreview";
import { CoverLetterPreview } from "@/components/editor/CoverLetterPreview";
import { TemplateSelector } from "@/components/editor/TemplateSelector";
import { DownloadButtons } from "@/components/editor/DownloadButtons";
import { LoadingState } from "@/components/ui/LoadingState";
import { ErrorMessage } from "@/components/ui/ErrorMessage";

import {
  AnalysisResult,
  CVData,
  CoverLetterData,
  TemplateStyle,
} from "@/lib/types";
import { sampleCVData } from "@/lib/sampleData";
import { parseRawCVText } from "@/lib/cvParser";

type Step = 1 | 2 | 3 | 4;

const STEPS = [
  { num: 1, label: "Upload CV" },
  { num: 2, label: "Job Description" },
  { num: 3, label: "Analysis" },
  { num: 4, label: "Edit & Download" },
];

export default function OptimisePage() {
  // Step navigation
  const [step, setStep] = React.useState<Step>(1);

  // Raw inputs
  const [cvText, setCvText] = React.useState("");
  const [jobTitle, setJobTitle] = React.useState("");
  const [companyName, setCompanyName] = React.useState("");
  const [industry, setIndustry] = React.useState("");
  const [jobDescription, setJobDescription] = React.useState("");

  // Analysis state
  const [analysis, setAnalysis] = React.useState<AnalysisResult | null>(null);
  const [isAnalysing, setIsAnalysing] = React.useState(false);
  const [analysisError, setAnalysisError] = React.useState("");

  // Generated documents state
  const [cvData, setCvData] = React.useState<CVData>(sampleCVData);
  const [coverLetterData, setCoverLetterData] = React.useState<CoverLetterData>({
    recipient: "Hiring Manager",
    companyName: "",
    jobTitle: "",
    content: "",
    tone: "professional",
  });
  const [isGeneratingCV, setIsGeneratingCV] = React.useState(false);
  const [isGeneratingCL, setIsGeneratingCL] = React.useState(false);
  const [isRewritingSection, setIsRewritingSection] = React.useState(false);
  const [generationError, setGenerationError] = React.useState("");

  // Editor state
  const [templateStyle, setTemplateStyle] = React.useState<TemplateStyle>("classic");
  const [activeEditorTab, setActiveEditorTab] = React.useState<"cv" | "cover-letter">("cv");
  const [draftSaved, setDraftSaved] = React.useState(false);

  // Print refs
  const cvPrintRef = useRef<HTMLDivElement>(null);
  const clPrintRef = useRef<HTMLDivElement>(null);

  // Step 2 → 3: Analyse CV
  const handleAnalyse = async () => {
    setIsAnalysing(true);
    setAnalysisError("");
    try {
      const res = await fetch("/api/analyse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvText, jobDescription, jobTitle, companyName, industry }),
      });
      if (!res.ok) throw new Error("Analysis request failed.");
      const json = await res.json();
      setAnalysis(json.analysis);
      setStep(3);
    } catch (err) {
      setAnalysisError("CV analysis failed. Please check your inputs and try again.");
      console.error(err);
    } finally {
      setIsAnalysing(false);
    }
  };

  // Step 3 → 4: Optimise CV
  const handleOptimiseCV = async () => {
    setIsGeneratingCV(true);
    setGenerationError("");
    try {
      const res = await fetch("/api/generate-cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvText, jobDescription, jobTitle, companyName, industry }),
      });
      if (!res.ok) throw new Error("CV optimisation failed.");
      const json = await res.json();
      if (json.optimisedCV) {
        // If it's a string, parse it; if it's already an object use directly
        const optimised = typeof json.optimisedCV === "string"
          ? parseRawCVText(json.optimisedCV)
          : json.optimisedCV;
        setCvData(optimised);
      }
      setStep(4);
    } catch (err) {
      setGenerationError("CV optimisation failed. Please try again.");
      console.error(err);
    } finally {
      setIsGeneratingCV(false);
    }
  };

  // Generate Cover Letter
  const handleGenerateCoverLetter = async () => {
    setIsGeneratingCL(true);
    setGenerationError("");
    try {
      const res = await fetch("/api/generate-cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvText, jobDescription, jobTitle, companyName, tone: coverLetterData.tone }),
      });
      if (!res.ok) throw new Error("Cover letter generation failed.");
      const json = await res.json();
      if (json.coverLetter) {
        setCoverLetterData(prev => ({
          ...prev,
          content: json.coverLetter,
          // Always overwrite with the user's actual inputs from Step 2
          companyName: companyName,
          jobTitle: jobTitle,
        }));
        // Switch to cover letter tab if not already
        setActiveEditorTab("cover-letter");
        if (step < 4) setStep(4);
      }
    } catch (err) {
      setGenerationError("Cover letter generation failed. Please try again.");
      console.error(err);
    } finally {
      setIsGeneratingCL(false);
    }
  };

  // Rewrite a CV section
  const handleRewriteSection = async (sectionText: string, sectionType: string): Promise<string> => {
    setIsRewritingSection(true);
    try {
      const res = await fetch("/api/rewrite-section", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sectionText, sectionType, jobDescription }),
      });
      if (!res.ok) throw new Error("Section rewrite failed.");
      const json = await res.json();
      return json.rewrittenSection || sectionText;
    } catch {
      return sectionText;
    } finally {
      setIsRewritingSection(false);
    }
  };

  const handleSaveDraft = () => {
    try {
      localStorage.setItem("jobaipro_cv_draft", JSON.stringify(cvData));
      localStorage.setItem("jobaipro_cl_draft", JSON.stringify(coverLetterData));
      setDraftSaved(true);
      setTimeout(() => setDraftSaved(false), 3000);
    } catch {
      console.error("Failed to save draft to localStorage.");
    }
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        {/* Step Header */}
        <div className="bg-white border-b border-slate-100 sticky top-16 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-1">
              {STEPS.map((s, idx) => {
                const isCompleted = step > s.num;
                const isCurrent = step === s.num;
                return (
                  <React.Fragment key={s.num}>
                    <button
                      onClick={() => {
                        if (isCompleted) setStep(s.num as Step);
                      }}
                      disabled={s.num > step}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                        isCurrent
                          ? "bg-blue-600 text-white shadow-sm shadow-blue-600/20"
                          : isCompleted
                          ? "text-blue-600 hover:bg-blue-50 cursor-pointer"
                          : "text-slate-300 cursor-not-allowed"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                      ) : (
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border-2 shrink-0 ${isCurrent ? "border-white text-white" : "border-slate-200 text-slate-300"}`}>
                          {s.num}
                        </span>
                      )}
                      {s.label}
                    </button>
                    {idx < STEPS.length - 1 && (
                      <div className={`h-px w-4 sm:w-6 shrink-0 ${step > s.num ? "bg-blue-200" : "bg-slate-100"}`} />
                    )}
                  </React.Fragment>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

          {/* Step 1: CV Input */}
          {step === 1 && (
            <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
              <CVInputForm
                cvText={cvText}
                setCvText={setCvText}
                onNext={() => setStep(2)}
              />
            </div>
          )}

          {/* Step 2: Job Description */}
          {step === 2 && (
            <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
              {analysisError && (
                <div className="mb-6">
                  <ErrorMessage message={analysisError} onRetry={handleAnalyse} />
                </div>
              )}
              <JobDescriptionForm
                jobTitle={jobTitle}
                setJobTitle={setJobTitle}
                companyName={companyName}
                setCompanyName={setCompanyName}
                industry={industry}
                setIndustry={setIndustry}
                description={jobDescription}
                setDescription={setJobDescription}
                onBack={() => setStep(1)}
                onSubmit={handleAnalyse}
                isLoading={isAnalysing}
              />
              {isAnalysing && (
                <div className="mt-6">
                  <LoadingState type="cv" message="Analysing your CV against the job description" />
                </div>
              )}
            </div>
          )}

          {/* Step 3: Analysis Results */}
          {step === 3 && analysis && (
            <div className="space-y-6">
              {generationError && (
                <ErrorMessage message={generationError} onRetry={isGeneratingCV ? handleOptimiseCV : handleGenerateCoverLetter} />
              )}
              {(isGeneratingCV || isGeneratingCL) && (
                <LoadingState type="cv" message={isGeneratingCV ? "AI is optimising your CV" : "AI is writing your cover letter"} />
              )}
              {!isGeneratingCV && !isGeneratingCL && (
                <AnalysisResults
                  analysis={analysis}
                  onOptimiseCV={handleOptimiseCV}
                  onGenerateCoverLetter={handleGenerateCoverLetter}
                  isGeneratingCV={isGeneratingCV}
                  isGeneratingCL={isGeneratingCL}
                />
              )}
            </div>
          )}

          {/* Step 4: Editor & Preview */}
          {step === 4 && (
            <div className="space-y-6">
              {/* AI badge */}
              <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-100 px-4 py-2.5 rounded-xl w-fit">
                <Sparkles className="w-4 h-4 fill-current" />
                Your AI-tailored documents are ready to edit and download.
              </div>

              {/* Template selector */}
              <TemplateSelector selectedStyle={templateStyle} onChange={setTemplateStyle} />

              {/* Download buttons */}
              <DownloadButtons
                cvData={cvData}
                coverLetterData={coverLetterData.content ? coverLetterData : undefined}
                cvRef={cvPrintRef}
                clRef={clPrintRef}
                hasCL={!!coverLetterData.content}
                onSaveDraft={handleSaveDraft}
                draftSaved={draftSaved}
              />

              {generationError && <ErrorMessage message={generationError} />}

              {/* Tab switcher */}
              <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
                <button
                  onClick={() => setActiveEditorTab("cv")}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeEditorTab === "cv" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                >
                  CV
                </button>
                <button
                  onClick={() => {
                    setActiveEditorTab("cover-letter");
                    if (!coverLetterData.content) handleGenerateCoverLetter();
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeEditorTab === "cover-letter" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                >
                  Cover Letter
                  {!coverLetterData.content && (
                    <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700">
                      Generate
                    </span>
                  )}
                </button>
              </div>

              {/* Side-by-side Editor + Preview */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Left: Editor */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wider">
                    {activeEditorTab === "cv" ? "Edit CV" : "Edit Cover Letter"}
                  </h3>

                  {activeEditorTab === "cv" && (
                    <CVEditor
                      data={cvData}
                      onChange={setCvData}
                      jobDescription={jobDescription}
                      onRewriteSection={handleRewriteSection}
                      isRewriting={isRewritingSection}
                    />
                  )}

                  {activeEditorTab === "cover-letter" && (
                    <>
                      {isGeneratingCL ? (
                        <LoadingState type="cv" message="AI is writing your cover letter" />
                      ) : (
                        <CoverLetterEditor
                          data={coverLetterData}
                          onChange={setCoverLetterData}
                          onRewrite={handleGenerateCoverLetter}
                          isRewriting={isGeneratingCL}
                        />
                      )}
                    </>
                  )}
                </div>

                {/* Right: Preview */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wider">Live Preview</h3>

                  {activeEditorTab === "cv" && (
                    <CVPreview data={cvData} templateStyle={templateStyle} printRef={cvPrintRef} />
                  )}

                  {activeEditorTab === "cover-letter" && (
                    <CoverLetterPreview
                      data={coverLetterData}
                      printRef={clPrintRef}
                      candidateName={cvData.fullName}
                    />
                  )}
                </div>
              </div>

              {/* Hidden print targets */}
              <div className="hidden print:block">
                <CVPreview data={cvData} templateStyle={templateStyle} printRef={cvPrintRef} />
              </div>
              <div className="hidden print:block">
                <CoverLetterPreview
                  data={coverLetterData}
                  printRef={clPrintRef}
                  candidateName={cvData.fullName}
                />
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
