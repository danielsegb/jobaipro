import Link from "next/link";
import { Sparkles } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-50 border-t border-slate-100 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-600/10">
                <Sparkles className="w-4.5 h-4.5 fill-current" />
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-900">
                Job AI <span className="text-blue-600">Pro</span>
              </span>
            </Link>
            <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
              Create highly tailored, ATS-friendly CVs and cover letters customized for any job description in minutes using AI.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Product</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/optimise" className="text-slate-600 hover:text-blue-600 transition-colors">
                  CV Optimiser
                </Link>
              </li>
              <li>
                <Link href="/optimise" className="text-slate-600 hover:text-blue-600 transition-colors">
                  Cover Letter Generator
                </Link>
              </li>
              <li>
                <Link href="/optimise" className="text-slate-600 hover:text-blue-600 transition-colors">
                  ATS Checker
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Resources</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/privacy" className="text-slate-600 hover:text-blue-600 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-slate-600 hover:text-blue-600 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <a
                  href="https://danielse.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-600 hover:text-blue-600 transition-colors"
                >
                  About & Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Panel */}
        <div className="mt-12 pt-8 border-t border-slate-200/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            © 2026 Job AI Pro. All rights reserved. Built by <a href="https://danielse.com/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors font-medium">DANIELSE</a>
          </p>
          <p>Designed for professional excellence.</p>
        </div>
      </div>
    </footer>
  );
}
