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

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const margin = 15; // 15mm margin on all sides
  const printableWidth = 210 - (margin * 2); // 180mm
  const printableHeight = 297 - (margin * 2); // 267mm

  const scale = printableWidth / canvas.width;
  const pxPageHeight = printableHeight / scale;

  let canvasY = 0;
  let pageCount = 0;

  while (canvasY < canvas.height) {
    const chunkHeight = Math.min(pxPageHeight, canvas.height - canvasY);

    // Create a temporary canvas for this page chunk
    const pageCanvas = document.createElement("canvas");
    pageCanvas.width = canvas.width;
    pageCanvas.height = chunkHeight;

    const ctx = pageCanvas.getContext("2d");
    if (ctx) {
      // Draw the slice of the main canvas onto the page canvas
      ctx.drawImage(
        canvas,
        0,
        canvasY,
        canvas.width,
        chunkHeight,
        0,
        0,
        canvas.width,
        chunkHeight
      );
    }

    const pageImgData = pageCanvas.toDataURL("image/jpeg", 0.98);

    if (pageCount > 0) {
      pdf.addPage();
    }

    const destHeight = chunkHeight * scale;
    pdf.addImage(pageImgData, "JPEG", margin, margin, printableWidth, destHeight);

    canvasY += chunkHeight;
    pageCount++;
  }

  pdf.save(filename);
};
