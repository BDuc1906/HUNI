import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock @/server/auth
const mockAuth = vi.fn();
vi.mock("@/server/auth", () => {
  return {
    auth: () => mockAuth(),
  };
});

// Mock @/server/db
vi.mock("@/server/db", () => {
  return {
    db: {},
  };
});

import { GET as getReviews, PATCH as patchReviews, DELETE as deleteReviews } from "@/app/api/admin/reviews/route";
import { GET as getReturns, PATCH as patchReturns, DELETE as deleteReturns } from "@/app/api/admin/returns/route";

describe("Admin Reviews & Returns APIs", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAuth.mockResolvedValue({
      user: { role: "ADMIN", email: "admin@hdcfashion.vn" },
    });
  });

  describe("API /api/admin/reviews", () => {
    it("GET: trả về danh sách đánh giá", async () => {
      const request = new Request("http://localhost:3000/api/admin/reviews?page=1&limit=5");
      const response = await getReviews(request);
      const json = await response.json();

      expect(response.status).toBe(200);
      expect(json.success).toBe(true);
      expect(Array.isArray(json.data.reviews)).toBe(true);
      expect(json.data.reviews.length).toBeGreaterThan(0);
    });

    it("PATCH: cập nhật trạng thái và trả lời đánh giá", async () => {
      const request = new Request("http://localhost:3000/api/admin/reviews", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: "rev-002",
          status: "APPROVED",
          adminReply: "Cảm ơn quý khách đã tin tưởng!",
        }),
      });

      const response = await patchReviews(request);
      const json = await response.json();

      expect(response.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.data.adminReply).toBe("Cảm ơn quý khách đã tin tưởng!");
    });

    it("DELETE: xoá đánh giá theo id", async () => {
      const request = new Request("http://localhost:3000/api/admin/reviews", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ids: ["rev-001"],
        }),
      });

      const response = await deleteReviews(request);
      const json = await response.json();

      expect(response.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.deletedCount).toBe(1);
    });
  });

  describe("API /api/admin/returns", () => {
    it("GET: trả về danh sách yêu cầu đổi trả", async () => {
      const request = new Request("http://localhost:3000/api/admin/returns?page=1&limit=5");
      const response = await getReturns(request);
      const json = await response.json();

      expect(response.status).toBe(200);
      expect(json.success).toBe(true);
      expect(Array.isArray(json.data.returns)).toBe(true);
      expect(json.data.returns.length).toBeGreaterThan(0);
    });

    it("PATCH: cập nhật trạng thái sang EXCHANGED", async () => {
      const request = new Request("http://localhost:3000/api/admin/returns", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: "RT-261001-001",
          status: "EXCHANGED",
          adminNotes: "Đã giao 5 áo mới cho khách hàng.",
        }),
      });

      const response = await patchReturns(request);
      const json = await response.json();

      expect(response.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.data.status).toBe("EXCHANGED");
      expect(json.data.adminNotes).toBe("Đã giao 5 áo mới cho khách hàng.");
    });

    it("DELETE: xoá yêu cầu đổi trả theo ids", async () => {
      const request = new Request("http://localhost:3000/api/admin/returns", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ids: ["RT-261001-001"],
        }),
      });

      const response = await deleteReturns(request);
      const json = await response.json();

      expect(response.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.deletedCount).toBe(1);
    });
  });
});
