import { UploadCloud, FileSpreadsheet, Download } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      num: "01",
      icon: UploadCloud,
      title: "Upload or paste your CV",
      description: "Upload a PDF/Word file or paste the text content of your current CV. This forms the factual baseline of your profile.",
      color: "bg-blue-50 text-blue-600 border-blue-100",
    },
    {
      num: "02",
      icon: FileSpreadsheet,
      title: "Paste a job description",
      description: "Provide the details of the job you are targeting. Gemini will analyze the requirements and extract critical keywords.",
      color: "bg-indigo-50 text-indigo-600 border-indigo-100",
    },
    {
      num: "03",
      icon: Download,
      title: "Edit and download",
      description: "Review your tailored application pack. Edit key details live, swap between 5 ATS-friendly templates, and download as PDF.",
      color: "bg-violet-50 text-violet-600 border-violet-100",
    },
  ];

  return (
    <section className="bg-slate-50 border-y border-slate-100 py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto mb-16 sm:mb-20">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Tailor your application in three simple steps
          </h2>
          <p className="text-slate-500">
            Our optimized workflow helps you target any role with surgical precision.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 lg:gap-12 relative">
          {steps.map((step, idx) => {
            const IconComponent = step.icon;
            return (
              <div key={idx} className="relative flex flex-col items-center md:items-start text-center md:text-left space-y-6 group">
                {/* Number overlay */}
                <span className="absolute -top-10 text-7xl font-extrabold text-slate-200/50 -z-10 select-none group-hover:text-slate-200 transition-colors duration-300">
                  {step.num}
                </span>

                {/* Icon Circle */}
                <div className={`w-14 h-14 rounded-2xl ${step.color} border flex items-center justify-center shadow-sm`}>
                  <IconComponent className="w-6 h-6" />
                </div>

                {/* Text Description */}
                <div className="space-y-2.5">
                  <h3 className="text-xl font-bold text-slate-900">{step.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed max-w-sm">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
