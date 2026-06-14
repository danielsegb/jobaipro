export const generatePDF = async (element: HTMLElement | null, filename: string) => {
  if (!element) return;

  // Dynamically import to prevent SSR issues in Next.js
  const html2pdfModule = await import("html2pdf.js");
  const html2pdf = (html2pdfModule.default ? html2pdfModule.default : html2pdfModule) as any;

  const opt = {
    margin: 0,
    filename: filename,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, windowWidth: 1200 },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  };

  await html2pdf().set(opt).from(element).save();
};
