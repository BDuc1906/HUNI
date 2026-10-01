import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/server/db", () => {
  return {
    db: {
      order: {
        findFirst: vi.fn(),
      },
    },
  };
});

import { GET } from "@/app/api/tracking/route";
import { db } from "@/server/db";

describe("GET /api/tracking API Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 400 when tracking code is missing", async () => {
    const req = new Request("http://localhost:3000/api/tracking");
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toContain("Thiếu mã");
  });

  it("should return order details when valid order code is found", async () => {
    const mockOrder = {
      id: "ord-1",
      orderNumber: "HN-260930-9999",
      status: "PRODUCING",
      total: 5000000,
      customer: {
        fullName: "Khách hàng Test",
        phone: "0984959586",
      },
      items: [
        {
          id: "item-1",
          productName: "Áo Polo Đồng Phục",
          quantity: 25,
          unitPrice: 200000,
        },
      ],
    };

    db.order.findFirst.mockResolvedValueOnce(mockOrder);

    const req = new Request("http://localhost:3000/api/tracking?code=HN-260930-9999");
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.order.orderNumber).toBe("HN-260930-9999");
    expect(data.order.status).toBe("PRODUCING");
  });

  it("should return order: null when order is not found in database", async () => {
    db.order.findFirst.mockResolvedValueOnce(null);

    const req = new Request("http://localhost:3000/api/tracking?code=HN-000000-0000");
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.order).toBeNull();
  });
});
