import Link from "next/link";
import { ShieldCheck, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Chính Sách Bảo Mật",
  description: "Chính sách bảo mật thông tin khách hàng của HDC FASHION.",
};

export default function PrivacyPage() {
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
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#004f5e]">
                Chính Sách Bảo Mật
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Cập nhật lần cuối: 01/01/2026
              </p>
            </div>
          </div>

          <div className="max-w-none text-slate-700 space-y-5">
            <section>
              <h2 className="font-extrabold text-[#004f5e] text-base mb-2">
                1. Mục đích thu thập thông tin
              </h2>
              <p className="text-sm leading-relaxed">
                HDC FASHION (thuộc HDC GROUP VN) thu thập thông tin cá nhân của quý khách
                nhằm mục đích tư vấn, báo giá, xử lý đơn hàng may đo đồng phục doanh nghiệp,
                xuất hóa đơn VAT và chăm sóc khách hàng sau bán.
              </p>
            </section>

            <section>
              <h2 className="font-extrabold text-[#004f5e] text-base mb-2">
                2. Phạm vi thông tin thu thập
              </h2>
              <ul className="list-disc pl-5 text-sm space-y-1">
                <li>Họ tên, số điện thoại, email liên hệ</li>
                <li>Tên công ty, mã số thuế, địa chỉ nhận hàng</li>
                <li>Số đo cơ thể (chỉ với đơn hàng may đo riêng)</li>
                <li>Lịch sử đặt hàng và yêu cầu báo giá</li>
              </ul>
            </section>

            <section>
              <h2 className="font-extrabold text-[#004f5e] text-base mb-2">
                3. Cam kết bảo mật
              </h2>
              <p className="text-sm leading-relaxed">
                HDC cam kết <strong>không bán, trao đổi hoặc chia sẻ</strong> thông tin
                khách hàng cho bất kỳ bên thứ ba nào, ngoại trừ trường hợp pháp luật yêu
                cầu. Mọi dữ liệu được lưu trữ trên hệ thống mã hóa an toàn.
              </p>
            </section>

            <section>
              <h2 className="font-extrabold text-[#004f5e] text-base mb-2">
                4. Quyền của khách hàng
              </h2>
              <p className="text-sm leading-relaxed">
                Quý khách có quyền yêu cầu xem, chỉnh sửa hoặc xóa thông tin cá nhân bất
                kỳ lúc nào bằng cách liên hệ hotline <strong>0984 95 95 86</strong> hoặc
                email <strong>dongphuchuni@gmail.com</strong>.
              </p>
            </section>

            <section className="p-4 bg-brand-50 rounded-xl border border-brand-200">
              <p className="text-sm text-slate-700 font-semibold mb-2">
                Mọi thắc mắc về chính sách bảo mật, vui lòng liên hệ:
              </p>
              <ul className="space-y-1 text-sm text-slate-700">
                <li className="flex items-center gap-2">
                  <span>📞 Hotline / Zalo:</span>
                  <strong className="text-[#004f5e]">0984 95 95 86</strong>
                </li>
                <li className="flex items-center gap-2">
                  <span>✉️ Email hỗ trợ:</span>
                  <strong className="text-[#004f5e]">dongphuchuni@gmail.com</strong>
                </li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
