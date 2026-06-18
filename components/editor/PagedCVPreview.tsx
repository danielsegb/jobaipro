'use client';

/**
 * PagedCVPreview
 *
 * Renders the CV as a series of true A4 page cards so the live preview
 * matches the downloaded PDF layout.
 *
 * Strategy:
 *  1. Render the template once in a hidden off-screen div at exactly 794 px
 *     (210 mm at 96 dpi — the same width used by the PDF generator).
 *  2. After fonts/images settle (≈ 350 ms), collect every .break-inside-avoid
 *     block and heading, build exclusion zones, then find the optimal page
 *     boundaries using the same algorithm as pdfGenerator.ts.
 *  3. Display each page as a separate card.  The template is rendered inside
 *     each card and clipped via overflow:hidden + CSS transform so only the
 *     correct slice is visible — no canvas required.
 */

import React, { useRef, useState, useLayoutEffect } from 'react';
import { CVData, TemplateStyle } from '@/lib/types';
import { ClassicATS }          from '../templates/ClassicATS';
import { ModernProfessional }  from '../templates/ModernProfessional';
import { TechMinimal }         from '../templates/TechMinimal';
import { HealthcareNHS }       from '../templates/HealthcareNHS';
import { Graduate }            from '../templates/Graduate';

// A4 at 96 dpi
const A4W = 794;   // px
const A4H = 1123;  // px

/**
 * Top padding reserved at the top of every continuation page (≈ 10 mm at 96 dpi).
 * Must match TOP_PADDING_MM in pdfGenerator.ts  (10 mm × 3.779 px/mm ≈ 38 px).
 */
const TOP_PADDING_PX = 38;

interface Slice { start: number; end: number }

// ── Template renderer ──────────────────────────────────────────────────────
function Template({ data, style }: { data: CVData; style: TemplateStyle }) {
  switch (style) {
    case 'modern':     return <ModernProfessional data={data} />;
    case 'tech':       return <TechMinimal data={data} />;
    case 'healthcare': return <HealthcareNHS data={data} />;
    case 'graduate':   return <Graduate data={data} />;
    default:           return <ClassicATS data={data} />;
  }
}

// ── Pagination logic (mirrors pdfGenerator boundary detection) ─────────────
function paginate(el: HTMLElement): Slice[] {
  const totalH = el.scrollHeight;
  if (!totalH) return [];

  const cTop = el.getBoundingClientRect().top;

  // Build exclusion zones
  const zones: { top: number; bottom: number }[] = [];

  el.querySelectorAll('.break-inside-avoid').forEach((child) => {
    const r = (child as HTMLElement).getBoundingClientRect();
    const top    = r.top    - cTop;
    const bottom = r.bottom - cTop;
    if (bottom > top + 4) zones.push({ top, bottom });
  });

  el.querySelectorAll('h2, h3').forEach((h) => {
    const next = h.nextElementSibling;
    if (!next) return;
    const hR = h.getBoundingClientRect();
    const nR = next.getBoundingClientRect();
    zones.push({
      top:    hR.top  - cTop,
      bottom: Math.min(hR.bottom - cTop + 80, nR.bottom - cTop),
    });
  });

  const inZone = (p: number) =>
    zones.some((z) => p > z.top + 2 && p < z.bottom - 2);

  // Collect safe break candidates
  const cands = new Set<number>([totalH]);
  el.querySelectorAll('section, header, .break-inside-avoid, li, p').forEach((c) => {
    const r = (c as HTMLElement).getBoundingClientRect();
    const top    = Math.round(r.top    - cTop);
    const bottom = Math.round(r.bottom - cTop);
    if (top    > 0 && top    < totalH) cands.add(top);
    if (bottom > 0 && bottom < totalH) cands.add(bottom);
  });

  const safe = Array.from(cands)
    .filter((p) => p > 0 && p <= totalH && !inZone(p))
    .sort((a, b) => a - b);

  // Build slices —
  //   Page 1 : full A4H (template's p-8 is the visual top margin)
  //   Pages 2+: A4H − TOP_PADDING_PX  (the padding is shown as white space in the card)
  const slices: Slice[] = [];
  let start   = 0;
  let isFirst = true;

  while (start < totalH) {
    const pageH    = isFirst ? A4H : A4H - TOP_PADDING_PX;
    const idealEnd = start + pageH;

    if (idealEnd >= totalH) {
      slices.push({ start, end: totalH });
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

  return slices.length > 0 ? slices : [{ start: 0, end: totalH }];
}

// ── Component ──────────────────────────────────────────────────────────────
export interface PagedCVPreviewProps {
  data: CVData;
  templateStyle: TemplateStyle;
}

export function PagedCVPreview({ data, templateStyle }: PagedCVPreviewProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const [slices, setSlices]       = useState<Slice[] | null>(null);
  const [displayW, setDisplayW]   = useState(600);

  useLayoutEffect(() => {
    // Capture wrapper width immediately (before paint)
    if (wrapperRef.current) setDisplayW(wrapperRef.current.offsetWidth || 600);

    // Delay measurement so fonts + images are rendered
    const t = setTimeout(() => {
      const m = measureRef.current;
      if (!m) return;
      setSlices(paginate(m));
    }, 350);

    return () => clearTimeout(t);
  }, [data, templateStyle]);

  // Scale factor: measurement is at A4W (794 px); display is at displayW
  const scale = displayW / A4W;

  return (
    <div ref={wrapperRef} className="w-full">
      {/* ── Offscreen measurement div at true A4 width ── */}
      <div
        ref={measureRef}
        aria-hidden="true"
        style={{
          position:      'fixed',
          left:          '-9999px',
          top:           '0',
          width:         A4W,
          visibility:    'hidden',
          pointerEvents: 'none',
          zIndex:        -1,
        }}
      >
        <Template data={data} style={templateStyle} />
      </div>

      {/* ── Visible pages (or loading fallback) ── */}
      {slices ? (
        <div className="flex flex-col gap-4">
          {slices.map((slice, idx) => {
            const isFirst = idx === 0;

            // 1. Outer page container dimensions
            const pageCardH = slices.length === 1 
              ? Math.round((slice.end - slice.start) * scale)
              : Math.round(A4H * scale);

            // 2. Viewport dimensions & positioning
            const topPaddingDisplay = isFirst ? 0 : Math.round(TOP_PADDING_PX * scale);
            const viewportHeightDisplay = Math.round((slice.end - slice.start) * scale);

            return (
              <div key={`cv-page-${idx}`}>
                {slices.length > 1 && (
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="flex-1 h-px bg-slate-200" />
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                      Page {idx + 1} of {slices.length}
                    </span>
                    <div className="flex-1 h-px bg-slate-200" />
                  </div>
                )}

                {/* 1. Outer page container */}
                <div
                  className="bg-white shadow-md border border-slate-200"
                  style={{
                    position: 'relative',
                    width: displayW,
                    height: pageCardH,
                    overflow: 'hidden', // Hides anything bleeding past the bottom of the A4 card
                  }}
                >
                  {/* 2. Inner content viewport */}
                  <div
                    style={{
                      position: 'absolute',
                      top: topPaddingDisplay,
                      left: 0,
                      width: displayW,
                      height: viewportHeightDisplay,
                      overflow: 'hidden', // Strictly clips the content to exactly the slice height
                      background: 'white',
                    }}
                  >
                    {/* 3. Full CV content wrapper */}
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: A4W,
                        transform: `translateY(${-slice.start}px) scale(${scale})`,
                        transformOrigin: 'top left',
                      }}
                    >
                      <Template data={data} style={templateStyle} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Fallback while measurement is in progress */
        <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-slate-100">
          <Template data={data} style={templateStyle} />
        </div>
      )}
    </div>
  );
}
