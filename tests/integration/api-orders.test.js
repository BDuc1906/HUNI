import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock @/server/db
vi.mock("@/server/db", () => {
  return {
    db: {
      customer: {
        findUnique: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
      },
      user: {
        findUnique: vi.fn(),
      },
      order: {
        create: vi.fn(),
        findMany: vi.fn(),
        count: vi.fn(),
      },
    },
    generateOrderNumber: vi.fn(() => "HN-260930-9999"),
  };
});

// Mock @/server/auth
const mockAuth = vi.fn();
vi.mock("@/server/auth", () => {
  return {
    auth: () => mockAuth(),
  };
});

// Mock @/server/mailer
vi.mock("@/server/mailer", () => {
  return {
    sendOrderNotificationEmail: vi.fn().mockResolvedValue(true),
    sendCustomerConfirmationEmail: vi.fn().mockResolvedValue(true),
  };
});

import { db } from "@/server/db";
import { POST, GET } from "@/app/api/orders/route";

describe("API POST /api/orders", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("trả về 400 nếu payload không hợp lệ qua Zod schema (thiếu customer)", async () => {
    const request = new Request("http://localhost:3000/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-forwarded-for": "192.168.1.1",
      },
      body: JSON.stringify({
        items: [],
      }),
    });

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json.success).toBe(false);
    expect(json.error).toBe("Dữ liệu không hợp lệ");
  });

  it("trả về 400 nếu phát hiện chênh lệch giá (client gửi sai giá so với server)", async () => {
    const request = new Request("http://localhost:3000/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-forwarded-for": "192.168.1.2",
      },
      body: JSON.stringify({
        customer: {
          fullName: "Nguyễn Văn Test",
          phone: "0912345678",
          address: "123 Đường Cầu Giấy, Hà Nội",
        },
        items: [
          {
            productId: "hdc-shirt-short-1",
            productName: "Sơ Mi Ngắn Tay HDC Classic Xanh Đậm",
            quantity: 10,
            unitPrice: 1000, // Cố tình gửi giá 1.000đ thay vì tier price 235.000đ
          },
        ],
        paymentMethod: "vietqr",
      }),
    });

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json.success).toBe(false);
    expect(json.error).toContain("Giá sản phẩm không hợp lệ");
  });

  it("trả về 400 nếu voucher không hợp lệ hoặc hết hạn", async () => {
    const request = new Request("http://localhost:3000/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-forwarded-for": "192.168.1.3",
      },
      body: JSON.stringify({
        customer: {
          fullName: "Nguyễn Văn Test",
          phone: "0912345678",
          address: "123 Đường Cầu Giấy, Hà Nội",
        },
        items: [
          {
            productId: "hdc-shirt-short-1",
            productName: "Sơ Mi Ngắn Tay HDC Classic Xanh Đậm",
            quantity: 10,
            unitPrice: 235000, // Giá đúng tier 10 chiếc
          },
        ],
        paymentMethod: "vietqr",
        voucherCode: "VOUCHER_KHONG_TON_TAI",
      }),
    });

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json.success).toBe(false);
    expect(json.field).toBe("voucherCode");
  });

  it("tạo đơn hàng thành công khi dữ liệu và giá hợp lệ", async () => {
    const mockCustomer = {
      id: "cust-123",
      fullName: "Nguyễn Văn Test",
      phone: "0912345678",
      address: "123 Đường Cầu Giấy, Hà Nội",
    };

    db.customer.findUnique.mockResolvedValue(null);
    db.customer.create.mockResolvedValue(mockCustomer);

    db.order.create.mockResolvedValue({
      id: "ord-456",
      orderNumber: "HN-260930-9999",
      customerId: "cust-123",
      status: "PENDING",
      paymentMethod: "vietqr",
      subtotal: 2350000,
      discount: 235000,
      total: 2115000,
      customer: mockCustomer,
      items: [
        {
          productId: "hdc-shirt-short-1",
          productName: "Sơ Mi Ngắn Tay HDC Classic Xanh Đậm",
          quantity: 10,
          unitPrice: 235000,
          subtotal: 2350000,
        },
      ],
    });

    const request = new Request("http://localhost:3000/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-forwarded-for": "192.168.1.4",
      },
      body: JSON.stringify({
        customer: {
          fullName: "Nguyễn Văn Test",
          phone: "0912345678",
          address: "123 Đường Cầu Giấy, Hà Nội",
        },
        items: [
          {
            productId: "hdc-shirt-short-1",
            productName: "Sơ Mi Ngắn Tay HDC Classic Xanh Đậm",
            quantity: 10,
            unitPrice: 235000,
          },
        ],
        paymentMethod: "vietqr",
        voucherCode: "HUNI2026", // Voucher giảm 10%
      }),
    });

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(201);
    expect(json.success).toBe(true);
    expect(json.order.orderNumber).toBe("HN-260930-9999");
    expect(json.order.subtotal).toBe(2350000);
    expect(json.order.discount).toBe(235000);
    expect(json.order.total).toBe(2115000);
  });
});

describe("API GET /api/orders (Auth Guard & RBAC)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("trả về 401 Unauthorized nếu chưa đăng nhập", async () => {
    mockAuth.mockResolvedValue(null);

    const request = new Request("http://localhost:3000/api/orders");
    const response = await GET(request);
    const json = await response.json();

    expect(response.status).toBe(401);
    expect(json.success).toBe(false);
    expect(json.error).toContain("đăng nhập");
  });

  it("trả về 403 Forbidden nếu người dùng không phải ADMIN cố xem toàn bộ đơn", async () => {
    mockAuth.mockResolvedValue({
      user: { id: "user-cust-1", name: "Khách hàng A", role: "CUSTOMER" },
    });

    const request = new Request("http://localhost:3000/api/orders");
    const response = await GET(request);
    const json = await response.json();

    expect(response.status).toBe(403);
    expect(json.success).toBe(false);
    expect(json.error).toContain("Chỉ Quản trị viên (ADMIN)");
  });

  it("cho phép ADMIN xem toàn bộ danh sách đơn hàng", async () => {
    mockAuth.mockResolvedValue({
      user: { id: "admin-1", name: "Quản trị viên", role: "ADMIN" },
    });

    const mockOrders = [
      {
        id: "ord-1",
        orderNumber: "HN-260930-0001",
        status: "PENDING",
        total: 5000000,
        customer: { fullName: "Công ty ABC", phone: "0901234567" },
        items: [],
      },
      {
        id: "ord-2",
        orderNumber: "HN-260930-0002",
        status: "COMPLETED",
        total: 12000000,
        customer: { fullName: "Tập đoàn XYZ", phone: "0909876543" },
        items: [],
      },
    ];

    db.order.findMany.mockResolvedValue(mockOrders);
    db.order.count.mockResolvedValue(2);

    const request = new Request(
      "http://localhost:3000/api/orders?limit=10&page=1"
    );
    const response = await GET(request);
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.count).toBe(2);
    expect(json.total).toBe(2);
    expect(json.totalPages).toBe(1);
    expect(json.orders).toHaveLength(2);
  });

  it("cho phép CUSTOMER xem các đơn hàng của chính mình qua param ?mine=true", async () => {
    mockAuth.mockResolvedValue({
      user: {
        id: "user-cust-1",
        email: "khachhang@gmail.com",
        role: "CUSTOMER",
      },
    });

    db.user.findUnique.mockResolvedValue({
      email: "khachhang@gmail.com",
      phone: "0912345678",
    });

    const myOrders = [
      {
        id: "ord-own-1",
        orderNumber: "HN-260930-7777",
        status: "PRODUCING",
        total: 3500000,
        customer: { fullName: "Khách hàng A", phone: "0912345678" },
        items: [],
      },
    ];

    db.order.findMany.mockResolvedValue(myOrders);
    db.order.count.mockResolvedValue(1);

    const request = new Request("http://localhost:3000/api/orders?mine=true");
    const response = await GET(request);
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.count).toBe(1);
    expect(json.orders[0].orderNumber).toBe("HN-260930-7777");
    expect(db.order.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          customer: expect.objectContaining({
            OR: expect.any(Array),
          }),
        }),
      })
    );
  });
});
