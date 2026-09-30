import { describe, it, expect } from "vitest";
import { calculateTierPrice, calculateSavings } from "@/shared/lib/pricing";

describe("Pricing Logic (calculateTierPrice & calculateSavings)", () => {
  const mockProductWithTiers = {
    id: "polo-test-1",
    title: "Áo Polo Đồng Phục",
    price: 200000,
    wholesaleTiers: [
      { min: 10, max: 49, price: 180000, label: "10 - 49 áo" },
      { min: 50, max: 99, price: 160000, label: "50 - 99 áo" },
      { min: 100, max: 299, price: 140000, label: "100 - 299 áo" },
      { min: 300, max: 9999, price: 120000, label: "Từ 300 áo trở lên" },
    ],
  };

  const mockProductWithoutTiers = {
    id: "accessory-test-1",
    title: "Cà Vạt Lụa",
    price: 150000,
  };

  describe("calculateTierPrice", () => {
    it("should return base price if product has no tiers", () => {
      expect(calculateTierPrice(mockProductWithoutTiers, 10)).toBe(150000);
      expect(calculateTierPrice(null, 10)).toBe(0);
    });

    it("should return retail price if quantity is below minimum tier", () => {
      expect(calculateTierPrice(mockProductWithTiers, 5)).toBe(200000);
      expect(calculateTierPrice(mockProductWithTiers, 9)).toBe(200000);
    });

    it("should match exact wholesale tier prices according to quantity", () => {
      // Tier 1: 10 - 49
      expect(calculateTierPrice(mockProductWithTiers, 10)).toBe(180000);
      expect(calculateTierPrice(mockProductWithTiers, 49)).toBe(180000);

      // Tier 2: 50 - 99
      expect(calculateTierPrice(mockProductWithTiers, 50)).toBe(160000);
      expect(calculateTierPrice(mockProductWithTiers, 99)).toBe(160000);

      // Tier 3: 100 - 299
      expect(calculateTierPrice(mockProductWithTiers, 100)).toBe(140000);
      expect(calculateTierPrice(mockProductWithTiers, 299)).toBe(140000);

      // Tier 4: 300+
      expect(calculateTierPrice(mockProductWithTiers, 300)).toBe(120000);
      expect(calculateTierPrice(mockProductWithTiers, 1000)).toBe(120000);
    });
  });

  describe("calculateSavings", () => {
    it("should return 0 when quantity is below first wholesale tier", () => {
      const savings = calculateSavings(mockProductWithTiers, 5);
      expect(savings).toBe(0);
    });

    it("should calculate correct savings when ordering wholesale quantities", () => {
      // 10 items: regular = 2,000,000đ, tier = 1,800,000đ -> savings = 200,000đ
      const savings10 = calculateSavings(mockProductWithTiers, 10);
      expect(savings10).toBe(200000);

      // 100 items: regular = 20,000,000đ, tier = 14,000,000đ -> savings = 6,000,000đ
      const savings100 = calculateSavings(mockProductWithTiers, 100);
      expect(savings100).toBe(6000000);
    });

    it("should return 0 safely if product is null", () => {
      expect(calculateSavings(null, 50)).toBe(0);
    });
  });
});
