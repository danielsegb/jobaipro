import { CVData } from "@/lib/types";

export interface TemplateProps {
  data: CVData;
}

export function Graduate({ data }: TemplateProps) {
  return (
    <div className="bg-white text-slate-800 font-sans p-8 max-w-[800px] mx-auto leading-relaxed text-[13.5px] print:p-0">
      {/* Graduate Header */}
      <header className="border-b-2 border-slate-300 pb-4 mb-6 text-center">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{data.fullName}</h1>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-slate-500 mt-2 text-xs">
          {data.email && <span>{data.email}</span>}
          {data.phone && <span>{data.phone}</span>}
          {data.location && <span>{data.location}</span>}
          {data.linkedin && <span>{data.linkedin}</span>}
          {data.portfolio && <span>{data.portfolio}</span>}
        </div>
      </header>

      {/* Profile */}
      {data.professionalSummary && (
        <section className="mb-5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-2">
            Career Objective & Profile
          </h2>
          <p className="text-slate-700 leading-relaxed text-justify">{data.professionalSummary}</p>
        </section>
      )}

      {/* Education - Graduate CV places Education at the top */}
      {data.education && data.education.length > 0 && (
        <section className="mb-5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-2.5">
            Education
          </h2>
          <div className="space-y-3">
            {data.education.map((edu, idx) => (
              <div key={idx} className="space-y-0.5">
                <div className="flex justify-between items-baseline font-bold text-slate-900">
                  <span>{edu.qualification}</span>
                  <span className="text-xs text-slate-500 font-normal">
                    {edu.startDate} – {edu.endDate}
                  </span>
                </div>
                <div className="text-xs text-slate-600 font-medium">
                  {edu.institution}{edu.location ? `, ${edu.location}` : ""}
                </div>
                {edu.details && <p className="text-xs text-slate-500 mt-0.5 leading-relaxed text-justify">{edu.details}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects - Highly relevant for graduates to show capability */}
      {data.projects && data.projects.length > 0 && (
        <section className="mb-5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-2.5">
            Academic & Personal Projects
          </h2>
          <div className="space-y-3">
            {data.projects.map((proj, idx) => (
              <div key={idx} className="space-y-1 text-xs">
                <div className="flex justify-between items-baseline font-bold text-slate-900">
                  <span className="text-sm">{proj.title}</span>
                  {proj.link && <span className="text-[10px] text-blue-600 underline font-normal">{proj.link}</span>}
                </div>
                <p className="text-slate-600 leading-relaxed text-justify">{proj.description}</p>
                {proj.technologies && proj.technologies.length > 0 && (
                  <p className="text-[10px] text-slate-500">
                    <span className="font-semibold">Technologies:</span> {proj.technologies.join(", ")}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Experience (Placements, Volunteering, Work) */}
      {data.experience && data.experience.length > 0 && (
        <section className="mb-5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-2.5">
            Experience & Activities
          </h2>
          <div className="space-y-4">
            {data.experience.map((exp, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between items-baseline font-bold text-slate-900 text-sm">
                  <span>{exp.jobTitle}</span>
                  <span className="text-xs text-slate-500 font-normal">
                    {exp.startDate} – {exp.current ? "Present" : exp.endDate}
                  </span>
                </div>
                <div className="text-xs font-semibold text-slate-500">
                  {exp.company}{exp.location ? `, ${exp.location}` : ""}
                </div>
                {exp.responsibilities && exp.responsibilities.length > 0 && (
                  <ul className="list-disc pl-4 text-slate-600 space-y-0.5 text-xs text-justify">
                    {exp.responsibilities.map((resp, rIdx) => (
                      <li key={rIdx}>{resp}</li>
                    ))}
                    {exp.achievements && exp.achievements.map((ach, aIdx) => (
                      <li key={aIdx} className="font-medium text-slate-800">
                        <span className="font-bold text-slate-900">Achievement:</span> {ach}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Core Skills */}
      {data.skills && data.skills.length > 0 && (
        <section className="mb-5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-2">
            Skills & Competencies
          </h2>
          <div className="flex flex-wrap gap-2 pt-1">
            {data.skills.map((skill, idx) => (
              <span key={idx} className="text-xs text-slate-700 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-full">
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {data.certifications && data.certifications.length > 0 && (
        <section className="mb-5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-2">
            Certifications
          </h2>
          <ul className="list-disc pl-4 text-xs text-slate-600 space-y-0.5">
            {data.certifications.map((cert, idx) => (
              <li key={idx} className="font-medium text-slate-700">{cert}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Additional Info */}
      {data.additionalSections && (
        <section>
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-2">
            Additional Information
          </h2>
          <p className="text-slate-700 text-xs leading-relaxed text-justify">{data.additionalSections}</p>
        </section>
      )}
    </div>
  );
}
