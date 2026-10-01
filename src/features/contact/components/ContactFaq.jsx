"use client";

import React, { useState } from "react";
import { HelpCircle, ChevronDown, Sparkles } from "lucide-react";

const CONTACT_FAQS = [
  {
    q: "HDC có hỗ trợ may áo mẫu thử thật trước khi đặt may số lượng lớn không? Chi phí thế nào?",
    a: "HDC FASHION tài trợ 100% chi phí thiết kế 3D và may áo mẫu thử (0 đồng). Áo mẫu được thêu/in logo công ty chuẩn xác, may đúng chất liệu vải bạn đã chọn để ban lãnh đạo và nhân viên trực tiếp mặc thử, duyệt form dáng và đường kim mũi chỉ trước khi tiến hành may hàng loạt.",
  },
  {
    q: "Doanh nghiệp có nhu cầu may đo cho từng nhân sự, HDC có cử thợ may đến tận nơi đo không?",
    a: "Có. Với các đơn hàng đồng phục công sở, vest lãnh đạo hoặc số lượng nhân sự lớn, HDC luôn sẵn sàng cử chuyên viên và thợ may hơn 15 năm kinh nghiệm đến tận trụ sở văn phòng của quý công ty để tư vấn chất liệu, cho nhân viên thử phom và lấy số đo chi tiết cho từng người.",
  },
  {
    q: "Số lượng tối thiểu (MOQ) cho 1 đơn hàng may theo yêu cầu là bao nhiêu áo?",
    a: "HDC nhận sản xuất từ 20 áo trở lên cho các mẫu thiết kế riêng theo nhận diện thương hiệu. Với các đơn hàng số lượng lớn (từ 100 đến 10.000+ sản phẩm), chúng tôi áp dụng chính sách chiết khấu giá sỉ tận xưởng cực kỳ ưu đãi.",
  },
  {
    q: "Thời gian may mẫu và tiến độ giao hàng thông thường mất bao lâu?",
    a: "Thời gian may áo mẫu thử từ 2 - 3 ngày làm việc. Thời gian sản xuất và hoàn thiện đơn hàng dao động từ 5 - 10 ngày tùy thuộc vào số lượng và độ phức tạp của thiết kế. Trong trường hợp doanh nghiệp cần gấp cho sự kiện, team building hay khai trương, HDC có chuyền may hỏa tốc đáp ứng trong 48 - 72 giờ.",
  },
  {
    q: "Công ty tôi cần hợp đồng kinh tế và hóa đơn GTGT (VAT) thì thủ tục thế nào?",
    a: "HDC GROUP VN là pháp nhân doanh nghiệp đầy đủ tính pháp lý. Mọi đơn hàng đều được ký kết hợp đồng kinh tế rõ ràng, bảo vệ quyền lợi hai bên và xuất hóa đơn điện tử VAT hợp lệ gửi qua email ngay sau khi nghiệm thu giao nhận hàng hóa.",
  },
  {
    q: "Chính sách bảo hành và đổi trả của HDC được thực hiện ra sao?",
    a: "Chúng tôi áp dụng chính sách bảo hành 1 ĐỔI 1 trong 30 ngày cho mọi sản phẩm phát sinh lỗi kỹ thuật từ phía nhà sản xuất (lỗi đường may, sai màu sắc thỏa thuận, bung cúc, lỗi hình thêu/in). Ngoài ra, HDC hỗ trợ sửa chữa hoặc may bổ sung số lượng nhỏ cho nhân sự mới trong suốt vòng đời đồng phục.",
  },
];

export default function ContactFaq() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleAccordion = (idx) => {
    setOpenIndex((prev) => (prev === idx ? -1 : idx));
  };

  return (
    <section className="py-14 sm:py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 sm:mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5 text-brand-600" />
            Giải Đáp Thắc Mắc Thường Gặp
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#004f5e]">
            CÂU HỎI KHI ĐẶT MAY &amp; LIÊN HỆ HDC
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm md:text-base">
            Tổng hợp những câu hỏi phổ biến nhất của các phòng Mua hàng, Nhân sự và Ban lãnh đạo khi
            chuẩn bị may đồng phục doanh nghiệp.
          </p>
        </div>

        <div className="space-y-3">
          {CONTACT_FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden transition-all duration-200 shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(idx)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-bold text-slate-800 hover:text-brand-600 transition-colors text-xs sm:text-sm md:text-base"
                >
                  <span className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-brand-50 text-brand-700 text-xs flex items-center justify-center shrink-0 font-bold border border-brand-200">
                      {idx + 1}
                    </span>
                    <span>{faq.q}</span>
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-brand-600 shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-slate-600 text-xs sm:text-sm leading-relaxed border-t border-slate-100 bg-slate-50/50">
                    <p className="pl-9">{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
