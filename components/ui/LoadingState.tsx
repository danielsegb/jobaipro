import * as React from "react";

export interface LoadingStateProps {
  message?: string;
  type?: "skeleton" | "spinner" | "cv";
}

export function LoadingState({ message = "Processing your request...", type = "spinner" }: LoadingStateProps) {
  const [dots, setDots] = React.useState(".");

  React.useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "." : prev + "."));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  if (type === "skeleton") {
    return (
      <div className="space-y-4 w-full animate-pulse">
        <div className="h-6 bg-slate-100 rounded-md w-1/4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-slate-100 rounded-md w-3/4"></div>
          <div className="h-4 bg-slate-100 rounded-md w-5/6"></div>
          <div className="h-4 bg-slate-100 rounded-md w-1/2"></div>
        </div>
      </div>
    );
  }

  if (type === "cv") {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-slate-50/50 border border-slate-100 rounded-2xl w-full animate-pulse space-y-6">
        <div className="flex gap-2">
          <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"></div>
        </div>
        <div className="space-y-3 w-full max-w-md">
          <div className="h-4 bg-slate-200 rounded-md mx-auto w-2/3"></div>
          <div className="h-3 bg-slate-200 rounded-md mx-auto w-1/2"></div>
        </div>
        <div className="border border-slate-100 bg-white rounded-xl p-4 w-full max-w-lg space-y-3 shadow-sm">
          <div className="h-3 bg-slate-100 rounded-md w-1/3"></div>
          <div className="h-3 bg-slate-100 rounded-md w-3/4"></div>
          <div className="h-3 bg-slate-100 rounded-md w-2/3"></div>
          <div className="h-3 bg-slate-100 rounded-md w-1/2"></div>
        </div>
        <p className="text-sm font-medium text-slate-500 min-h-[20px] transition-all duration-300">
          {message}{dots}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
      <div className="relative flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-blue-100 animate-spin border-t-blue-600"></div>
      </div>
      <p className="text-sm font-medium text-slate-500">
        {message}{dots}
      </p>
    </div>
  );
}
