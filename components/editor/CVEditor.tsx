"use client";
import * as React from "react";
import { Plus, Trash2, ChevronDown, ChevronUp, Wand2 } from "lucide-react";
import { CVData, ExperienceItem, EducationItem, ProjectItem } from "@/lib/types";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";

export interface CVEditorProps {
  data: CVData;
  onChange: (data: CVData) => void;
  jobDescription?: string;
  onRewriteSection?: (sectionText: string, sectionType: string) => Promise<string>;
  isRewriting?: boolean;
}

function AccordionSection({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <div className="border border-slate-100 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-5 py-4 bg-slate-50/60 hover:bg-slate-100/40 transition-colors cursor-pointer"
      >
        <span className="text-sm font-bold text-slate-800">{title}</span>
        {open ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
      </button>
      {open && <div className="p-5 space-y-4 bg-white">{children}</div>}
    </div>
  );
}

export function CVEditor({ data, onChange, jobDescription, onRewriteSection, isRewriting }: CVEditorProps) {
  const update = (field: keyof CVData, value: unknown) => {
    onChange({ ...data, [field]: value });
  };

  // Experience handlers
  const addExperience = () => {
    const newExp: ExperienceItem = {
      jobTitle: "", company: "", location: "", startDate: "", endDate: "", current: false,
      responsibilities: [""], achievements: []
    };
    update("experience", [...data.experience, newExp]);
  };
  const updateExp = (idx: number, field: keyof ExperienceItem, value: unknown) => {
    const updated = data.experience.map((exp, i) => i === idx ? { ...exp, [field]: value } : exp);
    update("experience", updated);
  };
  const removeExp = (idx: number) => update("experience", data.experience.filter((_, i) => i !== idx));

  // Education handlers
  const addEducation = () => {
    const newEdu: EducationItem = { qualification: "", institution: "", location: "", startDate: "", endDate: "", details: "" };
    update("education", [...data.education, newEdu]);
  };
  const updateEdu = (idx: number, field: keyof EducationItem, value: string) => {
    const updated = data.education.map((edu, i) => i === idx ? { ...edu, [field]: value } : edu);
    update("education", updated);
  };
  const removeEdu = (idx: number) => update("education", data.education.filter((_, i) => i !== idx));

  // Project handlers
  const addProject = () => {
    const newProj: ProjectItem = { title: "", description: "", link: "", technologies: [] };
    update("projects", [...data.projects, newProj]);
  };
  const updateProj = (idx: number, field: keyof ProjectItem, value: unknown) => {
    const updated = data.projects.map((proj, i) => i === idx ? { ...proj, [field]: value } : proj);
    update("projects", updated);
  };
  const removeProj = (idx: number) => update("projects", data.projects.filter((_, i) => i !== idx));

  const handleRewriteSummary = async () => {
    if (!onRewriteSection || !jobDescription) return;
    const result = await onRewriteSection(data.professionalSummary, "Professional Summary");
    if (result) update("professionalSummary", result);
  };

  return (
    <div className="space-y-3">
      {/* Contact Details */}
      <AccordionSection title="Contact Details" defaultOpen>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Full Name</label>
            <Input value={data.fullName} onChange={e => update("fullName", e.target.value)} placeholder="Your full name" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email</label>
            <Input value={data.email} onChange={e => update("email", e.target.value)} placeholder="email@domain.co.uk" type="email" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Phone</label>
            <Input value={data.phone} onChange={e => update("phone", e.target.value)} placeholder="+44 7700 000000" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Location</label>
            <Input value={data.location} onChange={e => update("location", e.target.value)} placeholder="London, UK" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">LinkedIn</label>
            <Input value={data.linkedin} onChange={e => update("linkedin", e.target.value)} placeholder="linkedin.com/in/yourprofile" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Portfolio / Website</label>
            <Input value={data.portfolio} onChange={e => update("portfolio", e.target.value)} placeholder="yoursite.dev" />
          </div>
        </div>
      </AccordionSection>

      {/* Professional Summary */}
      <AccordionSection title="Professional Summary" defaultOpen>
        <div className="space-y-2">
          <Textarea
            value={data.professionalSummary}
            onChange={e => update("professionalSummary", e.target.value)}
            rows={5}
            placeholder="Your professional profile and career objective..."
            className="text-sm"
          />
          {onRewriteSection && jobDescription && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleRewriteSummary}
              isLoading={isRewriting}
              className="text-blue-600 border-blue-100 hover:bg-blue-50"
            >
              <Wand2 className="w-3.5 h-3.5 mr-1.5 text-blue-500" />
              AI Rewrite
            </Button>
          )}
        </div>
      </AccordionSection>

      {/* Skills */}
      <AccordionSection title="Key Skills">
        <div className="space-y-2">
          <p className="text-xs text-slate-400">Enter one skill per line.</p>
          <Textarea
            value={data.skills.join("\n")}
            onChange={e => update("skills", e.target.value.split("\n").map(s => s.trim()).filter(Boolean))}
            rows={6}
            placeholder="TypeScript&#10;React&#10;Project Management"
            className="text-sm font-mono"
          />
        </div>
      </AccordionSection>

      {/* Work Experience */}
      <AccordionSection title="Work Experience">
        <div className="space-y-4">
          {data.experience.map((exp, idx) => (
            <div key={idx} className="border border-slate-100 rounded-lg p-4 space-y-3 bg-slate-50/30">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Role {idx + 1}</span>
                <Button variant="ghost" size="sm" onClick={() => removeExp(idx)} className="text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5">
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Job Title</label>
                  <Input value={exp.jobTitle} onChange={e => updateExp(idx, "jobTitle", e.target.value)} placeholder="Software Engineer" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Company</label>
                  <Input value={exp.company} onChange={e => updateExp(idx, "company", e.target.value)} placeholder="Company Name" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Start Date</label>
                  <Input value={exp.startDate} onChange={e => updateExp(idx, "startDate", e.target.value)} placeholder="2021-06" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">End Date</label>
                  <Input value={exp.current ? "Present" : exp.endDate} onChange={e => updateExp(idx, "endDate", e.target.value)} placeholder="2024-03 or Present" disabled={exp.current} />
                </div>
              </div>
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-500 cursor-pointer">
                <input type="checkbox" checked={exp.current} onChange={e => updateExp(idx, "current", e.target.checked)} className="rounded border-slate-300" />
                Currently working here
              </label>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Responsibilities & Achievements</label>
                <p className="text-[11px] text-slate-400">One bullet point per line. Start with strong verbs.</p>
                <Textarea
                  value={[...(exp.responsibilities || []), ...(exp.achievements || [])].join("\n")}
                  onChange={e => updateExp(idx, "responsibilities", e.target.value.split("\n").map(s => s.trim()).filter(Boolean))}
                  rows={5}
                  placeholder="Led a team of 6 engineers...&#10;Increased performance by 42%..."
                  className="text-sm"
                />
              </div>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={addExperience} className="w-full border-dashed">
            <Plus className="w-4 h-4 mr-2" />
            Add Role
          </Button>
        </div>
      </AccordionSection>

      {/* Education */}
      <AccordionSection title="Education">
        <div className="space-y-4">
          {data.education.map((edu, idx) => (
            <div key={idx} className="border border-slate-100 rounded-lg p-4 space-y-3 bg-slate-50/30">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Qualification {idx + 1}</span>
                <Button variant="ghost" size="sm" onClick={() => removeEdu(idx)} className="text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5">
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Qualification</label>
                  <Input value={edu.qualification} onChange={e => updateEdu(idx, "qualification", e.target.value)} placeholder="BSc Computer Science" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Institution</label>
                  <Input value={edu.institution} onChange={e => updateEdu(idx, "institution", e.target.value)} placeholder="University of Bristol" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Start Year</label>
                  <Input value={edu.startDate} onChange={e => updateEdu(idx, "startDate", e.target.value)} placeholder="2017" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">End Year</label>
                  <Input value={edu.endDate} onChange={e => updateEdu(idx, "endDate", e.target.value)} placeholder="2020" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Details (Grade, Achievements)</label>
                <Textarea value={edu.details} onChange={e => updateEdu(idx, "details", e.target.value)} rows={2} placeholder="First Class Honours. Thesis on distributed systems." className="text-sm" />
              </div>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={addEducation} className="w-full border-dashed">
            <Plus className="w-4 h-4 mr-2" />
            Add Qualification
          </Button>
        </div>
      </AccordionSection>

      {/* Projects */}
      <AccordionSection title="Projects">
        <div className="space-y-4">
          {data.projects.map((proj, idx) => (
            <div key={idx} className="border border-slate-100 rounded-lg p-4 space-y-3 bg-slate-50/30">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Project {idx + 1}</span>
                <Button variant="ghost" size="sm" onClick={() => removeProj(idx)} className="text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5">
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Project Title</label>
                  <Input value={proj.title} onChange={e => updateProj(idx, "title", e.target.value)} placeholder="My Open-Source Tool" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Link (Optional)</label>
                  <Input value={proj.link || ""} onChange={e => updateProj(idx, "link", e.target.value)} placeholder="example.com/project" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Description</label>
                <Textarea value={proj.description} onChange={e => updateProj(idx, "description", e.target.value)} rows={3} placeholder="A brief description of what you built and its impact." className="text-sm" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Technologies (comma separated)</label>
                <Input value={(proj.technologies || []).join(", ")} onChange={e => updateProj(idx, "technologies", e.target.value.split(",").map(t => t.trim()).filter(Boolean))} placeholder="React, Node.js, TypeScript" />
              </div>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={addProject} className="w-full border-dashed">
            <Plus className="w-4 h-4 mr-2" />
            Add Project
          </Button>
        </div>
      </AccordionSection>

      {/* Certifications */}
      <AccordionSection title="Certifications">
        <div className="space-y-2">
          <p className="text-xs text-slate-400">Enter one certification per line.</p>
          <Textarea
            value={data.certifications.join("\n")}
            onChange={e => update("certifications", e.target.value.split("\n").map(s => s.trim()).filter(Boolean))}
            rows={4}
            placeholder="AWS Certified Solutions Architect (2023)&#10;PMP Certification"
            className="text-sm"
          />
        </div>
      </AccordionSection>

      {/* Additional Sections */}
      <AccordionSection title="Additional Information">
        <div className="space-y-2">
          <p className="text-xs text-slate-400">Volunteering, interests, languages, references statement, etc.</p>
          <Textarea
            value={data.additionalSections}
            onChange={e => update("additionalSections", e.target.value)}
            rows={4}
            placeholder="Volunteer coding instructor at CodeYourFuture..."
            className="text-sm"
          />
        </div>
      </AccordionSection>
    </div>
  );
}
