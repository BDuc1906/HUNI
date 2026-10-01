import { describe, it, expect } from "vitest";
import { LOGO_POSITIONS } from "@/features/customize/components/GarmentCanvas";
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

  describe("API Quote Schema Compatibility for Custom Studio Payload", () => {
    it("should validate a Studio 2D interactive customizer quote payload within 500 chars note limit", () => {
      const payload = {
        fullName: "Trần Anh Doanh Nghiệp",
        phone: "0984.959.586",
        email: "contact@enterprise.vn",
        company: "Tập Đoàn Công Nghệ HDC",
        category: "polo",
        quantity: 100,
        estimatedPrice: 15500000,
        notes:
          "[Studio 2D] Áo: Áo Polo Doanh Nghiệp | Màu: Deep Teal Signature (#004f5e) | Vải: Pique Cá Sấu CVC 65/35 | Vị trí logo: Ngực Trái | Kỹ thuật: Thêu Tajima | Tên logo/file: HDC_Logo_Official.png",
      };

      const result = createQuoteSchema.safeParse(payload);
      expect(result.success).toBe(true);
      expect(result.data.phone).toBe("0984959586"); // Normalized
      expect(result.data.notes.length).toBeLessThanOrEqual(500);
    });

    it("should validate a Pre-existing File Upload quote payload within 500 chars note limit", () => {
      const payload = {
        fullName: "Lê Hoàng Agency",
        phone: "+84 909 888 777",
        email: "agency@branddesign.com",
        company: "Agency Sáng Tạo Việt",
        category: "shirt",
        quantity: 50,
        notes:
          "[Gửi Mẫu Thiết Kế] Ngân sách: standard | Tiến độ: urgent | File đính kèm: HDC_Uniform_Vector.ai, Techpack_Specs.pdf | Yêu cầu: May mẫu gấp trước 3 ngày",
      };

      const result = createQuoteSchema.safeParse(payload);
      expect(result.success).toBe(true);
      expect(result.data.phone).toBe("84909888777");
      expect(result.data.category).toBe("shirt");
      expect(result.data.notes.length).toBeLessThanOrEqual(500);
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
