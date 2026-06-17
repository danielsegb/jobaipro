/**
 * PDF Generator using html2canvas-pro + jsPDF.
 *
 * html2canvas-pro natively supports modern CSS color functions (oklch, lab, lch, etc.)
 * used by Tailwind CSS v4, so the browser does NOT freeze during rendering.
 *
 * Page splitting logic walks all direct child sections of the element and groups
 * them into pages, ensuring no individual section block is sliced in half.
 */
export const generatePDF = async (
  element: HTMLElement | null,
  filename: string
) => {
  if (!element) return;

  // Dynamically import to avoid SSR issues in Next.js
  const [html2canvasModule, jspdfModule] = await Promise.all([
    import("html2canvas-pro"),
    import("jspdf"),
  ]);

  const html2canvas = html2canvasModule.default as any;
  const { jsPDF } = jspdfModule;

  // A4 dimensions in mm
  const PAGE_W_MM = 210;
  const PAGE_H_MM = 297;
  const MARGIN_MM = 15;
  const CONTENT_W_MM = PAGE_W_MM - MARGIN_MM * 2; // 180mm
  const CONTENT_H_MM = PAGE_H_MM - MARGIN_MM * 2; // 267mm

  // Render the full element to a single hi-res canvas
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: "#ffffff",
    // Render at A4 content width in CSS pixels (at 96 dpi: 180mm → ~680px)
    windowWidth: Math.round((CONTENT_W_MM / 25.4) * 96),
  });

  // px-per-mm ratio on the canvas
  const pxPerMm = canvas.width / CONTENT_W_MM;
  // How many canvas pixels fit in one printable page height
  const pageHeightPx = CONTENT_H_MM * pxPerMm;

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  /**
   * Collect the bottom-edges (in canvas pixels) of every "section-level" child.
   * We use these as candidate split points so we never slice mid-element.
   */
  const elementRect = element.getBoundingClientRect();
  const scaleX = canvas.width / elementRect.width;
  const scaleY = canvas.height / elementRect.height;

  // Gather bottom edges of all direct children (sections/divs)
  const sectionBottoms: number[] = [];
  for (const child of Array.from(element.children)) {
    const r = (child as HTMLElement).getBoundingClientRect();
    const bottomPx = (r.bottom - elementRect.top) * scaleY;
    sectionBottoms.push(bottomPx);
  }
  // Always include the very end
  sectionBottoms.push(canvas.height);

  // Build page slices: group sections until they exceed a page height
  const slices: Array<{ start: number; end: number }> = [];
  let pageStart = 0;

  while (pageStart < canvas.height) {
    let pageEnd = pageStart + pageHeightPx;

    if (pageEnd >= canvas.height) {
      // Last page – just take the rest
      slices.push({ start: pageStart, end: canvas.height });
      break;
    }

    // Find the best break point: the largest section bottom that fits
    // within this page's height. If none fits, we fall back to a hard cut.
    let bestBreak = pageEnd;
    for (const bottom of sectionBottoms) {
      if (bottom > pageStart && bottom <= pageEnd) {
        bestBreak = bottom;
      }
    }

    slices.push({ start: pageStart, end: bestBreak });
    pageStart = bestBreak;
  }

  // Draw each slice onto a new PDF page
  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = canvas.width;

  slices.forEach((slice, idx) => {
    const sliceH = slice.end - slice.start;
    tempCanvas.height = sliceH;

    const ctx = tempCanvas.getContext("2d")!;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, tempCanvas.width, sliceH);
    ctx.drawImage(canvas, 0, -slice.start);

    const imgData = tempCanvas.toDataURL("image/jpeg", 0.95);
    const sliceHeightMm = sliceH / pxPerMm;

    if (idx > 0) pdf.addPage();
    pdf.addImage(imgData, "JPEG", MARGIN_MM, MARGIN_MM, CONTENT_W_MM, sliceHeightMm);
  });

  pdf.save(filename);
};
