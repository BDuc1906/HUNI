import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Factory,
  Palette,
  PhoneCall,
  Ruler,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { PROCESS_STEPS } from "@/shared/data";
import ModuleBreadcrumb from "./ModuleBreadcrumb";

const iconMap = {
  PhoneCall,
  Palette,
  Ruler,
  Factory,
  CheckCircle2,
};

export default function ProcessLandingPage() {
  return (
    <>
      <ModuleBreadcrumb current="Quy Trình" />

      <section className="relative overflow-hidden bg-[#003843] text-white">
        <div className="absolute inset-0 opacity-25" aria-hidden="true">
          <Image
            src="/images/06_polo_01.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#00222a] via-[#003843]/95 to-[#004f5e]/70" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:py-24">
          <div className="max-w-3xl">
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand-300/40 bg-brand-400/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-brand-200">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              HDC Fashion Production
            </span>
            <h1 className="text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
              QUY TRÌNH MAY ĐỒNG PHỤC
              <span className="mt-2 block text-brand-300">CHUẨN HÓA 5 BƯỚC</span>
            </h1>
            <p className="mt-6 max-w-2xl text-sm leading-7 text-slate-200 sm:text-base">
              Mỗi sản phẩm tại HDC Fashion đều trải qua quy trình kiểm soát chất lượng khắt khe từ khâu chọn sợi dệt, cắt may rập 3D, in thêu vi tính Tajima đến kiểm tra KCS từng mũi chỉ trước khi đóng gói.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/bao-gia-dong-phuc-cong-ty"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-brand-400 px-5 py-3 text-sm font-extrabold text-[#003843] shadow-lg shadow-brand-950/30 transition hover:bg-brand-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Nhận báo giá miễn phí
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <a
                href="tel:0984959586"
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/25 bg-white/5 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Liên hệ tư vấn
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            {[
              ["01", "Thiết kế 3D & may mẫu"],
              ["02", "Kiểm soát KCS từng công đoạn"],
              ["03", "Giao hàng tận nơi toàn quốc"],
              ["04", "Bảo hành 1 đổi 1 trong 30 ngày"],
            ].map(([number, label]) => (
              <div key={number} className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
                <span className="block text-xl font-black text-brand-300">{number}</span>
                <span className="mt-4 block font-bold leading-5 text-slate-100">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <span className="inline-flex rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-brand-700">
              Từ ý tưởng đến thành phẩm
            </span>
            <h2 className="mt-4 text-2xl font-black text-[#004f5e] sm:text-3xl">5 BƯỚC QUY TRÌNH MAY CHUẨN HDC</h2>
            <p className="mt-4 text-sm leading-6 text-slate-600 sm:text-base">
              Mỗi điểm chạm đều có người phụ trách rõ ràng, giúp doanh nghiệp chủ động về mẫu thử, ngân sách và tiến độ.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {PROCESS_STEPS.map((step) => {
              const Icon = iconMap[step.icon] || CheckCircle2;
              return (
                <article
                  key={step.step}
                  className="group flex min-h-72 flex-col rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-brand-300 hover:bg-brand-50 hover:shadow-lg"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-3xl font-black text-brand-500">{step.step}</span>
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-brand-100 bg-white text-brand-700 shadow-sm transition group-hover:bg-brand-500 group-hover:text-white">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                  </div>
                  <h3 className="mt-6 text-base font-extrabold leading-6 text-[#004f5e]">{step.title}</h3>
                  <p className="mt-3 text-xs leading-5 text-slate-600">{step.desc}</p>
                  <span className="mt-auto flex items-center gap-1 border-t border-slate-200 pt-4 text-[11px] font-bold text-brand-700">
                    Cam kết đúng tiến độ
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-[#f6f8ff] py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-14">
          <div className="relative min-h-72 overflow-hidden rounded-3xl bg-brand-900 shadow-xl sm:min-h-96">
            <Image
              src="/images/07_corporate_golf_01.jpg"
              alt="Đồng phục được chuẩn bị kỹ lưỡng tại HDC Fashion"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#00222a]/70 via-transparent" aria-hidden="true" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-brand-200">
                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                Minh bạch từng công đoạn
              </span>
            </div>
          </div>
          <div className="max-w-xl">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600">Quy trình tại HDC</span>
            <h2 className="mt-3 text-2xl font-black leading-tight text-[#004f5e] sm:text-3xl">MAY ĐÚNG MẪU, GIAO ĐÚNG HẸN, PHỤC VỤ DÀI LÂU</h2>
            <p className="mt-5 text-sm leading-7 text-slate-600 sm:text-base">
              Quy trình chuẩn hóa giúp khách hàng hoàn toàn yên tâm về chất lượng mẫu thử, tiến độ giao hàng và dịch vụ hậu mãi.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-slate-700">
              {[
                "Duyệt mẫu thực tế trước khi sản xuất hàng loạt.",
                "Theo dõi mốc tiến độ rõ ràng cùng chuyên viên phụ trách.",
                "Kiểm định KCS, ủi hơi nước và đóng gói cẩn thận trước khi giao.",
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-[#003843] py-16 text-white sm:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h2 className="text-2xl font-black sm:text-3xl">BẠN ĐANG CẦN MAY ĐỒNG PHỤC CHO DOANH NGHIỆP?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-200 sm:text-base">
            Hãy để HDC Fashion đồng hành từ ý tưởng đến sản phẩm hoàn thiện.
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/bao-gia-dong-phuc-cong-ty"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-brand-400 px-5 py-3 text-sm font-extrabold text-[#003843] transition hover:bg-brand-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Nhận báo giá miễn phí
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <a
              href="tel:0984959586"
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/25 px-5 py-3 text-sm font-bold transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Liên hệ tư vấn
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
