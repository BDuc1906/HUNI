import Link from "next/link";
import { RefreshCw, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Chính Sách Đổi Trả & Bảo Hành",
  description: "Chính sách đổi trả và bảo hành 30 ngày của HDC FASHION.",
};

export default function ReturnPolicyPage() {
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
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#004f5e]">
                Chính Sách Đổi Trả &amp; Bảo Hành
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Áp dụng từ 01/01/2026
              </p>
            </div>
          </div>

          <div className="max-w-none text-slate-700 space-y-5">
            <section>
              <h2 className="font-extrabold text-[#004f5e] text-base mb-2">
                1. Cam kết bảo hành 1 đổi 1 trong 30 ngày
              </h2>
              <p className="text-sm leading-relaxed">
                HDC cam kết đổi mới miễn phí 100% nếu sản phẩm có bất kỳ lỗi nào:
              </p>
              <ul className="list-disc pl-5 text-sm space-y-1 mt-2">
                <li>Lỗi đường may, sút chỉ, rách sợi</li>
                <li>Sai màu sắc so với mẫu đã duyệt</li>
                <li>Hình in/thêu bị bong tróc</li>
                <li>Kích cỡ sai so với bảng size đã xác nhận</li>
              </ul>
            </section>

            <section>
              <h2 className="font-extrabold text-[#004f5e] text-base mb-2">
                2. Điều kiện đổi trả
              </h2>
              <ul className="list-disc pl-5 text-sm space-y-1">
                <li>Sản phẩm chưa qua sử dụng, chưa qua giặt ủi</li>
                <li>Còn nguyên tem mác, bao bì gốc</li>
                <li>Có hóa đơn hoặc mã đơn hàng đi kèm</li>
                <li>Thời gian trong vòng 30 ngày kể từ ngày nhận hàng</li>
              </ul>
            </section>

            <section>
              <h2 className="font-extrabold text-[#004f5e] text-base mb-2">
                3. Hỗ trợ may bổ sung trọn đời
              </h2>
              <p className="text-sm leading-relaxed">
                Với khách hàng doanh nghiệp đã ký hợp đồng dài hạn, HDC hỗ trợ may bổ sung
                số lượng ít với đơn giá ưu đãi khi có nhân viên mới, áp dụng trọn đời.
              </p>
            </section>

            <section>
              <h2 className="font-extrabold text-[#004f5e] text-base mb-2">
                4. Quy trình đổi trả
              </h2>
              <ol className="list-decimal pl-5 text-sm space-y-1">
                <li>Liên hệ hotline 0984 95 95 86 hoặc Zalo để thông báo</li>
                <li>Cung cấp mã đơn hàng và hình ảnh sản phẩm lỗi</li>
                <li>HDC xác nhận trong vòng 24 giờ</li>
                <li>Nhân viên đến nhận sản phẩm lỗi và giao sản phẩm mới</li>
              </ol>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
