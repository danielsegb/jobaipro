"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ShieldCheck, Eye, Database, Globe, RefreshCw } from "lucide-react";

export default function PrivacyPolicyPage() {
  const lastUpdated = "17 June 2026";

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center space-y-4 mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-100">
              <ShieldCheck className="w-3.5 h-3.5" />
              Your privacy is our priority
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              Privacy Policy
            </h1>
            <p className="text-sm text-slate-500">
              Last Updated: {lastUpdated}
            </p>
          </div>

          {/* Content Card */}
          <div className="bg-white border border-slate-100 shadow-sm rounded-2xl p-8 sm:p-10 space-y-8 text-slate-600 leading-relaxed font-sans">
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Eye className="w-5 h-5 text-blue-500" />
                1. Overview
              </h2>
              <p>
                At Job AI Pro, we are committed to protecting your privacy. This Privacy Policy describes how we collect, use, and process your personal information when you use our website and AI-powered optimization services.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Database className="w-5 h-5 text-blue-500" />
                2. Information We Collect
              </h2>
              <p>
                We only collect information that is voluntarily provided by you to run the document optimization services:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong className="text-slate-800">CV / Resume Data:</strong> When you upload a document or paste resume text, we collect that text to extract your background information.
                </li>
                <li>
                  <strong className="text-slate-800">Job Specification Details:</strong> Target job titles, company name, industry, and job descriptions are collected to align your resume and cover letter with the role.
                </li>
                <li>
                  <strong className="text-slate-800">Tone Settings:</strong> Preferences such as professional, confident, or enthusiastic tones.
                </li>
                <li>
                  <strong className="text-slate-800">Local Drafts:</strong> Saved drafts of your edited CVs and cover letters are stored locally in your browser’s <code className="text-xs bg-slate-50 border border-slate-100 px-1 py-0.5 rounded font-mono">localStorage</code> for your convenience. We do not store these drafts on our servers.
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-blue-500" />
                3. How We Process Your Data & Use of APIs
              </h2>
              <p>
                To provide high-quality AI enhancements and ATS-check feedback, we use third-party intelligence services:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong className="text-slate-800">Google Gemini API:</strong> We utilize Google’s Gemini large language models to analyze your qualifications, compare them against target job descriptions, rewrite sections, and draft personalized cover letters.
                </li>
                <li>
                  <strong className="text-slate-800">Data Agreements:</strong> Under our integration agreements, your submitted data (CV content and Job Descriptions) is transmitted securely to Google’s API for the sole purpose of processing your requests in real-time. Your data is not stored permanently by Google, nor is it used to train Google's public generative AI models.
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-500" />
                4. Data Security & Sharing
              </h2>
              <p>
                We prioritize data privacy and security. We implement standard encryption methods to transmit data to our API handlers. We do not sell, distribute, lease, or share your personal information or resume contents with any third parties other than the underlying secure AI API providers (Google Gemini) required to run the service.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-500" />
                5. Changes to This Privacy Policy
              </h2>
              <p>
                We reserve the right to modify this Privacy Policy at any time. Changes will take effect immediately upon their publication on this page. We encourage you to review this page regularly to stay informed about how we protect your privacy.
              </p>
            </section>

            <div className="pt-6 border-t border-slate-100 text-sm text-slate-400 text-center">
              If you have any questions about this Privacy Policy, feel free to contact us.
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
