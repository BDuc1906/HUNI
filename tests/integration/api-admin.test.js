import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock @/server/db
vi.mock("@/server/db", () => {
  return {
    db: {
      order: {
        findMany: vi.fn(),
        findFirst: vi.fn(),
        update: vi.fn(),
        count: vi.fn(),
        aggregate: vi.fn(),
      },
      quote: {
        findMany: vi.fn(),
        findUnique: vi.fn(),
        update: vi.fn(),
        count: vi.fn(),
      },
      customer: {
        findMany: vi.fn(),
        count: vi.fn(),
      },
      voucher: {
        findMany: vi.fn(),
        findUnique: vi.fn(),
        create: vi.fn(),
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
import { GET as getAdminOrders } from "@/app/api/admin/orders/route";
import { PATCH as updateAdminOrder } from "@/app/api/admin/orders/[id]/route";
import { GET as getAdminQuotes } from "@/app/api/admin/quotes/route";
import { PATCH as updateAdminQuote } from "@/app/api/admin/quotes/[id]/route";
import { GET as getAdminCustomers } from "@/app/api/admin/customers/route";
import { GET as getAdminDashboard } from "@/app/api/admin/dashboard/route";
import {
  GET as getAdminVouchers,
  POST as createAdminVoucher,
} from "@/app/api/admin/vouchers/route";

describe("API Admin Endpoints (Mục 9 — API_CONTRACT.md)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /api/admin/orders", () => {
    it("trả về 401 nếu chưa đăng nhập", async () => {
      mockAuth.mockResolvedValue(null);

      const request = new Request("http://localhost:3000/api/admin/orders");
      const response = await getAdminOrders(request);
      const json = await response.json();

      expect(response.status).toBe(401);
      expect(json.success).toBe(false);
    });

    it("trả về 403 nếu không phải ADMIN", async () => {
      mockAuth.mockResolvedValue({
        user: { id: "user-1", role: "CUSTOMER" },
      });

      const request = new Request("http://localhost:3000/api/admin/orders");
      const response = await getAdminOrders(request);
      const json = await response.json();

      expect(response.status).toBe(403);
      expect(json.success).toBe(false);
    });

    it("trả về 200 và danh sách đơn hàng cho ADMIN", async () => {
      mockAuth.mockResolvedValue({
        user: { id: "admin-1", role: "ADMIN" },
      });

      db.order.findMany.mockResolvedValue([
        {
          id: "ord-1",
          orderNumber: "HN-261001-1234",
          status: "PENDING",
          total: 5000000,
        },
      ]);
      db.order.count.mockResolvedValue(1);
      db.order.aggregate.mockResolvedValue({ _sum: { total: 5000000 } });

      const request = new Request("http://localhost:3000/api/admin/orders?limit=10");
      const response = await getAdminOrders(request);
      const json = await response.json();

      expect(response.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.data.orders).toHaveLength(1);
      expect(json.data.summary.totalRevenue).toBe(5000000);
    });
  });

  describe("PATCH /api/admin/orders/[id]", () => {
    it("cập nhật trạng thái đơn hàng thành công khi là ADMIN", async () => {
      mockAuth.mockResolvedValue({
        user: { id: "admin-1", role: "ADMIN" },
      });

      db.order.findFirst.mockResolvedValue({
        id: "ord-1",
        orderNumber: "HN-261001-1234",
        status: "PENDING",
      });
      db.order.update.mockResolvedValue({
        id: "ord-1",
        orderNumber: "HN-261001-1234",
        status: "CONFIRMED",
        notes: "Đã gọi xác nhận",
      });

      const request = new Request("http://localhost:3000/api/admin/orders/ord-1", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "CONFIRMED", notes: "Đã gọi xác nhận" }),
      });

      const response = await updateAdminOrder(request, {
        params: Promise.resolve({ id: "ord-1" }),
      });
      const json = await response.json();

      expect(response.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.data.status).toBe("CONFIRMED");
    });
  });

  describe("GET & PATCH /api/admin/quotes", () => {
    it("GET /api/admin/quotes trả về 200 cho ADMIN", async () => {
      mockAuth.mockResolvedValue({
        user: { id: "admin-1", role: "ADMIN" },
      });

      db.quote.findMany.mockResolvedValue([
        {
          id: "q-1",
          fullName: "Nguyễn Văn B",
          category: "polo",
          quantity: 100,
          status: "NEW",
        },
      ]);
      db.quote.count.mockResolvedValue(1);

      const request = new Request("http://localhost:3000/api/admin/quotes");
      const response = await getAdminQuotes(request);
      const json = await response.json();

      expect(response.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.data.quotes).toHaveLength(1);
    });

    it("PATCH /api/admin/quotes/[id] cập nhật trạng thái báo giá thành công", async () => {
      mockAuth.mockResolvedValue({
        user: { id: "admin-1", role: "ADMIN" },
      });

      db.quote.findUnique.mockResolvedValue({
        id: "q-1",
        status: "NEW",
      });
      db.quote.update.mockResolvedValue({
        id: "q-1",
        status: "QUOTED",
        estimatedPrice: 15000000,
      });

      const request = new Request("http://localhost:3000/api/admin/quotes/q-1", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "QUOTED", estimatedPrice: 15000000 }),
      });

      const response = await updateAdminQuote(request, {
        params: Promise.resolve({ id: "q-1" }),
      });
      const json = await response.json();

      expect(response.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.data.status).toBe("QUOTED");
    });
  });

  describe("GET /api/admin/customers & /api/admin/dashboard", () => {
    it("GET /api/admin/customers trả về danh sách khách hàng", async () => {
      mockAuth.mockResolvedValue({
        user: { id: "admin-1", role: "ADMIN" },
      });

      db.customer.findMany.mockResolvedValue([
        {
          id: "cust-1",
          fullName: "Công ty ABC",
          phone: "0901234567",
          _count: { orders: 3, quotes: 1 },
        },
      ]);
      db.customer.count.mockResolvedValue(1);

      const request = new Request("http://localhost:3000/api/admin/customers");
      const response = await getAdminCustomers(request);
      const json = await response.json();

      expect(response.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.data.customers[0].orderCount).toBe(3);
    });

    it("GET /api/admin/dashboard trả về số liệu tổng quan", async () => {
      mockAuth.mockResolvedValue({
        user: { id: "admin-1", role: "ADMIN" },
      });

      db.order.count.mockResolvedValue(50);
      db.quote.count.mockResolvedValue(20);
      db.customer.count.mockResolvedValue(40);
      db.order.aggregate.mockResolvedValue({ _sum: { total: 250000000 } });
      db.order.findMany.mockResolvedValue([]);
      db.quote.findMany.mockResolvedValue([]);

      const request = new Request("http://localhost:3000/api/admin/dashboard");
      const response = await getAdminDashboard(request);
      const json = await response.json();

      expect(response.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.data.stats.totalOrders).toBe(50);
      expect(json.data.stats.totalRevenue).toBe(250000000);
    });
  });

  describe("POST /api/admin/vouchers", () => {
    it("tạo voucher thành công khi là ADMIN", async () => {
      mockAuth.mockResolvedValue({
        user: { id: "admin-1", role: "ADMIN" },
      });

      db.voucher.findUnique.mockResolvedValue(null);
      db.voucher.create.mockResolvedValue({
        id: "vouch-1",
        code: "SALE2026",
        discount: 15,
        type: "percentage",
        active: true,
      });

      const request = new Request("http://localhost:3000/api/admin/vouchers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: "sale2026",
          discount: 15,
          type: "percentage",
          minOrder: 1000000,
        }),
      });

      const response = await createAdminVoucher(request);
      const json = await response.json();

      expect(response.status).toBe(201);
      expect(json.success).toBe(true);
      expect(json.data.code).toBe("SALE2026");
    });
  });
});
