import { Download, FileText, CheckCircle2 } from "lucide-react";
import { Button } from "../ui/Button";

export interface DownloadButtonsProps {
  onPrintCV: () => void;
  onPrintCL: () => void;
  hasCL: boolean;
  onSaveDraft?: () => void;
  draftSaved?: boolean;
}

export function DownloadButtons({
  onPrintCV,
  onPrintCL,
  hasCL,
  onSaveDraft,
  draftSaved
}: DownloadButtonsProps) {
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
        <Button
          onClick={onPrintCV}
          size="sm"
          className="shadow-sm shadow-blue-600/10"
        >
          <Download className="w-4 h-4 mr-2" />
          Download CV as PDF
        </Button>
        
        {hasCL && (
          <Button
            onClick={onPrintCL}
            size="sm"
            variant="secondary"
            className="border border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
          >
            <FileText className="w-4 h-4 mr-2" />
            Download Cover Letter as PDF
          </Button>
        )}
      </div>
    </div>
  );
}
