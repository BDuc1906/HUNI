import { describe, it, expect } from "vitest";
import {
  registerSchema,
  loginSchema,
  createOrderSchema,
  createQuoteSchema,
  formatZodErrors,
} from "@/server/validators";

describe("Validation Schemas (src/server/validators.js)", () => {
  describe("Phone validation via registerSchema", () => {
    it("should normalize and accept valid Vietnamese phone numbers", () => {
      const validCases = [
        "0984959586",
        "0984.959.586",
        "0984 959 586",
        "+84984959586",
        "(0984)-959-586",
      ];

      for (const phone of validCases) {
        const res = registerSchema.safeParse({
          fullName: "Nguyễn Văn A",
          email: "test@hdcfashion.vn",
          phone,
          password: "password123",
        });
        expect(res.success).toBe(true);
        if (res.success) {
          expect(["0984959586", "84984959586"]).toContain(res.data.phone);
        }
      }
    });

    it("should reject invalid phone numbers", () => {
      const invalidCases = [
        "123", // too short
        "0984abcdef", // contains letters
        "123456789012345", // too long
      ];

      for (const phone of invalidCases) {
        const res = registerSchema.safeParse({
          fullName: "Nguyễn Văn A",
          email: "test@hdcfashion.vn",
          phone,
          password: "password123",
        });
        expect(res.success).toBe(false);
      }
    });
  });

  describe("registerSchema & loginSchema", () => {
    it("should reject registration if password is too short (< 6 chars)", () => {
      const res = registerSchema.safeParse({
        fullName: "Nguyễn Văn A",
        email: "test@hdcfashion.vn",
        phone: "0984959586",
        password: "123",
      });
      expect(res.success).toBe(false);
      if (!res.success) {
        const errors = formatZodErrors(res.error);
        expect(errors.some((e) => e.field === "password")).toBe(true);
      }
    });

    it("should reject login if email format is invalid", () => {
      const res = loginSchema.safeParse({
        email: "not-an-email",
        password: "any-password",
      });
      expect(res.success).toBe(false);
    });

    it("should accept valid login credentials", () => {
      const res = loginSchema.safeParse({
        email: "admin@hdcfashion.vn",
        password: "securePassword123",
      });
      expect(res.success).toBe(true);
    });
  });

  describe("createQuoteSchema", () => {
    it("should accept valid quote requests with quantity >= 10", () => {
      const res = createQuoteSchema.safeParse({
        fullName: "Trần Thị B",
        phone: "0912345678",
        email: "tranb@company.com",
        company: "Công ty TNHH Á Châu",
        category: "polo",
        quantity: 50,
        estimatedPrice: 9000000,
        notes: "Cần in logo trước ngực",
      });
      expect(res.success).toBe(true);
    });

    it("should reject quote if quantity is less than 10", () => {
      const res = createQuoteSchema.safeParse({
        fullName: "Trần Thị B",
        phone: "0912345678",
        category: "polo",
        quantity: 5, // minimum is 10
      });
      expect(res.success).toBe(false);
      if (!res.success) {
        const formatted = formatZodErrors(res.error);
        expect(formatted.some((e) => e.field === "quantity")).toBe(true);
      }
    });

    it("should reject quote if category is not in allowed enum", () => {
      const res = createQuoteSchema.safeParse({
        fullName: "Trần Thị B",
        phone: "0912345678",
        category: "shoes", // not supported
        quantity: 20,
      });
      expect(res.success).toBe(false);
    });
  });

  describe("createOrderSchema", () => {
    it("should accept a complete valid order payload", () => {
      const validOrder = {
        customer: {
          fullName: "Lê Hoàng C",
          phone: "0987654321",
          email: "lehoangc@gmail.com",
          company: "Tech Corp",
          address: "123 Đường Láng, Hà Nội",
        },
        items: [
          {
            productId: "hdc-shirt-short-1",
            productName: "Sơ Mi Ngắn Tay HDC Classic",
            quantity: 20,
            unitPrice: 235000,
            color: "Xanh Đậm",
            size: "40",
          },
        ],
        voucherCode: "HUNI2026",
        paymentMethod: "vietqr",
        notes: "Giao trong giờ hành chính",
      };

      const res = createOrderSchema.safeParse(validOrder);
      expect(res.success).toBe(true);
    });

    it("should reject order if items list is empty", () => {
      const invalidOrder = {
        customer: {
          fullName: "Lê Hoàng C",
          phone: "0987654321",
          address: "Hà Nội",
        },
        items: [], // must have at least 1 item
        paymentMethod: "vietqr",
      };

      const res = createOrderSchema.safeParse(invalidOrder);
      expect(res.success).toBe(false);
    });

    it("should reject order if item quantity is less than 5", () => {
      const invalidOrder = {
        customer: {
          fullName: "Lê Hoàng C",
          phone: "0987654321",
          address: "Hà Nội",
        },
        items: [
          {
            productId: "hdc-shirt-short-1",
            productName: "Sơ Mi Ngắn Tay",
            quantity: 2, // minimum is 5
            unitPrice: 235000,
          },
        ],
        paymentMethod: "vietqr",
      };

      const res = createOrderSchema.safeParse(invalidOrder);
      expect(res.success).toBe(false);
    });

    it("should reject order if paymentMethod is invalid", () => {
      const invalidOrder = {
        customer: {
          fullName: "Lê Hoàng C",
          phone: "0987654321",
          address: "Hà Nội",
        },
        items: [
          {
            productId: "hdc-shirt-short-1",
            productName: "Sơ Mi Ngắn Tay",
            quantity: 10,
            unitPrice: 235000,
          },
        ],
        paymentMethod: "credit_card_unsupported",
      };

      const res = createOrderSchema.safeParse(invalidOrder);
      expect(res.success).toBe(false);
    });
  });
});
