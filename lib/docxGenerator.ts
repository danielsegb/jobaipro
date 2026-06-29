import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from "docx";
import { saveAs } from "file-saver";
import { CVData, CoverLetterData } from "./types";

export const generateCVDocx = async (data: CVData, filename: string) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const children: any[] = [];

  // Name and Contact
  children.push(
    new Paragraph({
      text: data.fullName || "Your Name",
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
    })
  );

  const contactText = [data.email, data.phone, data.location, data.linkedin, data.portfolio].filter(Boolean).join(" | ");
  if (contactText) {
    children.push(
      new Paragraph({
        children: [new TextRun(contactText)],
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
      })
    );
  }

  // Profile (professionalSummary)
  if (data.professionalSummary) {
    children.push(
      new Paragraph({
        text: "PROFESSIONAL SUMMARY",
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 400, after: 200 },
      })
    );
    children.push(
      new Paragraph({
        children: [new TextRun(data.professionalSummary)],
        spacing: { after: 400 },
      })
    );
  }

  // Experience
  if (data.experience && data.experience.length > 0) {
    children.push(
      new Paragraph({
        text: "EXPERIENCE",
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 400, after: 200 },
      })
    );

    data.experience.forEach((exp) => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${exp.jobTitle} - ${exp.company}`, bold: true }),
          ],
          spacing: { before: 200 },
        })
      );
      const dates = `${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}`;
      children.push(
        new Paragraph({
          children: [new TextRun({ text: `${dates} | ${exp.location}`, italics: true })],
          spacing: { after: 100 },
        })
      );
      
      if (exp.responsibilities && exp.responsibilities.length > 0) {
        exp.responsibilities.forEach((bullet) => {
          children.push(
            new Paragraph({
              children: [new TextRun(bullet)],
              bullet: { level: 0 },
            })
          );
        });
      }
      
      if (exp.achievements && exp.achievements.length > 0) {
        exp.achievements.forEach((bullet) => {
          children.push(
            new Paragraph({
              children: [new TextRun(bullet)],
              bullet: { level: 0 },
            })
          );
        });
      }
    });
  }

  // Education
  if (data.education && data.education.length > 0) {
    children.push(
      new Paragraph({
        text: "EDUCATION",
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 400, after: 200 },
      })
    );

    data.education.forEach((edu) => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${edu.qualification} - ${edu.institution}`, bold: true }),
          ],
          spacing: { before: 200 },
        })
      );
      const dates = `${edu.startDate} - ${edu.endDate}`;
      children.push(
        new Paragraph({
          children: [new TextRun({ text: `${dates} | ${edu.location}`, italics: true })],
          spacing: { after: 100 },
        })
      );
      if (edu.details) {
        children.push(
          new Paragraph({
            children: [new TextRun(edu.details)],
          })
        );
      }
    });
  }

  // Projects
  if (data.projects && data.projects.length > 0) {
    children.push(
      new Paragraph({
        text: "PROJECTS",
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 400, after: 200 },
      })
    );
    data.projects.forEach((proj) => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: proj.title, bold: true }),
            ...(proj.link ? [new TextRun({ text: ` | ${proj.link}` })] : [])
          ],
          spacing: { before: 200 },
        })
      );
      children.push(
        new Paragraph({
          children: [new TextRun(proj.description)],
          spacing: { after: 100 },
        })
      );
      if (proj.technologies && proj.technologies.length > 0) {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: `Technologies: ${proj.technologies.join(", ")}`, italics: true })],
          })
        );
      }
    });
  }

  // Skills
  if (data.skills && data.skills.length > 0) {
    children.push(
      new Paragraph({
        text: "SKILLS",
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 400, after: 200 },
      })
    );
    children.push(
      new Paragraph({
        children: [new TextRun(data.skills.join(", "))],
      })
    );
  }

  // Certifications
  if (data.certifications && data.certifications.length > 0) {
    children.push(
      new Paragraph({
        text: "CERTIFICATIONS",
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 400, after: 200 },
      })
    );
    data.certifications.forEach((cert) => {
      children.push(
        new Paragraph({
          children: [new TextRun(cert)],
          bullet: { level: 0 },
        })
      );
    });
  }

  // Additional Sections
  if (data.additionalSections) {
    children.push(
      new Paragraph({
        text: "ADDITIONAL INFORMATION",
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 400, after: 200 },
      })
    );
    children.push(
      new Paragraph({
        children: [new TextRun(data.additionalSections)],
      })
    );
  }

  const doc = new Document({
    sections: [{
      properties: {},
      children: children,
    }],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, filename);
};

export const generateCLDocx = async (data: CoverLetterData, filename: string) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const children: any[] = [];

  children.push(
    new Paragraph({
      text: "Cover Letter",
      heading: HeadingLevel.HEADING_1,
      spacing: { after: 400 },
    })
  );

  children.push(
    new Paragraph({
      children: [new TextRun({ text: `To: ${data.recipient || "Hiring Manager"}, ${data.companyName || ""}`, bold: true })],
      spacing: { after: 200 },
    })
  );
  
  if (data.jobTitle) {
    children.push(
      new Paragraph({
        children: [new TextRun({ text: `Re: ${data.jobTitle}`, bold: true })],
        spacing: { after: 400 },
      })
    );
  }

  const paragraphs = data.content.split("\n").filter(p => p.trim().length > 0);
  paragraphs.forEach(p => {
    children.push(
      new Paragraph({
        children: [new TextRun(p)],
        spacing: { after: 200 },
      })
    );
  });

  const doc = new Document({
    sections: [{
      properties: {},
      children: children,
    }],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, filename);
};
