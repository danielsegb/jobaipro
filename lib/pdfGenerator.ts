export const generatePDF = async (element: HTMLElement | null, filename: string) => {
  if (!element) return;

  // Dynamically import to prevent SSR issues in Next.js
  const html2pdfModule = await import("html2pdf.js");
  const html2pdf = (html2pdfModule.default ? html2pdfModule.default : html2pdfModule) as any;

  const opt = {
    margin: [15, 15], // 15mm margins
    filename: filename,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      windowWidth: 1200,
      logging: false,
      onclone: (clonedDoc: Document) => {
        // Clean up stylesheets by replacing oklch color declarations
        // with standard RGB colors to prevent html2canvas from freezing.
        const styles = clonedDoc.querySelectorAll("style");
        styles.forEach((style) => {
          if (style.innerHTML) {
            let css = style.innerHTML;
            css = css.replace(/oklch\([^)]+\)/g, (match) => {
              const cleaned = match.toLowerCase();
              if (cleaned.includes("0.208") || cleaned.includes("0.1")) return "rgb(15, 23, 42)"; // slate-900
              if (cleaned.includes("0.985") || cleaned.includes("0.9")) return "rgb(248, 250, 252)"; // slate-50
              if (cleaned.includes("0.45") || cleaned.includes("0.5")) return "rgb(100, 116, 139)"; // slate-500
              if (cleaned.includes("0.585") || cleaned.includes("253")) return "rgb(37, 99, 235)"; // blue-600
              return "rgb(30, 41, 59)"; // slate-800
            });
            // Also clean up lab color functions which html2canvas fails to parse
            css = css.replace(/lab\([^)]+\)/g, "rgb(30, 41, 59)");
            style.innerHTML = css;
          }
        });
      }
    },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    pagebreak: { mode: ["css", "legacy"] }
  };

  await html2pdf().set(opt).from(element).save();
};
