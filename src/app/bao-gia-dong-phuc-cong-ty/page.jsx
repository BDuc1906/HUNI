import Link from "next/link";
import ProcessModuleShell from "@/features/process/components/ProcessModuleShell";
import QuotePage from "@/features/process/components/QuotePage";
import { processRelatedLinks } from "@/features/process/data/articles";

export const metadata = {
  title: "Báo Giá Đồng Phục Công Ty",
  description: "Nhận tư vấn và báo giá đồng phục doanh nghiệp theo nhu cầu thực tế từ HDC Fashion.",
};

export default function QuoteRoute() {
  return (
    <ProcessModuleShell>
      <QuotePage />
      <section className="border-t border-slate-200 bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <nav aria-label="Nội dung liên quan">
            <h2 className="text-2xl font-black text-[#004f5e]">Tìm hiểu thêm</h2>
            <div className="mt-5 flex flex-wrap gap-3">
              {processRelatedLinks.quote.map((link) => (
                <Link key={link.href} href={link.href} className="inline-flex min-h-11 items-center rounded-xl border border-brand-200 bg-brand-50 px-4 py-2 text-sm font-bold text-brand-700 transition hover:border-brand-300 hover:bg-brand-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500">
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      </section>
    </ProcessModuleShell>
  );
}
