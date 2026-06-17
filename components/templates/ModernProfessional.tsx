import { CVData } from "@/lib/types";

export interface TemplateProps {
  data: CVData;
}

export function ModernProfessional({ data }: TemplateProps) {
  return (
    <div className="bg-white text-slate-800 font-sans p-8 max-w-[800px] mx-auto leading-relaxed text-[13.5px] print:p-0">
      {/* Visual Header */}
      <header className="mb-6 bg-slate-900 text-white p-6 rounded-xl flex flex-col md:flex-row md:justify-between md:items-center gap-4 print:rounded-none print:bg-white print:text-slate-900 print:p-0 print:border-b-2 print:border-slate-800">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight uppercase print:text-2xl">{data.fullName}</h1>
          <p className="text-blue-400 text-sm font-semibold tracking-wider uppercase mt-1 print:text-blue-700">
            Professional Curriculum Vitae
          </p>
        </div>
        <div className="flex flex-col text-slate-300 text-xs gap-1 md:text-right print:text-slate-600">
          {data.email && <span>{data.email}</span>}
          {data.phone && <span>{data.phone}</span>}
          {data.location && <span>{data.location}</span>}
          <div className="flex gap-2 flex-wrap md:justify-end">
            {data.linkedin && <span className="underline">{data.linkedin}</span>}
            {data.portfolio && <span className="underline">{data.portfolio}</span>}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column (Skills / Education / Certs) */}
        <div className="md:col-span-1 space-y-6">
          {/* Skills */}
          {data.skills && data.skills.length > 0 && (
            <section>
              <h2 className="text-sm font-bold uppercase tracking-wider text-blue-700 border-b-2 border-blue-100 pb-1 mb-2">
                Core Skills
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {data.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-slate-50 text-slate-700 text-xs font-semibold rounded border border-slate-100 print:bg-white print:border-slate-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {data.education && data.education.length > 0 && (
            <section>
              <h2 className="text-sm font-bold uppercase tracking-wider text-blue-700 border-b-2 border-blue-100 pb-1 mb-2.5">
                Education
              </h2>
              <div className="space-y-3">
                {data.education.map((edu, idx) => (
                  <div key={idx} className="space-y-0.5 break-inside-avoid">
                    <h4 className="font-bold text-slate-900 text-xs leading-tight">{edu.qualification}</h4>
                    <p className="text-xs text-slate-600 font-medium">{edu.institution}</p>
                    <p className="text-[10px] text-slate-400">
                      {edu.startDate} – {edu.endDate}
                    </p>
                    {edu.details && <p className="text-[11px] text-slate-500 italic mt-0.5 leading-snug">{edu.details}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Certifications */}
          {data.certifications && data.certifications.length > 0 && (
            <section>
              <h2 className="text-sm font-bold uppercase tracking-wider text-blue-700 border-b-2 border-blue-100 pb-1 mb-2">
                Certifications
              </h2>
              <ul className="list-disc pl-4 text-xs text-slate-600 space-y-1">
                {data.certifications.map((cert, idx) => (
                  <li key={idx} className="font-medium text-slate-700">{cert}</li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* Right Column (Summary / Experience / Projects) */}
        <div className="md:col-span-2 space-y-6">
          {/* Summary */}
          {data.professionalSummary && (
            <section>
              <h2 className="text-sm font-bold uppercase tracking-wider text-blue-700 border-b-2 border-blue-100 pb-1 mb-2">
                Profile
              </h2>
              <p className="text-slate-700 leading-relaxed text-justify">{data.professionalSummary}</p>
            </section>
          )}

          {/* Experience */}
          {data.experience && data.experience.length > 0 && (
            <section>
              <h2 className="text-sm font-bold uppercase tracking-wider text-blue-700 border-b-2 border-blue-100 pb-1 mb-2.5">
                Experience
              </h2>
              <div className="space-y-4">
                {data.experience.map((exp, idx) => (
                  <div key={idx} className="space-y-1 break-inside-avoid">
                    <div className="flex justify-between items-baseline font-bold text-slate-900">
                      <span className="text-sm">{exp.jobTitle}</span>
                      <span className="text-[11px] text-slate-500 font-normal">
                        {exp.startDate} – {exp.current ? "Present" : exp.endDate}
                      </span>
                    </div>
                    <div className="flex justify-between items-baseline text-xs font-semibold text-blue-600">
                      <span>{exp.company}{exp.location ? `, ${exp.location}` : ""}</span>
                    </div>
                    {exp.responsibilities && exp.responsibilities.length > 0 && (
                      <ul className="list-disc pl-4 text-slate-600 space-y-0.5 text-xs text-justify">
                        {exp.responsibilities.map((resp, rIdx) => (
                          <li key={rIdx}>{resp}</li>
                        ))}
                        {exp.achievements && exp.achievements.map((ach, aIdx) => (
                          <li key={aIdx} className="font-medium text-slate-800">
                            <span className="font-bold text-blue-700">Achievement:</span> {ach}
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
            <section>
              <h2 className="text-sm font-bold uppercase tracking-wider text-blue-700 border-b-2 border-blue-100 pb-1 mb-2.5">
                Key Projects
              </h2>
              <div className="space-y-3">
                {data.projects.map((proj, idx) => (
                  <div key={idx} className="space-y-1 text-xs break-inside-avoid">
                    <div className="flex justify-between items-baseline font-bold text-slate-900">
                      <span className="text-sm">{proj.title}</span>
                      {proj.link && <span className="text-[10px] text-blue-600 underline font-normal">{proj.link}</span>}
                    </div>
                    <p className="text-slate-600 leading-relaxed text-justify">{proj.description}</p>
                    {proj.technologies && proj.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {proj.technologies.map((tech, tIdx) => (
                          <span key={tIdx} className="text-[9px] font-semibold text-slate-500 bg-slate-100 px-1 py-0.5 rounded">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Additional Info */}
          {data.additionalSections && (
            <section>
              <h2 className="text-sm font-bold uppercase tracking-wider text-blue-700 border-b-2 border-blue-100 pb-1 mb-2">
                Additional Info
              </h2>
              <p className="text-slate-700 text-xs leading-relaxed text-justify">{data.additionalSections}</p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
