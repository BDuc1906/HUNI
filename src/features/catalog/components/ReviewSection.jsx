"use client";

// ==================================================
// src/features/catalog/components/ReviewSection.jsx
// Hệ thống đánh giá & phản hồi sản phẩm thực tế (Prompt C)
// ==================================================

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Star,
  MessageSquare,
  ShieldCheck,
  Send,
  Loader2,
  CheckCircle,
  AlertCircle,
  User,
} from "lucide-react";

export default function ReviewSection({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(5.0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [canReview, setCanReview] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Form state
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);

  const fetchReviews = useCallback(async () => {
    if (!productId) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/reviews?productId=${encodeURIComponent(productId)}`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews || []);
        setAvgRating(data.avgRating ?? 5.0);
        setTotal(data.total ?? 0);
        setCanReview(Boolean(data.canReview));
        setIsAuthenticated(Boolean(data.isAuthenticated));
      }
    } catch (err) {
      console.error("Lỗi khi tải đánh giá:", err);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() || content.trim().length < 5) {
      setErrorMsg("Vui lòng nhập nội dung đánh giá từ 5 ký tự trở lên.");
      return;
    }

    try {
      setSubmitting(true);
      setErrorMsg("");
      setSuccessMsg("");

      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          rating,
          content: content.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Gửi đánh giá không thành công.");
      } else {
        setSuccessMsg("Cảm ơn bạn! Đánh giá đã được ghi nhận thành công.");
        setContent("");
        setIsFormOpen(false);
        // Cập nhật danh sách đánh giá
        fetchReviews();
      }
    } catch (err) {
      console.error("Lỗi submit review:", err);
      setErrorMsg("Đã có lỗi kết nối mạng. Vui lòng thử lại sau.");
    } finally {
      setSubmitting(false);
    }
  };

  // Helper render sao
  const renderStars = (score, max = 5, sizeClass = "w-4 h-4") => {
    return (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: max }).map((_, i) => {
          const filled = i < Math.floor(score);
          const half = !filled && i < score;
          return (
            <Star
              key={i}
              className={`${sizeClass} ${
                filled
                  ? "fill-amber-400 text-amber-400"
                  : half
                  ? "fill-amber-300 text-amber-300"
                  : "fill-slate-100 text-slate-300"
              }`}
            />
          );
        })}
      </div>
    );
  };

  // Helper lấy 2 chữ cái đầu làm avatar
  const getInitials = (name) => {
    if (!name) return "KH";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <div className="border border-slate-200 rounded-2xl bg-white p-4 sm:p-5 shadow-sm space-y-4">
      {/* Header & Tổng quan điểm số */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-amber-600" />
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              Đánh giá từ khách hàng ({total})
            </h3>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xl font-black text-amber-600">
              {avgRating.toFixed(1)}
            </span>
            {renderStars(avgRating, 5, "w-3.5 h-3.5")}
            <span className="text-xs text-slate-500 font-medium">
              (Dựa trên {total} lượt đánh giá thực tế)
            </span>
          </div>
        </div>

        {/* Nút mở form đánh giá */}
        <div>
          {canReview ? (
            <button
              onClick={() => setIsFormOpen(!isFormOpen)}
              className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95"
            >
              {isFormOpen ? "Đóng form" : "✍️ Viết đánh giá"}
            </button>
          ) : !isAuthenticated ? (
            <Link
              href="/login"
              className="text-xs font-semibold text-amber-700 hover:text-amber-800 underline inline-flex items-center gap-1"
            >
              <User className="w-3.5 h-3.5" />
              Đăng nhập để đánh giá
            </Link>
          ) : (
            <span className="text-[11px] text-slate-500 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg inline-flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              Chỉ khách đã đặt may mới có thể đánh giá
            </span>
          )}
        </div>
      </div>

      {/* Thông báo thành công / lỗi */}
      {successMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Form đánh giá khi canReview và isFormOpen */}
      {canReview && isFormOpen && (
        <form
          onSubmit={handleSubmit}
          className="p-3.5 sm:p-4 bg-amber-50/60 rounded-xl border border-amber-200/80 space-y-3"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-xs font-bold text-slate-800">
              Chất lượng sản phẩm & Dịch vụ:
            </span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1.5 touch-manipulation min-w-[34px] min-h-[34px] flex items-center justify-center transition-transform active:scale-125 focus:outline-none"
                >
                  <Star
                    className={`w-5 h-5 ${
                      (hoverRating || rating) >= star
                        ? "fill-amber-400 text-amber-400"
                        : "fill-slate-100 text-slate-300"
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs font-bold text-amber-800 ml-1.5 whitespace-nowrap">
                {hoverRating || rating}/5 sao
              </span>
            </div>
          </div>

          <div>
            <textarea
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Chia sẻ trải nghiệm thực tế về chất vải, đường may, form áo, độ bền và tiến độ giao hàng..."
              className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 resize-none"
            />
          </div>

          {errorMsg && (
            <div className="text-xs text-red-600 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-1.5 bg-[#071b34] hover:bg-[#0a254a] text-amber-300 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Đang gửi...
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  Gửi đánh giá
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Danh sách các đánh giá */}
      {loading ? (
        <div className="py-6 flex items-center justify-center gap-2 text-slate-400 text-xs">
          <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
          <span>Đang tải đánh giá sản phẩm...</span>
        </div>
      ) : reviews.length === 0 ? (
        <div className="py-5 text-center text-slate-400 text-xs bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
          Chưa có đánh giá nào cho sản phẩm này. Hãy là người đầu tiên trải nghiệm và chia sẻ!
        </div>
      ) : (
        <div className="space-y-3 divide-y divide-slate-100">
          {reviews.map((rev) => (
            <div key={rev.id} className="pt-3 first:pt-0 space-y-1.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2">
                <div className="flex items-center gap-2.5">
                  {/* Initials Avatar */}
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-white font-bold text-[11px] flex items-center justify-center shadow-xs shrink-0">
                    {getInitials(rev.user?.name)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold text-xs text-slate-800">
                        {rev.user?.name || "Khách hàng"}
                      </span>
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 font-semibold flex items-center gap-0.5">
                        <ShieldCheck className="w-2.5 h-2.5" /> Đã đặt may
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {new Date(rev.createdAt).toLocaleDateString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                </div>

                {/* Rating stars */}
                <div className="pl-9 sm:pl-0">{renderStars(rev.rating, 5, "w-3 h-3")}</div>
              </div>

              {/* Review Content */}
              <p className="text-xs text-slate-600 leading-relaxed pl-0 sm:pl-9 mt-1 sm:mt-0">
                {rev.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
