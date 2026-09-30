import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock db singleton before importing route
vi.mock("@/server/db", () => {
  return {
    db: {
      customer: {
        findUnique: vi.fn(),
        create: vi.fn(),
      },
      quote: {
        create: vi.fn(),
      },
    },
    generateOrderNumber: vi.fn(() => "HN-260930-1234"),
  };
});

import { POST } from "@/app/api/quotes/route";
import { db } from "@/server/db";

describe("POST /api/quotes API Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 400 when body fails Zod schema validation", async () => {
    const invalidBody = {
      fullName: "A", // too short
      phone: "invalid-phone",
      category: "polo",
      quantity: 5, // < 10
    };

    const req = new Request("http://localhost:3000/api/quotes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(invalidBody),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.success).toBe(false);
    expect(Array.isArray(data.details)).toBe(true);
  });

  it("should create customer and quote successfully when payload is valid", async () => {
    const validBody = {
      fullName: "Nguyễn Văn Test",
      phone: "0984959586",
      email: "test@hdcfashion.vn",
      company: "HDC Test Corp",
      category: "polo",
      quantity: 50,
      notes: "May gấp",
    };

    // Customer does not exist yet
    db.customer.findUnique.mockResolvedValueOnce(null);
    db.customer.create.mockResolvedValueOnce({
      id: "cust-123",
      fullName: "Nguyễn Văn Test",
      phone: "0984959586",
    });

    db.quote.create.mockResolvedValueOnce({
      id: "quote-456",
      customerId: "cust-123",
      status: "NEW",
    });

    const req = new Request("http://localhost:3000/api/quotes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validBody),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(201);
    expect(data.success).toBe(true);
    expect(data.quoteId).toBe("quote-456");
    expect(db.customer.create).toHaveBeenCalled();
    expect(db.quote.create).toHaveBeenCalled();
  });
});
