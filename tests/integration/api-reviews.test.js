import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock @/server/db
vi.mock("@/server/db", () => {
  return {
    db: {
      review: {
        findMany: vi.fn(),
        findFirst: vi.fn(),
        create: vi.fn(),
      },
      user: {
        findUnique: vi.fn(),
      },
      orderItem: {
        count: vi.fn(),
        findFirst: vi.fn(),
      },
      order: {
        count: vi.fn(),
      },
    },
  };
});

// Mock @/server/auth
const mockAuth = vi.fn();
vi.mock("@/server/auth", () => {
  return {
    auth: () => mockAuth(),
  };
});

import { db } from "@/server/db";
import { GET, POST } from "@/app/api/reviews/route";

describe("API /api/reviews", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /api/reviews", () => {
    it("trả về 400 nếu thiếu productId", async () => {
      const request = new Request("http://localhost:3000/api/reviews");
      const response = await GET(request);
      const json = await response.json();

      expect(response.status).toBe(400);
      expect(json.error).toContain("productId");
    });

    it("trả về 200 và danh sách đánh giá cùng avgRating", async () => {
      mockAuth.mockResolvedValue(null);
      db.review.findMany.mockResolvedValue([
        {
          id: "rev-1",
          rating: 5,
          content: "Chất lượng áo rất tốt, vải thoáng mát.",
          createdAt: new Date().toISOString(),
          user: { fullName: "Nguyễn Văn A", avatar: null },
        },
        {
          id: "rev-2",
          rating: 4,
          content: "Đường may sắc sảo, giao hàng đúng hẹn.",
          createdAt: new Date().toISOString(),
          user: { fullName: "Trần Thị B", avatar: null },
        },
      ]);

      const request = new Request(
        "http://localhost:3000/api/reviews?productId=polo-doanh-nghiep-hdc-pro"
      );
      const response = await GET(request);
      const json = await response.json();

      expect(response.status).toBe(200);
      expect(json.total).toBe(2);
      expect(json.avgRating).toBe(4.5);
      expect(json.reviews).toHaveLength(2);
      expect(json.isAuthenticated).toBe(false);
    });
  });

  describe("POST /api/reviews", () => {
    it("trả về 401 nếu chưa đăng nhập", async () => {
      mockAuth.mockResolvedValue(null);

      const request = new Request("http://localhost:3000/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: "polo-doanh-nghiep-hdc-pro",
          rating: 5,
          content: "Sản phẩm tuyệt vời",
        }),
      });

      const response = await POST(request);
      const json = await response.json();

      expect(response.status).toBe(401);
      expect(json.error).toContain("đăng nhập");
    });

    it("trả về 400 nếu rating không hợp lệ", async () => {
      mockAuth.mockResolvedValue({
        user: { id: "user-1", name: "Nguyễn Văn A", role: "CUSTOMER" },
      });

      const request = new Request("http://localhost:3000/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: "polo-doanh-nghiep-hdc-pro",
          rating: 6, // Không hợp lệ (> 5)
          content: "Sản phẩm rất đẹp",
        }),
      });

      const response = await POST(request);
      const json = await response.json();

      expect(response.status).toBe(400);
      expect(json.error).toContain("1 đến 5 sao");
    });

    it("trả về 400 nếu content quá ngắn (< 5 ký tự)", async () => {
      mockAuth.mockResolvedValue({
        user: { id: "user-1", name: "Nguyễn Văn A", role: "CUSTOMER" },
      });

      const request = new Request("http://localhost:3000/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: "polo-doanh-nghiep-hdc-pro",
          rating: 5,
          content: "Tốt", // < 5 ký tự
        }),
      });

      const response = await POST(request);
      const json = await response.json();

      expect(response.status).toBe(400);
      expect(json.error).toContain("tối thiểu 5 ký tự");
    });

    it("trả về 400 nếu user đã đánh giá sản phẩm này trước đó", async () => {
      mockAuth.mockResolvedValue({
        user: { id: "user-1", name: "Nguyễn Văn A", role: "CUSTOMER" },
      });

      db.review.findFirst.mockResolvedValue({
        id: "existing-rev",
        productId: "polo-doanh-nghiep-hdc-pro",
        userId: "user-1",
      });

      const request = new Request("http://localhost:3000/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: "polo-doanh-nghiep-hdc-pro",
          rating: 5,
          content: "Đánh giá lần thứ hai không được chấp nhận.",
        }),
      });

      const response = await POST(request);
      const json = await response.json();

      expect(response.status).toBe(400);
      expect(json.success).toBe(false);
      expect(json.error).toContain("đã gửi đánh giá");
    });

    it("tạo đánh giá thành công khi dữ liệu hợp lệ (ADMIN role)", async () => {
      mockAuth.mockResolvedValue({
        user: { id: "admin-1", name: "Quản trị viên", role: "ADMIN" },
      });

      db.review.findFirst.mockResolvedValue(null);
      db.review.create.mockResolvedValue({
        id: "rev-new-1",
        rating: 5,
        content: "Đồng phục may mẫu rất chuẩn phom dáng.",
        createdAt: new Date().toISOString(),
        user: { fullName: "Quản trị viên", avatar: null },
      });

      const request = new Request("http://localhost:3000/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: "polo-doanh-nghiep-hdc-pro",
          rating: 5,
          content: "Đồng phục may mẫu rất chuẩn phom dáng.",
        }),
      });

      const response = await POST(request);
      const json = await response.json();

      expect(response.status).toBe(201);
      expect(json.success).toBe(true);
      expect(json.review.rating).toBe(5);
      expect(json.review.content).toBe("Đồng phục may mẫu rất chuẩn phom dáng.");
    });
  });
});

