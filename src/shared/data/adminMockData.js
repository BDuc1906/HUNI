// ============================================================
// src/shared/data/adminMockData.js
// Mock data removed. Cổng Quản Trị HDC Fashion kết nối 100% với PostgreSQL Database via EF Core.
// ============================================================

export const MOCK_DASHBOARD_STATS = {
  totalOrders: 0,
  totalRevenue: 0,
  totalQuotes: 0,
  totalCustomers: 0,
  statusCounts: {
    orders: {
      pending: 0,
      quoted: 0,
      confirmed: 0,
      producing: 0,
      shipped: 0,
      completed: 0,
      cancelled: 0,
    },
    quotes: {
      new: 0,
      contacted: 0,
      quoted: 0,
      converted: 0,
      closed: 0,
    },
  },
};

export const MOCK_ORDERS = [];
export const MOCK_QUOTES = [];
export const MOCK_CUSTOMERS = [];
export const MOCK_VOUCHERS = [];
export const MOCK_REVIEWS = [];
export const MOCK_RETURNS = [];
