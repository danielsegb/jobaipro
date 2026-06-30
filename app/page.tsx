import { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { FeatureCard } from "@/components/home/FeatureCard";
import { HowItWorks } from "@/components/home/HowItWorks";
import { 
  Wand2, 
  FileText, 
  Binary, 
  Edit3, 
  Layers, 
  Download 
} from "lucide-react";

export const metadata: Metadata = {
  title: "Job AI Pro | Tailor your CV and cover letter in minutes",
  description: "Optimise your CV and generate tailored cover letters using AI. Ensure ATS keyword compatibility and download professional templates.",
};

export default function Home() {
  const features = [
    {
      icon: Wand2,
      title: "AI CV Optimisation",
      description: "Automatically align your resume with target job descriptions while retaining complete factual truthfulness.",
      iconBgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      href: "/cv-optimiser",
    },
    {
      icon: FileText,
      title: "Tailored Cover Letters",
      description: "Generate highly professional cover letters specifically written to link your experiences to the company's needs.",
      iconBgColor: "bg-indigo-50",
      iconColor: "text-indigo-600",
      href: "/cover-letter",
    },
    {
      icon: Binary,
      title: "ATS Keyword Analysis",
      description: "Compare your CV against job listings to see match score, missing keywords, and structural readiness ratings.",
      iconBgColor: "bg-emerald-50",
      iconColor: "text-emerald-600",
      href: "/ats-checker",
    },
    {
      icon: Edit3,
      title: "Live Rich Editor",
      description: "Fine-tune details on the fly. Make custom edits to summary, skills, experience, and cover letter blocks in real-time.",
      iconBgColor: "bg-amber-50",
      iconColor: "text-amber-600",
      href: "/cv-optimiser",
    },
    {
      icon: Layers,
      title: "Professional Templates",
      description: "Select from five bespoke document styles (Classic, Modern, Tech Minimal, Healthcare, Graduate) in one click.",
      iconBgColor: "bg-purple-50",
      iconColor: "text-purple-600",
      href: "/cv-optimiser",
    },
    {
      icon: Download,
      title: "Instant PDF Download",
      description: "Export clean, perfectly typeset PDFs compatible with standard Applicant Tracking Systems.",
      iconBgColor: "bg-pink-50",
      iconColor: "text-pink-600",
      href: "/cv-optimiser",
    },
  ];

  return (
    <>
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Banner */}
        <HeroSection />

        {/* Features Section */}
        <section id="features" className="py-24 sm:py-32 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4 max-w-2xl mx-auto mb-16 sm:mb-20">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Features built for career success
              </h2>
              <p className="text-slate-500">
                Unlock interview callbacks with premium tools designed to help you stand out.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feat, index) => (
                <FeatureCard
                  key={index}
                  icon={feat.icon}
                  title={feat.title}
                  description={feat.description}
                  iconBgColor={feat.iconBgColor}
                  iconColor={feat.iconColor}
                  href={feat.href}
                />
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Timeline */}
        <HowItWorks />
      </main>

      <Footer />
    </>
  );
}
