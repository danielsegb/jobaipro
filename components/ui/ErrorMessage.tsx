import * as React from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./Button";

export interface ErrorMessageProps {
  title?: string;
  message: string;
  className?: string;
  onRetry?: () => void;
}

export function ErrorMessage({ title = "An error occurred", message, className, onRetry }: ErrorMessageProps) {
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row gap-4 p-5 rounded-xl border border-red-100 bg-red-50/50 text-red-900 shadow-sm",
        className
      )}
    >
      <div className="flex-shrink-0">
        <AlertCircle className="h-6 w-6 text-red-600" />
      </div>
      <div className="flex-1 space-y-1">
        <h4 className="text-sm font-semibold text-red-900">{title}</h4>
        <p className="text-sm text-red-600/90 leading-relaxed">{message}</p>
        {onRetry && (
          <div className="pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              className="bg-white hover:bg-red-50 border-red-200 text-red-700 hover:text-red-800"
            >
              Try Again
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
