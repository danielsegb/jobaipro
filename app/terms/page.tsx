"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FileText, UserCheck, Scale, AlertTriangle, ShieldCheck } from "lucide-react";

export default function TermsOfServicePage() {
  const lastUpdated = "17 June 2026";

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center space-y-4 mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-100">
              <FileText className="w-3.5 h-3.5" />
              Terms and Conditions of Use
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              Terms of Service
            </h1>
            <p className="text-sm text-slate-500">
              Last Updated: {lastUpdated}
            </p>
          </div>

          {/* Content Card */}
          <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-8 sm:p-10 space-y-8 text-slate-600 leading-relaxed font-sans">
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Scale className="w-5 h-5 text-blue-500" />
                1. Acceptance of Terms
              </h2>
              <p>
                By accessing or using the Job AI Pro website ("Service"), you agree to be bound by these Terms of Service. If you do not agree to all of these terms, please do not use or access the Service.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-blue-500" />
                2. Acceptable Use & Content Ownership
              </h2>
              <p>
                You retain all intellectual property rights in the original CVs, resumes, and text files you upload or paste into the Service. You grant us the license to process this text in real-time through our AI frameworks to generate recommendations and document edits.
              </p>
              <p>
                You agree not to upload or paste any content that:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Contains malware, scripts, or other destructive computer code.</li>
                <li>Infringes on the intellectual property, copyright, or privacy rights of any third party.</li>
                <li>Is fraudulent, deceptive, or deliberately misleading regarding your qualifications.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-blue-500" />
                3. AI Services & Limitation of Liability
              </h2>
              <p>
                The Service leverages advanced language models, specifically the Google Gemini API, to help optimize resumes, check keyword match rates, and write cover letters.
              </p>
              <p>
                Please acknowledge the following regarding AI-generated content:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong className="text-slate-800">Recommendations Only:</strong> The generated content, feedback suggestions, and ATS score matching estimates are recommendations. You are solely responsible for reviewing the accuracy, tone, and correctness of any files before sending them to employers.
                </li>
                <li>
                  <strong className="text-slate-800">No Employment Guarantees:</strong> Job AI Pro does not guarantee employment offers, interview callbacks, or success in passing automated applicant tracking systems.
                </li>
                <li>
                  <strong className="text-slate-800">API Availability:</strong> Since the Service integrates with Google Gemini APIs, we are not responsible for any temporary service interruptions, API delays, or failures arising from upstream providers.
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-500" />
                4. Local Storage & Draft Management
              </h2>
              <p>
                We offer the ability to save draft versions of your CVs and cover letters. These are saved strictly in your local browser’s cache memory (<code className="text-xs bg-slate-50 border border-slate-100 px-1 py-0.5 rounded font-mono">localStorage</code>). Clearing your browser data or switching browsers will reset these drafts. Job AI Pro is not liable for data loss associated with local cache clearing.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-500" />
                5. Changes to Terms
              </h2>
              <p>
                We reserve the right to revise or replace these Terms of Service at any time. Modified terms will be published directly on this page. By continuing to access our website after updates are posted, you agree to be bound by the revised terms.
              </p>
            </section>

            <div className="pt-6 border-t border-slate-100 text-sm text-slate-400 text-center">
              Thank you for choosing Job AI Pro. We wish you the best of luck in your job search!
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
