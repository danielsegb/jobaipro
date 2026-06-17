import { CVData } from "@/lib/types";

export interface TemplateProps {
  data: CVData;
}

export function ClassicATS({ data }: TemplateProps) {
  return (
    <div className="bg-white text-slate-900 font-serif p-8 max-w-[800px] mx-auto leading-normal text-[13.5px] print:p-0">
      {/* Header */}
      <header className="text-center space-y-1 mb-6 border-b-2 border-slate-900 pb-4">
        <h1 className="text-2xl font-bold uppercase tracking-wide text-slate-900">{data.fullName}</h1>
        <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1 text-slate-600 text-xs font-sans">
          {data.email && <span>{data.email}</span>}
          {data.phone && <span>• {data.phone}</span>}
          {data.location && <span>• {data.location}</span>}
          {data.linkedin && <span>• {data.linkedin}</span>}
          {data.portfolio && <span>• {data.portfolio}</span>}
        </div>
      </header>

      {/* Professional Summary */}
      {data.professionalSummary && (
        <section className="mb-5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-2 font-sans">
            Professional Summary
          </h2>
          <p className="text-slate-800 leading-relaxed text-justify">{data.professionalSummary}</p>
        </section>
      )}

      {/* Skills */}
      {data.skills && data.skills.length > 0 && (
        <section className="mb-5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-2 font-sans">
            Key Skills
          </h2>
          <p className="text-slate-800 leading-relaxed">
            {data.skills.join(" • ")}
          </p>
        </section>
      )}

      {/* Work Experience */}
      {data.experience && data.experience.length > 0 && (
        <section className="mb-5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-2.5 font-sans">
            Professional Experience
          </h2>
          <div className="space-y-4">
            {data.experience.map((exp, idx) => (
              <div key={idx} className="space-y-1 break-inside-avoid">
                <div className="flex justify-between items-baseline font-bold text-slate-900">
                  <span>{exp.jobTitle} – {exp.company}</span>
                  <span className="text-xs font-normal text-slate-600 font-sans">
                    {exp.startDate} – {exp.current ? "Present" : exp.endDate}
                  </span>
                </div>
                {exp.location && (
                  <div className="text-xs font-medium text-slate-500 font-sans">{exp.location}</div>
                )}
                {exp.responsibilities && exp.responsibilities.length > 0 && (
                  <ul className="list-disc pl-5 text-slate-800 space-y-0.5 text-justify">
                    {exp.responsibilities.map((resp, rIdx) => (
                      <li key={rIdx}>{resp}</li>
                    ))}
                    {exp.achievements && exp.achievements.map((ach, aIdx) => (
                      <li key={aIdx} className="font-medium text-slate-900">
                        <span className="font-bold">Achievement:</span> {ach}
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
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-2.5 font-sans">
            Key Projects
          </h2>
          <div className="space-y-3">
            {data.projects.map((proj, idx) => (
              <div key={idx} className="space-y-1 break-inside-avoid">
                <div className="flex justify-between items-baseline font-bold text-slate-900">
                  <span>{proj.title}</span>
                  {proj.link && <span className="text-xs font-normal text-slate-500 font-sans">{proj.link}</span>}
                </div>
                <p className="text-slate-800 text-justify">{proj.description}</p>
                {proj.technologies && proj.technologies.length > 0 && (
                  <p className="text-xs text-slate-500 font-sans">
                    <span className="font-semibold text-slate-700">Technologies:</span> {proj.technologies.join(", ")}
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
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-2.5 font-sans">
            Education
          </h2>
          <div className="space-y-3">
            {data.education.map((edu, idx) => (
              <div key={idx} className="space-y-0.5 break-inside-avoid">
                <div className="flex justify-between items-baseline font-bold text-slate-900">
                  <span>{edu.qualification}</span>
                  <span className="text-xs font-normal text-slate-600 font-sans">
                    {edu.startDate} – {edu.endDate}
                  </span>
                </div>
                <div className="flex justify-between items-baseline text-xs text-slate-600 font-sans">
                  <span>{edu.institution}{edu.location ? `, ${edu.location}` : ""}</span>
                </div>
                {edu.details && <p className="text-slate-800 text-xs italic mt-0.5">{edu.details}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {data.certifications && data.certifications.length > 0 && (
        <section className="mb-5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-2 font-sans">
            Certifications
          </h2>
          <ul className="list-disc pl-5 text-slate-800 space-y-0.5">
            {data.certifications.map((cert, idx) => (
              <li key={idx}>{cert}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Additional Information */}
      {data.additionalSections && (
        <section>
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-2 font-sans">
            Additional Information
          </h2>
          <p className="text-slate-800 leading-relaxed text-justify">{data.additionalSections}</p>
        </section>
      )}
    </div>
  );
}
