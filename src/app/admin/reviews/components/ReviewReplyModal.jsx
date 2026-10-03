"use client";

import React, { useState } from "react";
import { MessageSquare, Star, X, Check, Sparkles, Send } from "lucide-react";

const TEMPLATES = [
  {
    label: "Cảm ơn & Ghi nhận",
    text: "Dạ HDC Fashion chân thành cảm ơn quý khách đã tin tưởng và đánh giá tích cực! Sự hài lòng của quý khách là động lực to lớn để đội ngũ tiếp tục nâng cao chất lượng sản phẩm & dịch vụ.",
  },
  {
    label: "Hỗ trợ bảo hành / Đổi size",
    text: "Dạ HDC Fashion rất tiếc vì trải nghiệm chưa trọn vẹn của quý khách. Chuyên viên CSKH của HDC sẽ chủ động liên hệ qua số điện thoại để hỗ trợ đổi size miễn phí tận nơi ngay hôm nay ạ!",
  },
  {
    label: "Cam kết chất lượng",
    text: "HDC Fashion cam kết bảo hành 1 đổi 1 trong 30 ngày cho mọi lỗi đường may, sợi vải hay in ấn. Cảm ơn phản hồi quý báu của quý khách để chúng tôi hoàn thiện hơn mỗi ngày.",
  },
];

export default function ReviewReplyModal({ review, onClose, onSubmit }) {
  const [replyText, setReplyText] = useState(review?.adminReply || "");
  const [submitting, setSubmitting] = useState(false);

  if (!review) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    setSubmitting(true);
    try {
      await onSubmit(review.id, replyText.trim());
      onClose();
    } catch (err) {
      console.error("Error submitting review reply:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl space-y-5 relative">
        {/* Nút đóng */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
          aria-label="Đóng popup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Tiêu đề */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-brand-50 border border-brand-200 text-brand-600 flex items-center justify-center shrink-0">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              Phản Hồi Đánh Giá Của Khách Hàng
            </h3>
            <p className="text-xs text-slate-500">
              Câu trả lời sẽ được hiển thị công khai dưới phần đánh giá sản phẩm
            </p>
          </div>
        </div>

        {/* Thông tin đánh giá gốc của khách */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5 text-xs">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-sm">{review.customerName}</span>
              <span className="text-slate-300">•</span>
              <span className="text-brand-600 font-mono font-medium">{review.customerPhone}</span>
            </div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < review.rating
                      ? "text-amber-400 fill-amber-400"
                      : "text-slate-200"
                  }`}
                />
              ))}
              <span className="font-bold text-amber-600 ml-1">{review.rating}.0</span>
            </div>
          </div>

          <div className="text-slate-500 font-medium">
            Sản phẩm: <span className="text-slate-900 font-semibold">{review.productTitle}</span>
          </div>

          <p className="text-slate-700 italic bg-white p-3 rounded-xl border border-slate-200/80">
            &ldquo;{review.content}&rdquo;
          </p>
        </div>

        {/* Gợi ý câu trả lời mẫu */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Gợi ý câu trả lời mẫu:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {TEMPLATES.map((tmpl, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setReplyText(tmpl.text)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 text-xs border border-slate-200 transition-all font-medium"
              >
                {tmpl.label}
              </button>
            ))}
          </div>
        </div>

        {/* Ô nhập phản hồi */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Nội dung phản hồi từ HDC Fashion <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={4}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Nhập nội dung phản hồi gửi tới khách hàng..."
              className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors resize-none shadow-2xs"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              Đóng
            </button>
            <button
              type="submit"
              disabled={submitting || !replyText.trim()}
              className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-sm shadow-brand-600/20 transition-all flex items-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? "Đang gửi..." : "Gửi phản hồi"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
