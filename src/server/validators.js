// ==================================================
// src/server/validators.js
// ==================================================

import { z } from "zod";

// ==================================================
// Helper: chuẩn hóa SĐT
// Chấp nhận: 0987654321, 0987.654.321, 0987 654 321, +84987654321
// Output: 0987654321
// ==================================================
const phoneSchema = z
  .string()
  .transform((val) => String(val).replace(/[\s.\-()+]/g, ""))
  .pipe(z.string().regex(/^[0-9]{10,11}$/, "SĐT phải có 10-11 số"));

// ==================================================
// Helper: Email cho phép rỗng
// ==================================================
const optionalEmail = z
  .union([
    z.string().email("Email không hợp lệ"),
    z.literal(""),
    z.undefined(),
    z.null(),
  ])
  .optional()
  .transform((val) => val || "");

// ==================================================
// AUTH VALIDATOR — Đăng ký
// ==================================================
export const registerSchema = z.object({
  fullName: z.string().min(2, "Họ tên tối thiểu 2 ký tự").max(100),
  email: z.string().email("Email không hợp lệ"),
  phone: phoneSchema,
  password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự").max(100),
});

// ==================================================
// AUTH VALIDATOR — Đăng nhập
// ==================================================
export const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(1, "Vui lòng nhập mật khẩu"),
});

// ==================================================
// ORDER VALIDATOR
// ⚠️ LƯU Ý BẢO MẬT:
// - KHÔNG nhận subtotal/discount/total từ client
// - Server tự tính lại từ productId + quantity + voucherCode
// - Client gửi unitPrice chỉ để so sánh, server sẽ reject nếu lệch
// ==================================================
export const createOrderSchema = z.object({
  customer: z.object({
    fullName: z.string().min(2, "Họ tên tối thiểu 2 ký tự").max(100),
    phone: phoneSchema,
    email: optionalEmail,
    company: z
      .union([z.string().max(200), z.undefined(), z.null()])
      .optional()
      .transform((val) => val || ""),
    address: z.string().min(1, "Vui lòng nhập địa chỉ"),
  }),
  items: z
    .array(
      z.object({
        productId: z.string().min(1, "Thiếu productId"),
        productName: z.string().min(1).max(300),
        quantity: z
          .number()
          .int()
          .min(5, "Số lượng tối thiểu 5")
          .max(100000, "Số lượng quá lớn"),
        // Client gửi lên — server chỉ dùng để so sánh, KHÔNG tin
        unitPrice: z.number().int().min(0),
        color: z.union([z.string(), z.undefined(), z.null()]).optional(),
        size: z.union([z.string(), z.undefined(), z.null()]).optional(),
        customLogo: z.any().optional(),
      })
    )
    .min(1, "Phải có ít nhất 1 sản phẩm")
    .max(50, "Tối đa 50 sản phẩm trong 1 đơn"),
  // Voucher — server validate lại
  voucherCode: z
    .union([z.string().max(50), z.undefined(), z.null()])
    .optional()
    .transform((val) => val || null),
  paymentMethod: z.enum(["vietqr", "deposit30", "freesample"]),
  notes: z
    .union([z.string().max(500), z.undefined(), z.null()])
    .optional()
    .transform((val) => val || ""),
  vatInfo: z
    .union([
      z.object({
        taxCode: z.string().min(1).max(50),
        companyName: z.string().max(200).optional(),
        companyAddress: z.string().min(1).max(500),
        email: z.string().email(),
      }),
      z.null(),
      z.undefined(),
    ])
    .optional(),
});

// ==================================================
// QUOTE VALIDATOR
// ==================================================
export const createQuoteSchema = z.object({
  fullName: z.string().min(2).max(100),
  phone: phoneSchema,
  email: optionalEmail,
  company: z
    .union([z.string().max(200), z.undefined(), z.null()])
    .optional()
    .transform((val) => val || ""),
  category: z.enum([
    "polo",
    "shirt",
    "suit",
    "golf",
    "school",
    "accessories",
  ]),
  quantity: z.number().int().min(10, "Số lượng tối thiểu 10"),
  estimatedPrice: z.number().int().min(0).optional(),
  notes: z
    .union([z.string().max(500), z.undefined(), z.null()])
    .optional()
    .transform((val) => val || ""),
});

// ==================================================
// Helper: Format lỗi Zod thành mảng
// ==================================================
export function formatZodErrors(error) {
  return error.issues.map((issue) => ({
    field: issue.path.join("."),
    message: issue.message,
  }));
}