import { CVData } from "@/lib/types";

export interface TemplateProps {
  data: CVData;
}

export function TechMinimal({ data }: TemplateProps) {
  return (
    <div className="bg-white text-slate-800 font-mono p-8 max-w-[800px] mx-auto leading-normal text-xs print:p-0">
      {/* Dev Header */}
      <header className="border-b border-slate-300 pb-4 mb-6">
        <h1 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">{data.fullName}</h1>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-slate-500 mt-2 text-[11px]">
          {data.email && <span>email: {data.email}</span>}
          {data.phone && <span>tel: {data.phone}</span>}
          {data.location && <span>loc: {data.location}</span>}
          {data.linkedin && <span>linkedin: {data.linkedin}</span>}
          {data.portfolio && <span>site: {data.portfolio}</span>}
        </div>
      </header>

      {/* Summary */}
      {data.professionalSummary && (
        <section className="mb-5">
          <h2 className="text-slate-900 font-bold uppercase tracking-wider border-b border-slate-200 pb-0.5 mb-2">
            {"// Profile Summary"}
          </h2>
          <p className="text-slate-700 leading-relaxed font-sans text-[12.5px] text-justify">{data.professionalSummary}</p>
        </section>
      )}

      {/* Technical Skills - Near the Top */}
      {data.skills && data.skills.length > 0 && (
        <section className="mb-5">
          <h2 className="text-slate-900 font-bold uppercase tracking-wider border-b border-slate-200 pb-0.5 mb-2">
            {"// Core Stack & Skills"}
          </h2>
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {data.skills.map((skill, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 border border-slate-300 text-slate-700 rounded-md bg-slate-50 font-semibold text-[10px] print:bg-white print:border-slate-400"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Work Experience */}
      {data.experience && data.experience.length > 0 && (
        <section className="mb-5">
          <h2 className="text-slate-900 font-bold uppercase tracking-wider border-b border-slate-200 pb-0.5 mb-3">
            {"// Professional Work"}
          </h2>
          <div className="space-y-4 font-sans">
            {data.experience.map((exp, idx) => (
              <div key={idx} className="space-y-1 break-inside-avoid">
                <div className="flex justify-between items-baseline font-bold text-slate-900 text-[13px] font-mono">
                  <span>{exp.jobTitle} @ {exp.company}</span>
                  <span className="text-[10px] text-slate-500 font-normal">
                    {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                  </span>
                </div>
                {exp.location && (
                  <div className="text-[10px] text-slate-400 font-mono">loc: {exp.location}</div>
                )}
                {exp.responsibilities && exp.responsibilities.length > 0 && (
                  <ul className="list-disc pl-4 text-slate-700 space-y-1 text-xs text-justify">
                    {exp.responsibilities.map((resp, rIdx) => (
                      <li key={rIdx}>{resp}</li>
                    ))}
                    {exp.achievements && exp.achievements.map((ach, aIdx) => (
                      <li key={aIdx} className="font-semibold text-slate-900 list-none mt-1">
                        &gt; Achievement: {ach}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {data.projects && data.projects.length > 0 && (
        <section className="mb-5">
          <h2 className="text-slate-900 font-bold uppercase tracking-wider border-b border-slate-200 pb-0.5 mb-3">
            {"// Personal & Open Source Projects"}
          </h2>
          <div className="space-y-3 font-sans">
            {data.projects.map((proj, idx) => (
              <div key={idx} className="space-y-1 text-xs break-inside-avoid">
                <div className="flex justify-between items-baseline font-bold text-slate-900 font-mono">
                  <span className="text-[12.5px]">{proj.title}</span>
                  {proj.link && <span className="text-[10px] text-blue-600 font-normal">{proj.link}</span>}
                </div>
                <p className="text-slate-700 leading-relaxed text-justify">{proj.description}</p>
                {proj.technologies && proj.technologies.length > 0 && (
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                    stack: {proj.technologies.join(" / ")}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {data.education && data.education.length > 0 && (
        <section className="mb-5">
          <h2 className="text-slate-900 font-bold uppercase tracking-wider border-b border-slate-200 pb-0.5 mb-2.5">
            {"// Education"}
          </h2>
          <div className="space-y-2">
            {data.education.map((edu, idx) => (
              <div key={idx} className="text-slate-700 break-inside-avoid">
                <div className="flex justify-between items-baseline font-bold text-slate-900">
                  <span>{edu.qualification}</span>
                  <span className="text-[10px] text-slate-500 font-normal">
                    {edu.startDate} - {edu.endDate}
                  </span>
                </div>
                <div className="text-[11px] text-slate-600">
                  {edu.institution}{edu.location ? `, ${edu.location}` : ""}
                </div>
                {edu.details && <p className="text-[11px] font-sans italic text-slate-500 mt-0.5">{edu.details}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certs */}
      {data.certifications && data.certifications.length > 0 && (
        <section className="mb-5">
          <h2 className="text-slate-900 font-bold uppercase tracking-wider border-b border-slate-200 pb-0.5 mb-2">
            {"// Certs"}
          </h2>
          <ul className="space-y-0.5 text-slate-700 text-[11px]">
            {data.certifications.map((cert, idx) => (
              <li key={idx}>+ {cert}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Additional Info */}
      {data.additionalSections && (
        <section>
          <h2 className="text-slate-900 font-bold uppercase tracking-wider border-b border-slate-200 pb-0.5 mb-2">
            {"// Additional Details"}
          </h2>
          <p className="text-slate-700 leading-relaxed font-sans text-justify">{data.additionalSections}</p>
        </section>
      )}
    </div>
  );
}
