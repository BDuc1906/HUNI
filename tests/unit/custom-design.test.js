import { describe, it, expect } from "vitest";
import { LOGO_POSITIONS } from "@/features/customize/components/GarmentCanvas";
import {
  SIZE_SPECS_MEN,
  SIZE_SPECS_WOMEN,
  SIZE_SPECS_UNISEX,
} from "@/features/customize/components/CustomDesignStudio";
import { createQuoteSchema } from "@/server/validators";

describe("Custom Design Studio Specifications & Contract Integrity", () => {
  describe("Logo Positioning Matrix (GarmentCanvas)", () => {
    it("should provide valid coordinate configurations for all standard positions", () => {
      const positions = Object.values(LOGO_POSITIONS);
      expect(positions.length).toBeGreaterThanOrEqual(6);

      positions.forEach((pos) => {
        expect(pos.id).toBeDefined();
        expect(pos.name).toBeDefined();
        expect(pos.shortName).toBeDefined();
        expect(["front", "back"]).toContain(pos.view);
        expect(pos.coords.top).toMatch(/^[0-9]+%$/);
        expect(pos.coords.left).toMatch(/^[0-9]+%$/);
        expect(pos.realSize).toBeDefined();
      });
    });

    it("should accurately distinguish front-facing and back-facing positions", () => {
      const frontPositions = Object.values(LOGO_POSITIONS).filter(
        (p) => p.view === "front"
      );
      const backPositions = Object.values(LOGO_POSITIONS).filter(
        (p) => p.view === "back"
      );

      const frontIds = frontPositions.map((p) => p.id);
      expect(frontIds).toContain("chest_left");
      expect(frontIds).toContain("chest_right");
      expect(frontIds).toContain("chest_center");
      expect(frontIds).toContain("sleeve_left");

      const backIds = backPositions.map((p) => p.id);
      expect(backIds).toContain("back_center");
      expect(backIds).toContain("back_nape");
    });
  });

  describe("Multi-Size Specifications & Size Chart Standards", () => {
    it("should provide complete Men size specifications from S to 3XL", () => {
      expect(SIZE_SPECS_MEN.length).toBe(6);
      const sizes = SIZE_SPECS_MEN.map((s) => s.size);
      expect(sizes).toEqual(["S", "M", "L", "XL", "2XL", "3XL"]);

      SIZE_SPECS_MEN.forEach((spec) => {
        expect(spec.weight).toBeDefined();
        expect(spec.height).toBeDefined();
        expect(spec.chest).toBeDefined();
      });
    });

    it("should provide complete Women size specifications from S to 2XL", () => {
      expect(SIZE_SPECS_WOMEN.length).toBe(5);
      const sizes = SIZE_SPECS_WOMEN.map((s) => s.size);
      expect(sizes).toEqual(["S", "M", "L", "XL", "2XL"]);

      SIZE_SPECS_WOMEN.forEach((spec) => {
        expect(spec.weight).toBeDefined();
        expect(spec.height).toBeDefined();
        expect(spec.chest).toBeDefined();
      });
    });

    it("should provide complete Unisex size specifications", () => {
      expect(SIZE_SPECS_UNISEX.length).toBe(6);
      const sizes = SIZE_SPECS_UNISEX.map((s) => s.size);
      expect(sizes).toEqual(["S", "M", "L", "XL", "2XL", "3XL"]);
    });
  });

  describe("API Quote Schema Compatibility for Custom Studio Payload", () => {
    it("should validate a Studio 2D multi-size quote payload within 500 chars note limit", () => {
      const menSizes = { S: 0, M: 10, L: 15, XL: 10, "2XL": 5, "3XL": 0 };
      const womenSizes = { S: 5, M: 15, L: 10, XL: 5, "2XL": 0 };
      const totalQty =
        Object.values(menSizes).reduce((a, b) => a + b, 0) +
        Object.values(womenSizes).reduce((a, b) => a + b, 0);

      expect(totalQty).toBe(75);

      const sizeStr = "Nam[M:10,L:15,XL:10,2XL:5] Nữ[S:5,M:15,L:10,XL:5] (+Thử size)";

      const payload = {
        fullName: "Trần Anh Doanh Nghiệp",
        phone: "0984.959.586",
        email: "contact@enterprise.vn",
        company: "Tập Đoàn Công Nghệ HDC",
        category: "polo",
        quantity: totalQty,
        estimatedPrice: 10500000,
        notes: `[Studio 2D] Áo: Áo Polo Doanh Nghiệp | Màu: Deep Teal Signature (#004f5e) | Vải: Pique Cá Sấu CVC 65/35 | Size: ${sizeStr} | In/thêu: Thêu Tajima (Ngực Trái) | Logo: HDC_Logo.png | Y/c: Thêu chỉ vàng ánh kim`,
      };

      const result = createQuoteSchema.safeParse(payload);
      expect(result.success).toBe(true);
      expect(result.data.phone).toBe("0984959586"); // Normalized
      expect(result.data.quantity).toBe(75);
      expect(result.data.notes.length).toBeLessThanOrEqual(500);
      expect(result.data.notes).toContain("Nam[M:10,L:15,XL:10,2XL:5]");
      expect(result.data.notes).toContain("Nữ[S:5,M:15,L:10,XL:5]");
      expect(result.data.notes).toContain("(+Thử size)");
    });

    it("should validate a Pre-existing File Upload quote payload with fitting sample request", () => {
      const payload = {
        fullName: "Lê Hoàng Agency",
        phone: "+84 909 888 777",
        email: "agency@branddesign.com",
        company: "Agency Sáng Tạo Việt",
        category: "shirt",
        quantity: 50,
        notes:
          "[Gửi Mẫu Thiết Kế] Ngân sách: standard | Tiến độ: urgent | Có y/c thử size tại VP | File: HDC_Uniform_Vector.ai, Techpack_Specs.pdf | Yêu cầu: May mẫu gấp trước 3 ngày",
      };

      const result = createQuoteSchema.safeParse(payload);
      expect(result.success).toBe(true);
      expect(result.data.phone).toBe("84909888777");
      expect(result.data.category).toBe("shirt");
      expect(result.data.notes.length).toBeLessThanOrEqual(500);
      expect(result.data.notes).toContain("Có y/c thử size tại VP");
    });

    it("should reject quote if quantity is under 10", () => {
      const payload = {
        fullName: "Nguyễn Khách Lẻ",
        phone: "0912345678",
        category: "polo",
        quantity: 4, // Under min 10
      };

      const result = createQuoteSchema.safeParse(payload);
      expect(result.success).toBe(false);
      expect(result.error.issues[0].message).toContain("Số lượng tối thiểu 10");
    });
  });
});

