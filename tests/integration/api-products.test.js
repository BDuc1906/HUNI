import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock @/server/db
vi.mock("@/server/db", () => {
  return {
    db: {
      product: {
        findMany: vi.fn(),
        findFirst: vi.fn(),
        findUnique: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
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
import { GET as getProducts, POST as createProduct } from "@/app/api/products/route";
import {
  GET as getProductDetail,
  PUT as updateProduct,
  DELETE as deleteProduct,
} from "@/app/api/products/[id]/route";

describe("API /api/products", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /api/products", () => {
    it("trả về danh sách sản phẩm từ DB nếu có dữ liệu", async () => {
      const mockProducts = [
        {
          id: "prod-1",
          slug: "ao-polo-pro-1",
          sku: "HN-POLO-01",
          title: "Áo Polo Nam Classic",
          price: 185000,
          category: "corporate",
          published: true,
        },
      ];

      db.product.count.mockResolvedValue(1);
      db.product.findMany.mockResolvedValue(mockProducts);

      const request = new Request("http://localhost:3000/api/products?page=1&limit=10");
      const response = await getProducts(request);
      const json = await response.json();

      expect(response.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.data.products).toHaveLength(1);
      expect(json.data.total).toBe(1);
    });

    it("fallback mượt mà sang static products nếu DB chưa có sản phẩm", async () => {
      db.product.count.mockResolvedValue(0);

      const request = new Request(
        "http://localhost:3000/api/products?category=corporate&limit=5"
      );
      const response = await getProducts(request);
      const json = await response.json();

      expect(response.status).toBe(200);
      expect(json.success).toBe(true);
      expect(Array.isArray(json.data.products)).toBe(true);
      expect(json.data.products.length).toBeGreaterThan(0);
    });
  });

  describe("POST /api/products (🔒 ADMIN)", () => {
    it("trả về 401 nếu chưa đăng nhập", async () => {
      mockAuth.mockResolvedValue(null);

      const request = new Request("http://localhost:3000/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "Áo mới" }),
      });

      const response = await createProduct(request);
      const json = await response.json();

      expect(response.status).toBe(401);
      expect(json.success).toBe(false);
      expect(json.error).toContain("đăng nhập");
    });

    it("trả về 403 nếu tài khoản không phải ADMIN", async () => {
      mockAuth.mockResolvedValue({
        user: { id: "user-1", role: "CUSTOMER" },
      });

      const request = new Request("http://localhost:3000/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "Áo mới" }),
      });

      const response = await createProduct(request);
      const json = await response.json();

      expect(response.status).toBe(403);
      expect(json.success).toBe(false);
      expect(json.error).toContain("ADMIN");
    });

    it("tạo sản phẩm thành công khi dữ liệu hợp lệ và là ADMIN", async () => {
      mockAuth.mockResolvedValue({
        user: { id: "admin-1", role: "ADMIN" },
      });

      db.product.findFirst.mockResolvedValue(null);
      db.product.create.mockResolvedValue({
        id: "prod-new-123",
        slug: "ao-polo-doanh-nghiep-2026",
        sku: "HN-POLO-2026",
        title: "Áo Polo Doanh Nghiệp 2026",
        price: 200000,
        published: true,
      });

      const request = new Request("http://localhost:3000/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: "ao-polo-doanh-nghiep-2026",
          sku: "HN-POLO-2026",
          title: "Áo Polo Doanh Nghiệp 2026",
          description: "Chất liệu cotton mềm mại, co giãn 4 chiều.",
          category: "corporate",
          price: 200000,
          images: ["/images/polo.jpg"],
        }),
      });

      const response = await createProduct(request);
      const json = await response.json();

      expect(response.status).toBe(201);
      expect(json.success).toBe(true);
      expect(json.data.slug).toBe("ao-polo-doanh-nghiep-2026");
    });
  });

  describe("GET, PUT, DELETE /api/products/[id]", () => {
    it("GET /api/products/[id] trả về 404 nếu không tìm thấy", async () => {
      db.product.findFirst.mockResolvedValue(null);

      const request = new Request("http://localhost:3000/api/products/not-exist");
      const response = await getProductDetail(request, {
        params: Promise.resolve({ id: "not-exist" }),
      });
      const json = await response.json();

      expect(response.status).toBe(404);
      expect(json.success).toBe(false);
    });

    it("PUT /api/products/[id] cập nhật sản phẩm thành công khi là ADMIN", async () => {
      mockAuth.mockResolvedValue({
        user: { id: "admin-1", role: "ADMIN" },
      });

      db.product.findFirst.mockResolvedValue({
        id: "prod-1",
        slug: "ao-polo-1",
        sku: "HN-01",
      });
      db.product.update.mockResolvedValue({
        id: "prod-1",
        slug: "ao-polo-1",
        sku: "HN-01",
        price: 220000,
      });

      const request = new Request("http://localhost:3000/api/products/prod-1", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ price: 220000 }),
      });

      const response = await updateProduct(request, {
        params: Promise.resolve({ id: "prod-1" }),
      });
      const json = await response.json();

      expect(response.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.data.price).toBe(220000);
    });

    it("DELETE /api/products/[id] xóa sản phẩm thành công khi là ADMIN", async () => {
      mockAuth.mockResolvedValue({
        user: { id: "admin-1", role: "ADMIN" },
      });

      db.product.findFirst.mockResolvedValue({ id: "prod-1" });
      db.product.delete.mockResolvedValue({ id: "prod-1" });

      const request = new Request("http://localhost:3000/api/products/prod-1", {
        method: "DELETE",
      });

      const response = await deleteProduct(request, {
        params: Promise.resolve({ id: "prod-1" }),
      });
      const json = await response.json();

      expect(response.status).toBe(200);
      expect(json.success).toBe(true);
    });
  });
});
