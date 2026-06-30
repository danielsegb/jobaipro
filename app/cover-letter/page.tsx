"use client";

import * as React from "react";
import { useRef } from "react";
import { Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CVInputForm } from "@/components/optimise/CVInputForm";
import { JobDescriptionForm } from "@/components/optimise/JobDescriptionForm";
import { CoverLetterEditor } from "@/components/editor/CoverLetterEditor";
import { CoverLetterPreview } from "@/components/editor/CoverLetterPreview";
import { TemplateSelector } from "@/components/editor/TemplateSelector";
import { DownloadButtons } from "@/components/editor/DownloadButtons";
import { LoadingState } from "@/components/ui/LoadingState";
import { ErrorMessage } from "@/components/ui/ErrorMessage";

import { CoverLetterData, TemplateStyle } from "@/lib/types";
import { emptyCoverLetterData, emptyCVData } from "@/lib/sampleData";
import { parseRawCVText } from "@/lib/cvParser";

type Step = 1 | 2 | 3;

export default function CoverLetterPage() {
  const [step, setStep] = React.useState<Step>(1);

  // Raw inputs
  const [cvText, setCvText] = React.useState("");
  const [jobTitle, setJobTitle] = React.useState("");
  const [companyName, setCompanyName] = React.useState("");
  const [industry, setIndustry] = React.useState("");
  const [jobDescription, setJobDescription] = React.useState("");

  // Cover Letter state
  const [coverLetterData, setCoverLetterData] = React.useState<CoverLetterData>(emptyCoverLetterData);
  const [candidateName, setCandidateName] = React.useState("");
  const [isGeneratingCL, setIsGeneratingCL] = React.useState(false);
  const [generationError, setGenerationError] = React.useState("");

  // Editor state
  const [templateStyle, setTemplateStyle] = React.useState<TemplateStyle>("classic");
  const [draftSaved, setDraftSaved] = React.useState(false);

  const clPrintRef = useRef<HTMLDivElement>(null);
  const cvPrintRef = useRef<HTMLDivElement>(null);

  // Check for transferred state
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const transCv = localStorage.getItem("jobaipro_transfer_cvText");
      const transJd = localStorage.getItem("jobaipro_transfer_jobDescription");
      const transTitle = localStorage.getItem("jobaipro_transfer_jobTitle");
      const transCompany = localStorage.getItem("jobaipro_transfer_companyName");
      const transIndustry = localStorage.getItem("jobaipro_transfer_industry");

      if (transCv) setCvText(transCv);
      if (transJd) setJobDescription(transJd);
      if (transTitle) setJobTitle(transTitle);
      if (transCompany) setCompanyName(transCompany);
      if (transIndustry) setIndustry(transIndustry);
    }
  }, []);

  // Save state for transfers
  const saveTransferState = (cv: string, jd: string, jt: string, comp: string, ind: string) => {
    try {
      localStorage.setItem("jobaipro_transfer_cvText", cv);
      localStorage.setItem("jobaipro_transfer_jobDescription", jd);
      localStorage.setItem("jobaipro_transfer_jobTitle", jt);
      localStorage.setItem("jobaipro_transfer_companyName", comp);
      localStorage.setItem("jobaipro_transfer_industry", ind);
    } catch (e) {
      console.error("Failed to save transfer state:", e);
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
          companyName: companyName,
          jobTitle: jobTitle,
        }));
        
        // Extract name
        const parsed = parseRawCVText(cvText);
        setCandidateName(parsed.fullName || "Applicant");

        // Save transfer state
        saveTransferState(cvText, jobDescription, jobTitle, companyName, industry);
        setStep(3);
      }
    } catch (err) {
      setGenerationError("Cover letter generation failed. Please try again.");
      console.error(err);
    } finally {
      setIsGeneratingCL(false);
    }
  };

  const handleSaveDraft = () => {
    try {
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
            <div className="flex items-center gap-6">
              <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Cover Letter Generator</span>
              <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto">
                <button
                  onClick={() => setStep(1)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                    step === 1 ? "bg-blue-600 text-white" : "text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  1. Upload CV
                </button>
                <div className="h-px w-4 bg-slate-200" />
                <button
                  onClick={() => {
                    if (cvText.trim()) setStep(2);
                  }}
                  disabled={!cvText.trim()}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                    step === 2 ? "bg-blue-600 text-white" : step > 2 ? "text-blue-600 hover:bg-blue-50" : "text-slate-300 cursor-not-allowed"
                  }`}
                >
                  2. Target Job (Required)
                </button>
                <div className="h-px w-4 bg-slate-200" />
                <button
                  disabled={step < 3}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                    step === 3 ? "bg-blue-600 text-white" : "text-slate-300 cursor-not-allowed"
                  }`}
                >
                  3. Edit & Download
                </button>
              </nav>
            </div>
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
                title="Cover Letter Generator"
                description="Upload your CV to provide background context for your cover letter."
                buttonText="Next: Add Target Job"
                onNext={() => setStep(2)}
              />
            </div>
          )}

          {/* Step 2: Required Job Description */}
          {step === 2 && (
            <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
              {generationError && (
                <div className="mb-6">
                  <ErrorMessage message={generationError} onRetry={handleGenerateCoverLetter} />
                </div>
              )}
              
              <div className="mb-6 border-b border-slate-100 pb-4">
                <h3 className="text-lg font-bold text-slate-900">Target Job Details</h3>
                <p className="text-sm text-slate-500 mt-1">
                  Provide details about the target job so we can generate a matching cover letter.
                </p>
              </div>

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
                onSubmit={handleGenerateCoverLetter}
                isLoading={isGeneratingCL}
              />

              {isGeneratingCL && (
                <div className="mt-6">
                  <LoadingState type="cv" message="AI is generating your tailored cover letter..." />
                </div>
              )}
            </div>
          )}

          {/* Step 3: Editor & Download */}
          {step === 3 && (
            <div className="space-y-6">
              {/* Optional hand-off */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4.5 bg-blue-50 border border-blue-100 rounded-2xl text-sm text-blue-900 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-600 shrink-0">
                    <Sparkles className="w-4.5 h-4.5 fill-current" />
                  </div>
                  <div>
                    <p className="font-bold">Want to optimize your CV for this job?</p>
                    <p className="text-xs text-blue-600/80 mt-0.5">We can align your resume's style and keywords exactly to this target description.</p>
                  </div>
                </div>
                <Link href="/cv-optimiser" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all cursor-pointer">
                    Optimize My CV
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>

              {/* Template selector */}
              <TemplateSelector selectedStyle={templateStyle} onChange={setTemplateStyle} />

              {/* Download buttons */}
              <DownloadButtons
                cvData={emptyCVData}
                coverLetterData={coverLetterData}
                cvRef={cvPrintRef}
                clRef={clPrintRef}
                hasCL={true}
                onSaveDraft={handleSaveDraft}
                draftSaved={draftSaved}
              />

              {generationError && <ErrorMessage message={generationError} />}

              {/* Side-by-side Editor + Preview */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Left: Editor */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wider">Edit Cover Letter</h3>
                  <CoverLetterEditor
                    data={coverLetterData}
                    onChange={setCoverLetterData}
                    onRewrite={handleGenerateCoverLetter}
                    isRewriting={isGeneratingCL}
                  />
                </div>

                {/* Right: Preview */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wider">Live Preview</h3>
                  <CoverLetterPreview
                    data={coverLetterData}
                    candidateName={candidateName}
                  />
                </div>
              </div>

              {/* Off-screen targets for PDF generation */}
              <div className="fixed top-0 left-0 -z-50 opacity-0 pointer-events-none">
                <div className="w-[210mm] bg-white">
                  <CoverLetterPreview
                    data={coverLetterData}
                    printRef={clPrintRef}
                    candidateName={candidateName}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
