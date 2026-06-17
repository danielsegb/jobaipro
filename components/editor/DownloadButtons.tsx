import { Download, FileText, CheckCircle2, FileJson, FileType2 } from "lucide-react";
import { Button } from "../ui/Button";
import { CVData, CoverLetterData } from "@/lib/types";
import { generatePDF } from "@/lib/pdfGenerator";
import { generateCVDocx, generateCLDocx } from "@/lib/docxGenerator";

export interface DownloadButtonsProps {
  cvData: CVData;
  coverLetterData?: CoverLetterData;
  cvRef: React.RefObject<HTMLDivElement | null>;
  clRef: React.RefObject<HTMLDivElement | null>;
  hasCL: boolean;
  onSaveDraft?: () => void;
  draftSaved?: boolean;
}

export function DownloadButtons({
  cvData,
  coverLetterData,
  cvRef,
  clRef,
  hasCL,
  onSaveDraft,
  draftSaved
}: DownloadButtonsProps) {
  
  const handleDownloadCVPdf = async () => {
    if (cvRef.current) {
      const filename = `${cvData.fullName || 'CV'}_CV.pdf`;
      await generatePDF(cvRef.current, filename);
    }
  };

  const handleDownloadCVDocx = async () => {
    const filename = `${cvData.fullName || 'CV'}_CV.docx`;
    await generateCVDocx(cvData, filename);
  };

  const handleDownloadCLPdf = async () => {
    if (clRef.current && coverLetterData) {
      const filename = `${cvData.fullName || 'Cover_Letter'}_CL.pdf`;
      await generatePDF(clRef.current, filename);
    }
  };

  const handleDownloadCLDocx = async () => {
    if (coverLetterData) {
      const filename = `${cvData.fullName || 'Cover_Letter'}_CL.docx`;
      await generateCLDocx(coverLetterData, filename);
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-50 border border-slate-100 p-4 rounded-xl shadow-sm">
      <div className="flex items-center gap-3">
        {onSaveDraft && (
          <Button
            variant="outline"
            size="sm"
            onClick={onSaveDraft}
            className="bg-white border-slate-200"
          >
            {draftSaved ? (
              <>
                <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 mr-2" />
                Draft Saved
              </>
            ) : (
              "Save Draft"
            )}
          </Button>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* CV Download Group */}
        <div className="relative group">
          <Button
            size="sm"
            className="shadow-sm shadow-blue-600/10 cursor-default"
          >
            <Download className="w-4 h-4 mr-2" />
            Download CV
          </Button>
          
          <div className="absolute right-0 top-full pt-1 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            <div className="bg-white border border-slate-200 rounded-lg shadow-lg p-1 flex flex-col gap-1">
              <button 
                onClick={handleDownloadCVPdf}
                className="flex items-center w-full px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md transition-colors"
              >
                <FileJson className="w-4 h-4 mr-2 text-red-500" />
                As PDF
              </button>
              <button 
                onClick={handleDownloadCVDocx}
                className="flex items-center w-full px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md transition-colors"
              >
                <FileType2 className="w-4 h-4 mr-2 text-blue-500" />
                As Word (.docx)
              </button>
            </div>
          </div>
        </div>
        
        {/* CL Download Group */}
        {hasCL && coverLetterData && (
          <div className="relative group">
            <Button
              size="sm"
              variant="secondary"
              className="border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 cursor-default"
            >
              <FileText className="w-4 h-4 mr-2" />
              Download Cover Letter
            </Button>

            <div className="absolute right-0 top-full pt-1 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="bg-white border border-slate-200 rounded-lg shadow-lg p-1 flex flex-col gap-1">
                <button 
                  onClick={handleDownloadCLPdf}
                  className="flex items-center w-full px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md transition-colors"
                >
                  <FileJson className="w-4 h-4 mr-2 text-red-500" />
                  As PDF
                </button>
                <button 
                  onClick={handleDownloadCLDocx}
                  className="flex items-center w-full px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md transition-colors"
                >
                  <FileType2 className="w-4 h-4 mr-2 text-blue-500" />
                  As Word (.docx)
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
