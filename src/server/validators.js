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
// ==================================================
export const createOrderSchema = z.object({
  customer: z.object({
    fullName: z.string().min(2, "Họ tên tối thiểu 2 ký tự").max(100),
    phone: phoneSchema,
    email: optionalEmail,
    company: z
      .union([z.string().max(200), z.undefined(), z.null()])
      .transform((val) => val || ""),
    address: z.string().min(1, "Vui lòng nhập địa chỉ"),
  }),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        productName: z.string().min(1),
        quantity: z.number().int().min(5, "Số lượng tối thiểu 5"),
        unitPrice: z.number().int().min(0),
        color: z.union([z.string(), z.undefined(), z.null()]).optional(),
        size: z.union([z.string(), z.undefined(), z.null()]).optional(),
        customLogo: z.any().optional(),
      })
    )
    .min(1, "Phải có ít nhất 1 sản phẩm"),
  paymentMethod: z.enum(["vietqr", "deposit30", "freesample"]),
  subtotal: z.number().int().min(0),
  discount: z.number().int().min(0).default(0),
  total: z.number().int().min(0),
  notes: z
    .union([z.string().max(500), z.undefined(), z.null()])
    .transform((val) => val || ""),
  vatInfo: z
    .union([
      z.object({
        taxCode: z.string(),
        companyName: z.string().optional(),
        companyAddress: z.string(),
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
    .transform((val) => val || ""),
  category: z.enum(["polo", "shirt", "suit", "golf", "school", "accessories"]),
  quantity: z.number().int().min(10, "Số lượng tối thiểu 10"),
  estimatedPrice: z.number().int().min(0).optional(),
  notes: z
    .union([z.string().max(500), z.undefined(), z.null()])
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