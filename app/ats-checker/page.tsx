"use client";

import * as React from "react";
import { Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CVInputForm } from "@/components/optimise/CVInputForm";
import { JobDescriptionForm } from "@/components/optimise/JobDescriptionForm";
import { AnalysisResults } from "@/components/optimise/AnalysisResults";
import { LoadingState } from "@/components/ui/LoadingState";
import { ErrorMessage } from "@/components/ui/ErrorMessage";

import { AnalysisResult } from "@/lib/types";

type Step = 1 | 2 | 3;

export default function ATSCheckerPage() {
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

  // Run ATS Analysis
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
      
      // Save transfer state
      saveTransferState(cvText, jobDescription, jobTitle, companyName, industry);
      setStep(3);
    } catch (err) {
      setAnalysisError("CV analysis failed. Please check your inputs and try again.");
      console.error(err);
    } finally {
      setIsAnalysing(false);
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
              <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">ATS Keyword Checker</span>
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
                  3. View Score Dashboard
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
                title="ATS Keyword Checker"
                description="Upload your CV to compare against your target job listing."
                buttonText="Next: Add Target Job"
                onNext={() => setStep(2)}
              />
            </div>
          )}

          {/* Step 2: Required Job Description */}
          {step === 2 && (
            <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
              {analysisError && (
                <div className="mb-6">
                  <ErrorMessage message={analysisError} onRetry={handleAnalyse} />
                </div>
              )}
              
              <div className="mb-6 border-b border-slate-100 pb-4">
                <h3 className="text-lg font-bold text-slate-900">Target Job Details</h3>
                <p className="text-sm text-slate-500 mt-1">
                  Provide details about the target job to check keywords and ATS score.
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
                onSubmit={handleAnalyse}
                isLoading={isAnalysing}
              />

              {isAnalysing && (
                <div className="mt-6">
                  <LoadingState type="cv" message="Running deep ATS analysis and keyword mapping..." />
                </div>
              )}
            </div>
          )}

          {/* Step 3: Analysis Results */}
          {step === 3 && analysis && (
            <div className="space-y-8">
              
              {/* Optional hand-offs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Hand-off 1: Optimise CV */}
                <div className="flex items-start justify-between gap-4 p-4.5 bg-blue-50 border border-blue-100 rounded-2xl text-sm text-blue-900 shadow-sm">
                  <div className="flex gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-600 shrink-0 mt-0.5">
                      <Sparkles className="w-4.5 h-4.5 fill-current" />
                    </div>
                    <div>
                      <p className="font-bold">Tailor My CV</p>
                      <p className="text-xs text-blue-600/80 mt-0.5">Optimize and align your resume keywords and achievements to this job with AI.</p>
                    </div>
                  </div>
                  <Link href="/cv-optimiser" className="shrink-0">
                    <button className="flex items-center justify-center p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm transition-all cursor-pointer">
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </Link>
                </div>

                {/* Hand-off 2: Cover Letter */}
                <div className="flex items-start justify-between gap-4 p-4.5 bg-indigo-50 border border-indigo-100 rounded-2xl text-sm text-indigo-900 shadow-sm">
                  <div className="flex gap-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-600/10 flex items-center justify-center text-indigo-600 shrink-0 mt-0.5">
                      <Sparkles className="w-4.5 h-4.5 fill-current" />
                    </div>
                    <div>
                      <p className="font-bold">Generate Cover Letter</p>
                      <p className="text-xs text-indigo-600/80 mt-0.5">Create a highly targeted cover letter mapping your qualifications to the role.</p>
                    </div>
                  </div>
                  <Link href="/cover-letter" className="shrink-0">
                    <button className="flex items-center justify-center p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm transition-all cursor-pointer">
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </Link>
                </div>
              </div>

              {/* Score Dashboard */}
              <AnalysisResults
                analysis={analysis}
                onOptimiseCV={() => {}}
                onGenerateCoverLetter={() => {}}
                isGeneratingCV={false}
                isGeneratingCL={false}
                hideActionButtons={true}
              />
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
