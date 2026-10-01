import { CheckCircle2, Clock3, FileCheck2, PhoneCall, ShieldCheck } from "lucide-react";
import ModuleBreadcrumb from "./ModuleBreadcrumb";
import QuoteForm from "./QuoteForm";

export default function QuotePage() {
  return (
    <>
      <ModuleBreadcrumb current="Báo Giá Đồng Phục" />
      <section className="border-y border-brand-900/10 bg-gradient-to-br from-[#003843] via-[#004f5e] to-brand-700 text-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-18 lg:py-20">
          <span className="inline-flex rounded-full border border-brand-300/40 bg-brand-400/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-brand-100">Báo giá theo nhu cầu thực tế</span>
          <h1 className="mt-4 max-w-3xl text-3xl font-black leading-tight sm:text-4xl">BÁO GIÁ ĐỒNG PHỤC CÔNG TY</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-200 sm:text-base">Nhận tư vấn và báo giá phù hợp với nhu cầu doanh nghiệp của bạn.</p>
        </div>
      </section>

      <section className="bg-[#f6f8ff] py-12 sm:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[.8fr_1.2fr] lg:items-start">
          <aside className="rounded-3xl bg-[#003843] p-6 text-white shadow-xl sm:p-8 lg:sticky lg:top-36">
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-brand-300">HDC Fashion hỗ trợ</span>
            <h2 className="mt-3 text-2xl font-black leading-tight">NHẬN PHƯƠNG ÁN PHÙ HỢP, KHÔNG CHỈ LÀ MỘT MỨC GIÁ</h2>
            <p className="mt-4 text-sm leading-6 text-slate-200">Chuyên viên sẽ dựa trên số lượng, chất liệu và yêu cầu nhận diện để tư vấn cấu hình tối ưu cho doanh nghiệp.</p>
            <ul className="mt-6 space-y-4 text-sm">
              {[
                [FileCheck2, "Phối cảnh 2D/3D theo bộ nhận diện"],
                [Clock3, "Tư vấn tiến độ và lịch may mẫu thử"],
                [ShieldCheck, "Kiểm soát chất lượng KCS trước khi giao"],
              ].map(([Icon, text]) => (
                <li key={text} className="flex gap-3 text-slate-100"><Icon className="mt-0.5 h-5 w-5 shrink-0 text-brand-300" aria-hidden="true" /><span>{text}</span></li>
              ))}
            </ul>
            <div className="mt-8 border-t border-white/10 pt-5">
              <a href="tel:0984959586" className="inline-flex items-center gap-2 text-sm font-extrabold text-brand-200 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"><PhoneCall className="h-4 w-4" aria-hidden="true" />Hotline: 0984.959.586</a>
            </div>
          </aside>
          <QuoteForm />
        </div>
        <p className="mx-auto mt-6 flex max-w-7xl items-center gap-2 px-4 text-xs text-slate-500 sm:px-6"><CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />HDC Fashion chỉ hiển thị trạng thái thành công sau khi hệ thống báo giá tiếp nhận yêu cầu.</p>
      </section>
    </>
  );
}
