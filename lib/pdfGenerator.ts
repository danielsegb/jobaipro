export const generatePDF = async (element: HTMLElement | null, filename: string) => {
  if (!element) return;

  // Dynamically import to prevent SSR issues in Next.js
  const [html2canvasModule, jspdfModule] = await Promise.all([
    import("html2canvas-pro"),
    import("jspdf"),
  ]);

  // html2canvas-pro has default export, jspdf has named export jsPDF
  const html2canvas = html2canvasModule.default;
  const jsPDF = jspdfModule.jsPDF;

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    windowWidth: 1200,
    logging: false,
  });

  const imgData = canvas.toDataURL("image/jpeg", 0.98);
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const imgWidth = 210; // A4 page width in mm
  const pageHeight = 297; // A4 page height in mm
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  while (heightLeft >= 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  pdf.save(filename);
};
