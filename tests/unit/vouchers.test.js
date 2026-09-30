import { describe, it, expect } from "vitest";
import { getVoucher, validateVoucher, getAllActiveVouchers } from "@/server/vouchers";

describe("Vouchers Module (src/server/vouchers.js)", () => {
  describe("getVoucher", () => {
    it("should return null when code is empty or not found", () => {
      expect(getVoucher("")).toBeNull();
      expect(getVoucher(null)).toBeNull();
      expect(getVoucher("NON_EXISTING_VOUCHER")).toBeNull();
    });

    it("should find voucher case-insensitively and trim spaces", () => {
      const v1 = getVoucher("huni2026");
      const v2 = getVoucher("  HUNI2026  ");
      expect(v1).not.toBeNull();
      expect(v1?.code).toBe("HUNI2026");
      expect(v2?.code).toBe("HUNI2026");
    });
  });

  describe("validateVoucher", () => {
    it("should reject empty voucher code", () => {
      const res = validateVoucher("", 1000000);
      expect(res.valid).toBe(false);
      expect(res.reason).toContain("Vui lòng nhập");
    });

    it("should reject non-existent voucher code", () => {
      const res = validateVoucher("INVALID999", 1000000);
      expect(res.valid).toBe(false);
      expect(res.reason).toContain("không hợp lệ");
    });

    it("should calculate percentage discount correctly (HUNI2026: 5%)", () => {
      // 1,000,000đ * 5% = 50,000đ
      const res = validateVoucher("HUNI2026", 1000000);
      expect(res.valid).toBe(true);
      expect(res.discount).toBe(50000);
      expect(res.voucher?.code).toBe("HUNI2026");
    });

    it("should cap percentage discount at maxDiscount", () => {
      // 200,000,000đ * 5% = 10,000,000đ, but maxDiscount is 5,000,000đ
      const res = validateVoucher("HUNI2026", 200000000);
      expect(res.valid).toBe(true);
      expect(res.discount).toBe(5000000);
    });

    it("should enforce minimum subtotal for fixed vouchers (DOANHNGHIEP: min 5,000,000đ)", () => {
      // Below 5,000,000đ -> reject
      const belowMin = validateVoucher("DOANHNGHIEP", 3000000);
      expect(belowMin.valid).toBe(false);
      expect(belowMin.reason).toContain("tối thiểu");

      // At or above 5,000,000đ -> accept 200,000đ discount
      const aboveMin = validateVoucher("DOANHNGHIEP", 5000000);
      expect(aboveMin.valid).toBe(true);
      expect(aboveMin.discount).toBe(200000);
    });

    it("should never allow discount to exceed the subtotal itself", () => {
      // In case subtotal is less than discount
      const res = validateVoucher("HUNI2026", 50000);
      expect(res.valid).toBe(true);
      expect(res.discount).toBeLessThanOrEqual(50000);
    });
  });

  describe("getAllActiveVouchers", () => {
    it("should return an array of active non-expired vouchers", () => {
      const activeList = getAllActiveVouchers();
      expect(Array.isArray(activeList)).toBe(true);
      expect(activeList.length).toBeGreaterThan(0);
      expect(activeList.every((v) => v.code && v.description)).toBe(true);
    });
  });
});
