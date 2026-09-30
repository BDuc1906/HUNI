// ==================================================
// src/server/vouchers.js
// Quản lý voucher server-side — KHÔNG tin client
// Sau này có thể chuyển sang Prisma model Voucher
// ==================================================

/**
 * Cấu trúc voucher:
 * - code: Mã voucher (chữ HOA)
 * - type: "percent" | "fixed"
 * - value: 5 (nếu percent) hoặc 200000 (nếu fixed)
 * - minSubtotal: Đơn tối thiểu để áp dụng
 * - maxDiscount: Trần giảm giá tối đa
 * - expiresAt: Ngày hết hạn
 * - active: Bật/tắt voucher
 * - description: Mô tả ngắn cho khách
 */
const VOUCHERS = [
  {
    code: "HUNI2026",
    type: "percent",
    value: 5,
    minSubtotal: 0,
    maxDiscount: 5_000_000,
    expiresAt: new Date("2026-12-31T23:59:59"),
    active: true,
    description: "Giảm 5% toàn bộ đơn hàng",
    label: "Giảm 5% toàn bộ đơn hàng",
  },
  {
    code: "DOANHNGHIEP",
    type: "fixed",
    value: 200_000,
    minSubtotal: 5_000_000,
    maxDiscount: 200_000,
    expiresAt: new Date("2026-12-31T23:59:59"),
    active: true,
    description: "Tặng 200.000đ may mẫu thử (đơn từ 5 triệu)",
    label: "Tặng 200.000đ may mẫu thử",
  },
];

// ==================================================
// Tìm voucher theo mã (đã normalize)
// ==================================================
export function getVoucher(code) {
  if (!code) return null;
  const normalized = String(code).trim().toUpperCase();
  return VOUCHERS.find((v) => v.code === normalized) || null;
}

// ==================================================
// Validate voucher + tính số tiền giảm giá chính xác
// Trả về: { valid, voucher?, discount?, reason? }
// ==================================================
export function validateVoucher(code, subtotal) {
  if (!code) {
    return { valid: false, reason: "Vui lòng nhập mã ưu đãi" };
  }

  const voucher = getVoucher(code);
  if (!voucher) {
    return { valid: false, reason: "Mã ưu đãi không hợp lệ" };
  }

  if (!voucher.active) {
    return { valid: false, reason: "Mã ưu đãi đã bị vô hiệu hóa" };
  }

  if (voucher.expiresAt < new Date()) {
    return { valid: false, reason: "Mã ưu đãi đã hết hạn" };
  }

  if (subtotal < voucher.minSubtotal) {
    return {
      valid: false,
      reason: `Đơn hàng tối thiểu ${voucher.minSubtotal.toLocaleString(
        "vi-VN"
      )}đ để áp dụng mã này`,
    };
  }

  // Tính discount
  let discount = 0;
  if (voucher.type === "percent") {
    discount = Math.round((subtotal * voucher.value) / 100);
  } else if (voucher.type === "fixed") {
    discount = voucher.value;
  }

  // Không cho discount vượt trần và không vượt subtotal
  discount = Math.min(
    discount,
    voucher.maxDiscount || Number.MAX_SAFE_INTEGER,
    subtotal
  );

  return {
    valid: true,
    voucher,
    discount,
    label: voucher.label,
  };
}

// ==================================================
// (Optional) Lấy tất cả voucher còn hiệu lực — dùng cho admin
// ==================================================
export function getAllActiveVouchers() {
  const now = new Date();
  return VOUCHERS.filter((v) => v.active && v.expiresAt > now).map((v) => ({
    code: v.code,
    description: v.description,
    expiresAt: v.expiresAt,
  }));
}