import Link from "next/link";
import { FileText, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Điều Khoản Sử Dụng",
  description: "Điều khoản sử dụng website HDC FASHION.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-10 sm:py-16">
      <div className="max-w-3xl mx-auto px-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs text-slate-500 hover:text-brand-600 mb-6 font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Về trang chủ
        </Link>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-lg p-6 sm:p-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-brand-100 text-brand-600 flex items-center justify-center shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#004f5e]">
                Điều Khoản Sử Dụng
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Cập nhật: 01/01/2026
              </p>
            </div>
          </div>

          <div className="max-w-none text-slate-700 space-y-5">
            <section>
              <h2 className="font-extrabold text-[#004f5e] text-base mb-2">
                1. Chấp nhận điều khoản
              </h2>
              <p className="text-sm leading-relaxed">
                Khi truy cập và sử dụng website <strong>hdcfashion.vn</strong>, quý khách
                đồng ý tuân thủ toàn bộ điều khoản được nêu tại đây.
              </p>
            </section>

            <section>
              <h2 className="font-extrabold text-[#004f5e] text-base mb-2">
                2. Quyền sở hữu trí tuệ
              </h2>
              <p className="text-sm leading-relaxed">
                Toàn bộ hình ảnh, thiết kế, nội dung và thương hiệu HDC FASHION thuộc
                quyền sở hữu của HDC GROUP VN. Nghiêm cấm sao chép, sử dụng cho mục đích
                thương mại mà không có sự đồng ý bằng văn bản.
              </p>
            </section>

            <section>
              <h2 className="font-extrabold text-[#004f5e] text-base mb-2">
                3. Trách nhiệm của khách hàng
              </h2>
              <ul className="list-disc pl-5 text-sm space-y-1">
                <li>Cung cấp thông tin chính xác khi đặt hàng</li>
                <li>Không sử dụng website vào mục đích bất hợp pháp</li>
                <li>Không tự ý can thiệp, phá hoại hệ thống</li>
              </ul>
            </section>

            <section>
              <h2 className="font-extrabold text-[#004f5e] text-base mb-2">
                4. Giải quyết tranh chấp
              </h2>
              <p className="text-sm leading-relaxed">
                Mọi tranh chấp phát sinh sẽ được giải quyết thông qua thương lượng. Trường
                hợp không thỏa thuận được, hai bên sẽ đưa vụ việc ra cơ quan có thẩm quyền
                tại Việt Nam.
              </p>
            </section>

            <section>
              <h2 className="font-extrabold text-[#004f5e] text-base mb-2">
                5. Liên hệ
              </h2>
              <p className="text-sm leading-relaxed mb-3">
                Mọi thắc mắc hoặc yêu cầu hỗ trợ pháp lý, quý khách vui lòng liên hệ:
              </p>
              <ul className="space-y-1.5 text-sm text-slate-700">
                <li className="flex items-center gap-2">
                  <span>📞 Hotline / Zalo:</span>
                  <strong className="text-[#004f5e]">0984 95 95 86</strong>
                </li>
                <li className="flex items-center gap-2">
                  <span>✉️ Email hỗ trợ:</span>
                  <strong className="text-[#004f5e]">dongphuchuni@gmail.com</strong>
                </li>
                <li className="flex items-start gap-2">
                  <span className="shrink-0">🏢 Trụ sở chính:</span>
                  <span>LK-17 Dự án Dạ Hợp 6 tầng, Phường Hòa Bình, Tỉnh Hòa Bình</span>
                </li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
