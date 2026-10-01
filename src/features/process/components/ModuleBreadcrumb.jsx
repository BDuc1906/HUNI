import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export default function ModuleBreadcrumb({ current }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="mx-auto flex max-w-7xl items-center gap-1.5 px-4 py-4 text-xs text-slate-500 sm:py-5"
    >
      <Link
        href="/"
        className="inline-flex items-center gap-1 font-medium transition-colors hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
      >
        <Home className="h-3.5 w-3.5" aria-hidden="true" />
        Trang Chủ
      </Link>
      <ChevronRight className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
      <span className="font-semibold text-brand-800" aria-current="page">
        {current}
      </span>
    </nav>
  );
}
