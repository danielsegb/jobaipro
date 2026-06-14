import { CVData } from "@/lib/types";

export interface TemplateProps {
  data: CVData;
}

export function HealthcareNHS({ data }: TemplateProps) {
  return (
    <div className="bg-white text-slate-800 font-sans p-8 max-w-[800px] mx-auto leading-relaxed text-[13.5px] print:p-0">
      {/* Header */}
      <header className="border-b-4 border-blue-600 pb-4 mb-6">
        <h1 className="text-3xl font-extrabold text-blue-900 tracking-tight">{data.fullName}</h1>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-slate-500 mt-2 text-xs font-semibold">
          {data.email && <span>Email: {data.email}</span>}
          {data.phone && <span>Tel: {data.phone}</span>}
          {data.location && <span>Location: {data.location}</span>}
          {data.linkedin && <span>LinkedIn: {data.linkedin}</span>}
          {data.portfolio && <span>Portfolio: {data.portfolio}</span>}
        </div>
      </header>

      {/* Professional Summary */}
      {data.professionalSummary && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-blue-900 bg-blue-50 px-3 py-1 rounded-md mb-2">
            Professional Profile & Care Philosophy
          </h2>
          <p className="text-slate-700 leading-relaxed text-justify px-3">{data.professionalSummary}</p>
        </section>
      )}

      {/* Skills / Care Competencies */}
      {data.skills && data.skills.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-blue-900 bg-blue-50 px-3 py-1 rounded-md mb-2.5">
            Key Competencies & Training
          </h2>
          <div className="grid grid-cols-2 gap-2 px-3 text-xs">
            {data.skills.map((skill, idx) => (
              <div key={idx} className="flex items-center gap-1.5 text-slate-700 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                {skill}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Professional Experience */}
      {data.experience && data.experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-blue-900 bg-blue-50 px-3 py-1 rounded-md mb-3">
            Employment & Clinical Practice
          </h2>
          <div className="space-y-4 px-3">
            {data.experience.map((exp, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between items-baseline font-bold text-slate-900 text-sm">
                  <span>{exp.jobTitle}</span>
                  <span className="text-xs text-slate-500 font-normal">
                    {exp.startDate} – {exp.current ? "Present" : exp.endDate}
                  </span>
                </div>
                <div className="text-xs font-semibold text-blue-700">
                  {exp.company}{exp.location ? `, ${exp.location}` : ""}
                </div>
                {exp.responsibilities && exp.responsibilities.length > 0 && (
                  <ul className="list-disc pl-4 text-slate-600 space-y-0.5 text-xs text-justify">
                    {exp.responsibilities.map((resp, rIdx) => (
                      <li key={rIdx}>{resp}</li>
                    ))}
                    {exp.achievements && exp.achievements.map((ach, aIdx) => (
                      <li key={aIdx} className="font-semibold text-slate-800 list-none mt-1 pl-1 border-l-2 border-blue-200">
                        <span className="text-blue-700 font-bold">Key Achievement:</span> {ach}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education & Qualifications */}
      {data.education && data.education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-blue-900 bg-blue-50 px-3 py-1 rounded-md mb-2.5">
            Education & Academic Qualifications
          </h2>
          <div className="space-y-3 px-3">
            {data.education.map((edu, idx) => (
              <div key={idx} className="text-xs">
                <div className="flex justify-between items-baseline font-bold text-slate-900">
                  <span>{edu.qualification}</span>
                  <span className="text-slate-500 font-normal">{edu.startDate} – {edu.endDate}</span>
                </div>
                <div className="text-slate-600 font-medium">{edu.institution}{edu.location ? `, ${edu.location}` : ""}</div>
                {edu.details && <p className="text-slate-500 italic mt-0.5">{edu.details}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications & Training */}
      {data.certifications && data.certifications.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-blue-900 bg-blue-50 px-3 py-1 rounded-md mb-2">
            Professional Registrations & Certifications
          </h2>
          <ul className="list-disc pl-7 text-xs text-slate-700 space-y-1">
            {data.certifications.map((cert, idx) => (
              <li key={idx} className="font-medium">{cert}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Additional Sections */}
      {data.additionalSections && (
        <section>
          <h2 className="text-sm font-bold uppercase tracking-wider text-blue-900 bg-blue-50 px-3 py-1 rounded-md mb-2">
            Additional Information & Safeguarding
          </h2>
          <p className="text-slate-700 px-3 text-xs leading-relaxed text-justify">{data.additionalSections}</p>
        </section>
      )}
    </div>
  );
}
