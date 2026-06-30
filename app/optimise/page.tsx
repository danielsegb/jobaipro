"use client";

import * as React from "react";
import Link from "next/link";
import { Sparkles, FileText, Binary, Wand2, ArrowRight } from "lucide-react";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";

export default function OptimisePage() {
  const tools = [
    {
      icon: Wand2,
      title: "CV Optimizer",
      description: "Automatically align your resume with target job descriptions, improve impact verbs, structure bullet points, or just clean up and reformat your existing CV.",
      href: "/cv-optimiser",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50/50",
      borderColor: "border-blue-100",
      textColor: "text-blue-600",
      cta: "Optimise CV",
    },
    {
      icon: FileText,
      title: "Cover Letter Generator",
      description: "Write a highly tailored, professional cover letter linking your direct CV qualifications to a specific job description in seconds.",
      href: "/cover-letter",
      color: "from-indigo-500 to-purple-500",
      bgColor: "bg-indigo-50/50",
      borderColor: "border-indigo-100",
      textColor: "text-indigo-600",
      cta: "Generate Cover Letter",
    },
    {
      icon: Binary,
      title: "ATS Keyword Checker",
      description: "Check compatibility of your CV against a job description. View matching/missing critical keywords, match score, and actionable improvement suggestions.",
      href: "/ats-checker",
      color: "from-emerald-500 to-teal-500",
      bgColor: "bg-emerald-50/50",
      borderColor: "border-emerald-100",
      textColor: "text-emerald-600",
      cta: "Check ATS Score",
    },
  ];

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-16 sm:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header */}
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold tracking-wide border border-blue-100/50">
              <Sparkles className="w-3.5 h-3.5 fill-current" />
              AI-Powered Career Toolkit
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Choose your professional tool
            </h1>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
              We have split our powerful wizard into three specialized, independent tools. Select the one that meets your immediate needs.
            </p>
          </div>

          {/* Grid of tools */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            {tools.map((tool, idx) => {
              const Icon = tool.icon;
              return (
                <Link key={idx} href={tool.href} className="group h-full flex">
                  <Card className={`border ${tool.borderColor} ${tool.bgColor} hover:bg-white hover:shadow-lg transition-all duration-300 flex flex-col justify-between w-full h-full cursor-pointer hover:-translate-y-1`}>
                    <CardHeader className="p-6 pb-4">
                      <div className={`w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm ${tool.textColor} group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <CardTitle className="text-lg font-bold text-slate-900 mt-4 group-hover:text-blue-600 transition-colors">
                        {tool.title}
                      </CardTitle>
                      <CardDescription className="text-sm text-slate-500 mt-2 leading-relaxed">
                        {tool.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 pt-0 flex items-center gap-2 text-xs font-bold text-blue-600 mt-auto">
                      <span>{tool.cta}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
