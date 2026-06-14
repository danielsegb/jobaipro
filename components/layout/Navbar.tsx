import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Button } from "../ui/Button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-100 bg-white/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 transition-transform duration-200 active:scale-[0.98]">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-600/10">
            <Sparkles className="w-5 h-5 fill-current" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            Job AI <span className="text-blue-600">Pro</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-500">
          <Link href="/" className="hover:text-slate-900 transition-colors">
            Home
          </Link>
          <Link href="/optimise" className="hover:text-slate-900 transition-colors">
            Optimise CV
          </Link>
          <Link href="/optimise?step=1" className="hover:text-slate-900 transition-colors">
            Upload
          </Link>
          <a
            href="https://github.com/danielsegb/jobaipro"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-slate-900 transition-colors"
          >
            GitHub
          </a>
        </nav>

        {/* CTA Button */}
        <div className="flex items-center gap-4">
          <Link href="/optimise">
            <Button size="sm" className="hidden sm:inline-flex shadow-sm">
              Optimise My CV
            </Button>
          </Link>
          <Link href="/optimise" className="sm:hidden">
            <Button size="sm">Optimise</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
