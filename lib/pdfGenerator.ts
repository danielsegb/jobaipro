/**
 * PDF Generator — html2canvas-pro + jsPDF
 *
 * html2canvas-pro natively handles Tailwind v4 colour functions (oklch, lab, lch, color())
 * so the browser never freezes.
 *
 * Page splitting strategy
 * ────────────────────────
 * • Page 1  uses a full A4 height content window (297 mm).
 *   The template's own p-8 padding (≈ 8.5 mm) acts as the top margin.
 * • Pages 2+ reserve TOP_PADDING_MM of white space at the top so every
 *   continuation page has the same breathing room as page 1.
 *   Their content window is therefore (297 − TOP_PADDING_MM) mm.
 *
 * Exclusion zones ensure no .break-inside-avoid block or heading is ever
 * split across a page boundary.
 */

interface Zone  { top: number; bottom: number }
interface Slice { start: number; end: number }

// Top padding added to every continuation page (mm / preview-px counterpart in PagedCVPreview)
const TOP_PADDING_MM = 10;   // ≈ same as template p-8 (8.5 mm)

// ── helpers ────────────────────────────────────────────────────────────────

function buildExclusionZones(
  el: HTMLElement,
  cTop: number,
  sy: number
): Zone[] {
  const zones: Zone[] = [];

  // 1. Every break-inside-avoid block (Tailwind class used in all templates)
  el.querySelectorAll('.break-inside-avoid').forEach((child) => {
    const r = (child as HTMLElement).getBoundingClientRect();
    const top    = (r.top    - cTop) * sy;
    const bottom = (r.bottom - cTop) * sy;
    if (bottom > top + 4) zones.push({ top, bottom });
  });

  // 2. Heading + its immediate next sibling → protects orphaned headings
  el.querySelectorAll('h2, h3').forEach((h) => {
    const next = h.nextElementSibling;
    if (!next) return;
    const hR = h.getBoundingClientRect();
    const nR = next.getBoundingClientRect();
    zones.push({
      top:    (hR.top    - cTop) * sy,
      bottom: Math.min(
        (hR.bottom - cTop) * sy + 50,
        (nR.bottom - cTop) * sy
      ),
    });
  });

  return zones;
}

function collectSafeBreaks(
  el: HTMLElement,
  cTop: number,
  sy: number,
  canvasH: number,
  zones: Zone[]
): number[] {
  const inZone = (p: number) =>
    zones.some((z) => p > z.top + 2 && p < z.bottom - 2);

  const cands = new Set<number>([canvasH]);

  el.querySelectorAll(
    'section, header, .break-inside-avoid, h1, h2, h3, li, p'
  ).forEach((child) => {
    const r = (child as HTMLElement).getBoundingClientRect();
    const top    = Math.round((r.top    - cTop) * sy);
    const bottom = Math.round((r.bottom - cTop) * sy);
    if (top    > 0 && top    < canvasH) cands.add(top);
    if (bottom > 0 && bottom < canvasH) cands.add(bottom);
  });

  return Array.from(cands)
    .filter((p) => p > 0 && p <= canvasH && !inZone(p))
    .sort((a, b) => a - b);
}

/**
 * Build page slices.
 * page1H  – usable canvas pixels for the first page  (full A4 height)
 * pageNH  – usable canvas pixels for pages 2+        (A4 − top-padding)
 */
function buildSlices(
  canvasH: number,
  page1H: number,
  pageNH: number,
  safe: number[]
): Slice[] {
  const slices: Slice[] = [];
  let start   = 0;
  let isFirst = true;

  while (start < canvasH) {
    const pageH    = isFirst ? page1H : pageNH;
    const idealEnd = start + pageH;

    if (idealEnd >= canvasH) {
      slices.push({ start, end: canvasH });
      break;
    }

    let best = -1;
    for (const bp of safe) {
      if (bp > start && bp <= idealEnd) best = bp;
      else if (bp > idealEnd) break;
    }
    if (best <= start || best === -1) best = idealEnd;

    slices.push({ start, end: best });
    start   = best;
    isFirst = false;
  }

  return slices.length > 0 ? slices : [{ start: 0, end: canvasH }];
}

// ── main export ────────────────────────────────────────────────────────────

export const generatePDF = async (
  element: HTMLElement | null,
  filename: string
): Promise<void> => {
  if (!element) return;

  const [h2cMod, jspdfMod] = await Promise.all([
    import('html2canvas-pro'),
    import('jspdf'),
  ]);
  const html2canvas = h2cMod.default as any;
  const { jsPDF }   = jspdfMod;

  // A4 constants (mm)
  const PAGE_W = 210;
  const PAGE_H = 297;

  // Render the full element at ×2 resolution
  const canvas = await html2canvas(element, {
    scale:           2,
    useCORS:         true,
    logging:         false,
    backgroundColor: '#ffffff',
    windowWidth:     element.offsetWidth,
  });

  // 1 mm = canvas.width / 210 canvas-pixels
  const pxPerMm = canvas.width / PAGE_W;

  // Page 1 gets the full A4 height.
  // Pages 2+ lose TOP_PADDING_MM at the top (filled with white in the PDF).
  const page1Hpx = PAGE_H                       * pxPerMm;
  const pageNHpx = (PAGE_H - TOP_PADDING_MM)    * pxPerMm;

  const rect   = element.getBoundingClientRect();
  const cTop   = rect.top;
  const scaleY = canvas.height / rect.height;   // DOM px → canvas px

  // Compute safe page-break positions
  const zones  = buildExclusionZones(element, cTop, scaleY);
  const safe   = collectSafeBreaks(element, cTop, scaleY, canvas.height, zones);
  const slices = buildSlices(canvas.height, page1Hpx, pageNHpx, safe);

  // Render each slice onto its own PDF page
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const tmp = document.createElement('canvas');
  tmp.width = canvas.width;

  slices.forEach((slice, i) => {
    const h = Math.round(slice.end - slice.start);
    tmp.height = h;
    const ctx = tmp.getContext('2d')!;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, tmp.width, h);
    ctx.drawImage(canvas, 0, -slice.start);

    const imgData    = tmp.toDataURL('image/jpeg', 0.95);
    const contentMm  = h / pxPerMm;

    if (i > 0) pdf.addPage();

    if (i === 0) {
      // Page 1 — fill the full page from top edge
      // (the template's own p-8 padding provides the visual top margin)
      pdf.addImage(imgData, 'JPEG', 0, 0, PAGE_W, contentMm);
    } else {
      // Pages 2+ — draw a white top-padding strip, then the content below it.
      // Because pageNHpx already excludes the padding rows, contentMm ≤ 287 mm,
      // so TOP_PADDING_MM + contentMm ≤ 297 mm and nothing overflows.
      pdf.setFillColor(255, 255, 255);
      pdf.rect(0, 0, PAGE_W, TOP_PADDING_MM, 'F');
      pdf.addImage(imgData, 'JPEG', 0, TOP_PADDING_MM, PAGE_W, contentMm);
    }
  });

  pdf.save(filename);
};
