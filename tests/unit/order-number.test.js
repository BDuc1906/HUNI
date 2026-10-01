import { describe, it, expect } from "vitest";
import { generateOrderNumber } from "@/server/db";

describe("Order Number Generator (src/server/db.js)", () => {
  it("should match standard HDC format HN-YYMMDD-RANDOM", () => {
    const code = generateOrderNumber();
    // Pattern: HN- followed by 6 digits (YYMMDD), dash, and 4 digits
    const pattern = /^HN-\d{6}-\d{4}$/;
    expect(code).toMatch(pattern);
  });

  it("should include the current year, month, and date in the code", () => {
    const code = generateOrderNumber();
    const now = new Date();
    const yy = String(now.getFullYear()).slice(-2);
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");

    expect(code.startsWith(`HN-${yy}${mm}${dd}-`)).toBe(true);
  });

  it("should generate diverse order numbers across multiple invocations", () => {
    const generated = new Set();
    for (let i = 0; i < 20; i++) {
      generated.add(generateOrderNumber());
    }
    // High probability of diverse codes with random suffix
    expect(generated.size).toBeGreaterThanOrEqual(18);
  });
});
