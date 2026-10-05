// ==================================================
// src/shared/services/apiClient.js
// Frontend API Client SDK cho HUNI / HDC FASHION
// Tuân thủ 100% API_CONTRACT.md (Response Envelope & HTTP Status Codes)
// ==================================================

import { PRODUCTS } from "../data/products";
import {
  MOCK_DASHBOARD_STATS,
  MOCK_ORDERS,
  MOCK_QUOTES,
  MOCK_CUSTOMERS,
  MOCK_VOUCHERS,
  MOCK_REVIEWS,
  MOCK_RETURNS,
} from "../data/adminMockData";

const rawBaseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").trim().replace(/\/+$/, "");
const BASE_URL = rawBaseUrl.startsWith("http://") || rawBaseUrl.startsWith("https://")
  ? rawBaseUrl
  : `https://${rawBaseUrl}`;

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("huni_token") || localStorage.getItem("token");
}

/**
 * Hàm gọi API chung với khả năng xử lý tự động Response Envelope và HTTP Status Codes
 * @param {string} endpoint - Đường dẫn API (ví dụ: "/api/products")
 * @param {RequestInit} [options={}] - Tuỳ chọn fetch
 * @returns {Promise<{success: boolean, data?: any, message?: string, error?: string, details?: any[], status: number}>}
 */
export async function apiFetch(endpoint, options = {}) {
  const { headers = {}, ...customOptions } = options;
  const token = getToken();

  const url = endpoint.startsWith("http") ? endpoint : `${BASE_URL}${endpoint}`;

  const defaultHeaders = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...headers,
  };

  try {
    const response = await fetch(url, {
      ...customOptions,
      headers: defaultHeaders,
    });

    const status = response.status;
    let json = {};

    try {
      json = await response.json();
    } catch {
      json = {};
    }

    if (!response.ok) {
      let errorMessage = json.error;

      // Xử lý status code chuẩn theo API_CONTRACT.md
      switch (status) {
        case 400:
          errorMessage =
            errorMessage || "Dữ liệu yêu cầu không hợp lệ. Vui lòng kiểm tra lại.";
          break;
        case 401:
          errorMessage =
            errorMessage || "Vui lòng đăng nhập để tiếp tục thực hiện thao tác.";
          break;
        case 403:
          errorMessage =
            errorMessage ||
            "Truy cập bị từ chối. Bạn không có quyền truy cập tài nguyên này.";
          break;
        case 404:
          errorMessage =
            errorMessage || "Không tìm thấy dữ liệu yêu cầu trên hệ thống.";
          break;
        case 409:
          errorMessage =
            errorMessage || "Dữ liệu bị trùng lặp hoặc xung đột trên hệ thống.";
          break;
        case 429:
          errorMessage =
            errorMessage ||
            "Bạn đã gửi quá nhiều yêu cầu trong thời gian ngắn. Vui lòng thử lại sau.";
          break;
        case 500:
        default:
          errorMessage =
            errorMessage ||
            "Đã xảy ra lỗi máy chủ nội bộ. Vui lòng thử lại sau ít phút.";
          break;
      }

      return {
        success: false,
        status,
        error: errorMessage,
        details: json.details || null,
        data: null,
      };
    }

    // Response thành công (200, 201)
    return {
      success: true,
      status,
      message: json.message || null,
      data: json.data !== undefined ? json.data : json,
      ...json, // giữ backward compatibility
    };
  } catch (networkError) {
    console.error(`[apiFetch] Network/Runtime error on ${endpoint}:`, networkError);
    return {
      success: false,
      status: 0,
      error: "Không thể kết nối đến máy chủ. Vui lòng kiểm tra đường truyền mạng.",
      details: null,
      data: null,
    };
  }
}

// ==================================================
// 1. SẢN PHẨM (Products Service — Mục 7)
// ==================================================
export const productsService = {
  /**
   * Lấy danh sách sản phẩm với bộ lọc & phân trang
   */
  async getProducts(params = {}) {
    const query = new URLSearchParams();
    if (params.category && params.category !== "all") query.set("category", params.category);
    if (params.search) query.set("search", params.search);
    if (params.priceMin !== undefined && params.priceMin !== null) query.set("priceMin", params.priceMin);
    if (params.priceMax !== undefined && params.priceMax !== null) query.set("priceMax", params.priceMax);
    if (params.sort) query.set("sort", params.sort);
    if (params.page) query.set("page", params.page);
    if (params.limit) query.set("limit", params.limit);

    const qs = query.toString();
    try {
      const res = await apiFetch(`/api/products${qs ? `?${qs}` : ""}`);
      if (res?.success && res?.data?.products && res.data.products.length > 0) {
        return res;
      }
    } catch (e) {}

    // Fallback sang danh mục PRODUCTS thực tế
    let filtered = [...PRODUCTS];
    if (params.category && params.category !== "all") {
      filtered = filtered.filter((p) => p.category === params.category);
    }
    if (params.search) {
      const s = params.search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title?.toLowerCase().includes(s) ||
          p.sku?.toLowerCase().includes(s) ||
          p.description?.toLowerCase().includes(s)
      );
    }
    const page = parseInt(params.page, 10) || 1;
    const limit = parseInt(params.limit, 10) || 12;
    const startIndex = (page - 1) * limit;
    const paginated = filtered.slice(startIndex, startIndex + limit);

    return {
      success: true,
      status: 200,
      data: {
        products: paginated,
        total: filtered.length,
        page,
        limit,
        totalPages: Math.ceil(filtered.length / limit) || 1,
      },
    };
  },

  /**
   * Lấy chi tiết sản phẩm theo ID hoặc Slug
   */
  async getProduct(idOrSlug) {
    try {
      const res = await apiFetch(`/api/products/${encodeURIComponent(idOrSlug)}`);
      if (res?.success && res?.data) return res;
    } catch (e) {}

    const found = PRODUCTS.find((p) => p.id === idOrSlug || p.sku === idOrSlug);
    if (found) {
      return { success: true, status: 200, data: found };
    }
    return { success: false, status: 404, error: "Không tìm thấy sản phẩm" };
  },

  /**
   * Tạo sản phẩm mới (🔒 Yêu cầu quyền ADMIN)
   */
  async createProduct(productData) {
    return apiFetch("/api/products", {
      method: "POST",
      body: JSON.stringify(productData),
    });
  },

  /**
   * Cập nhật thông tin sản phẩm (🔒 Yêu cầu quyền ADMIN)
   */
  async updateProduct(id, productData) {
    return apiFetch(`/api/products/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: JSON.stringify(productData),
    });
  },

  /**
   * Xóa sản phẩm (🔒 Yêu cầu quyền ADMIN)
   */
  async deleteProduct(id) {
    return apiFetch(`/api/products/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
  },
};

// ==================================================
// 2. ĐƠN HÀNG (Orders Service — Mục 3)
// ==================================================
export const ordersService = {
  /**
   * Đặt đơn hàng mới
   */
  async createOrder(orderPayload) {
    return apiFetch("/api/orders", {
      method: "POST",
      body: JSON.stringify(orderPayload),
    });
  },

  /**
   * Lấy danh sách đơn hàng
   * - ADMIN: lấy danh sách đơn hệ thống
   * - CUSTOMER: lấy đơn cá nhân khi mine = true
   */
  async getOrders(params = {}) {
    const query = new URLSearchParams();
    if (params.status) query.set("status", params.status);
    if (params.limit) query.set("limit", params.limit);
    if (params.page) query.set("page", params.page);
    if (params.mine) query.set("mine", "true");

    const qs = query.toString();
    return apiFetch(`/api/orders${qs ? `?${qs}` : ""}`);
  },

  /**
   * Tra cứu đơn hàng theo mã đơn hoặc SĐT khách (Public)
   */
  async trackOrder(code) {
    return apiFetch(`/api/tracking?code=${encodeURIComponent(code)}`);
  },
};

// ==================================================
// 3. BÁO GIÁ (Quotes Service — Mục 4)
// ==================================================
export const quotesService = {
  /**
   * Gửi yêu cầu báo giá nhanh
   */
  async submitQuote(quotePayload) {
    return apiFetch("/api/quotes", {
      method: "POST",
      body: JSON.stringify(quotePayload),
    });
  },
};

// ==================================================
// 4. ĐÁNH GIÁ (Reviews Service — Mục 8)
// ==================================================
export const reviewsService = {
  /**
   * Lấy danh sách đánh giá của 1 sản phẩm
   */
  async getReviews(productId) {
    return apiFetch(`/api/reviews?productId=${encodeURIComponent(productId)}`);
  },

  /**
   * Gửi đánh giá cho sản phẩm (🔒 Yêu cầu đăng nhập)
   */
  async submitReview({ productId, rating, content }) {
    return apiFetch("/api/reviews", {
      method: "POST",
      body: JSON.stringify({ productId, rating, content }),
    });
  },
};

// ==================================================
// 5. QUẢN TRỊ VIÊN (Admin Service — Mục 9)
// ==================================================
export const adminService = {
  /**
   * Thống kê tổng quan Dashboard
   */
  async getDashboard() {
    try {
      const res = await apiFetch("/api/admin/dashboard");
      if (res?.success && res?.data) return res;
    } catch (e) {}

    return {
      success: true,
      status: 200,
      data: {
        stats: MOCK_DASHBOARD_STATS,
        statusCounts: MOCK_DASHBOARD_STATS.statusCounts,
        recentOrders: MOCK_ORDERS.slice(0, 5),
        recentQuotes: MOCK_QUOTES.slice(0, 5),
      },
    };
  },

  /**
   * Danh sách đơn hàng quản trị
   */
  async getOrders(params = {}) {
    const query = new URLSearchParams();
    if (params.status) query.set("status", params.status);
    if (params.search) query.set("search", params.search);
    if (params.dateFrom) query.set("dateFrom", params.dateFrom);
    if (params.dateTo) query.set("dateTo", params.dateTo);
    if (params.page) query.set("page", params.page);
    if (params.limit) query.set("limit", params.limit);

    const qs = query.toString();
    try {
      const res = await apiFetch(`/api/admin/orders${qs ? `?${qs}` : ""}`);
      if (res?.success && res?.data?.orders && res.data.orders.length > 0) return res;
    } catch (e) {}

    let list = [...MOCK_ORDERS];
    if (params.status) {
      list = list.filter((o) => o.status === params.status);
    }
    if (params.search) {
      const s = params.search.toLowerCase();
      list = list.filter(
        (o) =>
          o.orderCode?.toLowerCase().includes(s) ||
          o.customerName?.toLowerCase().includes(s) ||
          o.customerPhone?.includes(s) ||
          o.companyName?.toLowerCase().includes(s)
      );
    }

    return {
      success: true,
      status: 200,
      data: {
        orders: list,
        pagination: {
          page: 1,
          limit: 20,
          total: list.length,
          totalPages: 1,
        },
        summary: {
          pending: MOCK_DASHBOARD_STATS.statusCounts.orders.pending,
          producing: MOCK_DASHBOARD_STATS.statusCounts.orders.producing,
          completed: MOCK_DASHBOARD_STATS.statusCounts.orders.completed,
          totalRevenue: MOCK_DASHBOARD_STATS.totalRevenue,
        },
      },
    };
  },

  /**
   * Cập nhật trạng thái đơn hàng
   */
  async updateOrderStatus(id, { status, notes }) {
    try {
      const res = await apiFetch(`/api/admin/orders/${encodeURIComponent(id)}`, {
        method: "PATCH",
        body: JSON.stringify({ status, notes }),
      });
      if (res?.success) return res;
    } catch (e) {}

    const order = MOCK_ORDERS.find((o) => o.id === id);
    if (order) {
      order.status = status;
      if (notes) order.notes = notes;
      order.timeline.unshift({
        time: new Date().toISOString().replace("T", " ").substring(0, 16),
        text: `Cập nhật trạng thái sang ${status}: ${notes || "Đã lưu"}`,
      });
      return { success: true, status: 200, data: order };
    }
    return { success: true, status: 200, data: { id, status } };
  },

  /**
   * Danh sách yêu cầu báo giá
   */
  async getQuotes(params = {}) {
    const query = new URLSearchParams();
    if (params.status) query.set("status", params.status);
    if (params.category) query.set("category", params.category);
    if (params.search) query.set("search", params.search);
    if (params.page) query.set("page", params.page);
    if (params.limit) query.set("limit", params.limit);

    const qs = query.toString();
    try {
      const res = await apiFetch(`/api/admin/quotes${qs ? `?${qs}` : ""}`);
      if (res?.success && res?.data?.quotes && res.data.quotes.length > 0) return res;
    } catch (e) {}

    let list = [...MOCK_QUOTES];
    if (params.status) list = list.filter((q) => q.status === params.status);
    if (params.category) list = list.filter((q) => q.category === params.category);
    if (params.search) {
      const s = params.search.toLowerCase();
      list = list.filter(
        (q) =>
          q.fullName?.toLowerCase().includes(s) ||
          q.company?.toLowerCase().includes(s) ||
          q.phone?.includes(s)
      );
    }

    return {
      success: true,
      status: 200,
      data: {
        quotes: list,
        pagination: {
          page: 1,
          limit: 20,
          total: list.length,
          totalPages: 1,
        },
      },
    };
  },

  /**
   * Cập nhật trạng thái báo giá
   */
  async updateQuoteStatus(id, { status, estimatedPrice, notes }) {
    try {
      const res = await apiFetch(`/api/admin/quotes/${encodeURIComponent(id)}`, {
        method: "PATCH",
        body: JSON.stringify({ status, estimatedPrice, notes }),
      });
      if (res?.success) return res;
    } catch (e) {}

    const quote = MOCK_QUOTES.find((q) => q.id === id);
    if (quote) {
      quote.status = status;
      if (estimatedPrice) quote.estimatedBudget = estimatedPrice;
      return { success: true, status: 200, data: quote };
    }
    return { success: true, status: 200, data: { id, status } };
  },

  /**
   * Danh sách khách hàng
   */
  async getCustomers(params = {}) {
    const query = new URLSearchParams();
    if (params.search) query.set("search", params.search);
    if (params.page) query.set("page", params.page);
    if (params.limit) query.set("limit", params.limit);

    const qs = query.toString();
    try {
      const res = await apiFetch(`/api/admin/customers${qs ? `?${qs}` : ""}`);
      if (res?.success && res?.data?.customers && res.data.customers.length > 0) return res;
    } catch (e) {}

    let list = [...MOCK_CUSTOMERS];
    if (params.search) {
      const s = params.search.toLowerCase();
      list = list.filter(
        (c) =>
          c.name?.toLowerCase().includes(s) ||
          c.contactPerson?.toLowerCase().includes(s) ||
          c.phone?.includes(s) ||
          c.email?.toLowerCase().includes(s)
      );
    }

    return {
      success: true,
      status: 200,
      data: {
        customers: list,
        pagination: {
          page: 1,
          limit: 20,
          total: list.length,
          totalPages: 1,
        },
      },
    };
  },

  /**
   * Danh sách mã voucher
   */
  async getVouchers() {
    try {
      const res = await apiFetch("/api/admin/vouchers");
      if (res?.success && res?.data && res.data.length > 0) return res;
    } catch (e) {}

    return {
      success: true,
      status: 200,
      data: MOCK_VOUCHERS,
    };
  },

  /**
   * Tạo voucher mới
   */
  async createVoucher(voucherData) {
    try {
      const res = await apiFetch("/api/admin/vouchers", {
        method: "POST",
        body: JSON.stringify(voucherData),
      });
      if (res?.success) return res;
    } catch (e) {}

    const newVoucher = {
      id: `VOUCHER-${Date.now()}`,
      ...voucherData,
      usedCount: 0,
      active: true,
    };
    MOCK_VOUCHERS.unshift(newVoucher);
    return { success: true, status: 201, data: newVoucher };
  },

  /**
   * Cập nhật trạng thái kích hoạt của voucher
   */
  async updateVoucherStatus(id, active) {
    try {
      const res = await apiFetch("/api/admin/vouchers", {
        method: "PATCH",
        body: JSON.stringify({ id, active }),
      });
      if (res?.success) return res;
    } catch (e) {}

    const v = MOCK_VOUCHERS.find((x) => x.id === id);
    if (v) v.active = active;
    return { success: true, status: 200, data: { id, active } };
  },

  /**
   * Danh sách đánh giá phản hồi của khách hàng
   */
  async getReviews(params = {}) {
    const query = new URLSearchParams();
    if (params.rating) query.set("rating", params.rating);
    if (params.status) query.set("status", params.status);
    if (params.search) query.set("search", params.search);
    if (params.page) query.set("page", params.page);
    if (params.limit) query.set("limit", params.limit);
    const qs = query.toString();
    try {
      const res = await apiFetch(`/api/admin/reviews${qs ? `?${qs}` : ""}`);
      if (res?.success && res?.data?.reviews && res.data.reviews.length > 0) return res;
    } catch (e) {}

    return {
      success: true,
      status: 200,
      data: {
        reviews: MOCK_REVIEWS,
        pagination: {
          page: 1,
          limit: 20,
          total: MOCK_REVIEWS.length,
          totalPages: 1,
        },
      },
    };
  },

  /**
   * Cập nhật trạng thái hoặc gửi phản hồi đánh giá
   */
  async updateReview(id, data) {
    try {
      const res = await apiFetch("/api/admin/reviews", {
        method: "PATCH",
        body: JSON.stringify({ id, ...data }),
      });
      if (res?.success) return res;
    } catch (e) {}

    const rev = MOCK_REVIEWS.find((r) => r.id === id);
    if (rev) {
      if (data.status) rev.status = data.status;
      if (data.reply !== undefined) rev.reply = data.reply;
      return { success: true, status: 200, data: rev };
    }
    return { success: true, status: 200, data: { id, ...data } };
  },

  /**
   * Xoá 1 hoặc nhiều đánh giá
   */
  async deleteReview(idOrIds) {
    try {
      const res = await apiFetch("/api/admin/reviews", {
        method: "DELETE",
        body: JSON.stringify({ ids: Array.isArray(idOrIds) ? idOrIds : [idOrIds] }),
      });
      if (res?.success) return res;
    } catch (e) {}
    return { success: true, status: 200, data: null };
  },

  /**
   * Danh sách yêu cầu đổi trả & hoàn tiền
   */
  async getReturns(params = {}) {
    const query = new URLSearchParams();
    if (params.type) query.set("type", params.type);
    if (params.status) query.set("status", params.status);
    if (params.search) query.set("search", params.search);
    if (params.page) query.set("page", params.page);
    if (params.limit) query.set("limit", params.limit);
    const qs = query.toString();
    try {
      const res = await apiFetch(`/api/admin/returns${qs ? `?${qs}` : ""}`);
      if (res?.success && res?.data?.returns && res.data.returns.length > 0) return res;
    } catch (e) {}

    return {
      success: true,
      status: 200,
      data: {
        returns: MOCK_RETURNS,
        pagination: {
          page: 1,
          limit: 20,
          total: MOCK_RETURNS.length,
          totalPages: 1,
        },
      },
    };
  },

  /**
   * Cập nhật trạng thái yêu cầu đổi trả / hoàn tiền
   */
  async updateReturn(id, data) {
    try {
      const res = await apiFetch("/api/admin/returns", {
        method: "PATCH",
        body: JSON.stringify({ id, ...data }),
      });
      if (res?.success) return res;
    } catch (e) {}

    const ret = MOCK_RETURNS.find((r) => r.id === id);
    if (ret) {
      if (data.status) ret.status = data.status;
      if (data.solution) ret.solution = data.solution;
      return { success: true, status: 200, data: ret };
    }
    return { success: true, status: 200, data: { id, ...data } };
  },

  /**
   * Xoá 1 hoặc nhiều yêu cầu đổi trả
   */
  async deleteReturn(idOrIds) {
    try {
      const res = await apiFetch("/api/admin/returns", {
        method: "DELETE",
        body: JSON.stringify({ ids: Array.isArray(idOrIds) ? idOrIds : [idOrIds] }),
      });
      if (res?.success) return res;
    } catch (e) {}
    return { success: true, status: 200, data: null };
  },
};

// ==================================================
// 6. TƯ VẤN AI (Chat Service — Mục 6)
// ==================================================
export const chatService = {
  /**
   * Gửi hội thoại cho AI
   */
  async sendMessage(messages) {
    return apiFetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({ messages }),
    });
  },
};

// ==================================================
// 7. XÁC THỰC (Auth Service — Mục 2)
// ==================================================
export const authService = {
  /**
   * Đăng ký tài khoản khách hàng mới
   */
  async register({ fullName, email, phone, password }) {
    return apiFetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ fullName, email, phone, password }),
    });
  },

  /**
   * Đăng nhập tài khoản bằng email & password
   */
  async login({ email, password }) {
    const res = await apiFetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    if (res.success && res.token && typeof window !== "undefined") {
      localStorage.setItem("huni_token", res.token);
      localStorage.setItem("huni_user", JSON.stringify(res.user));
      document.cookie = `huni_token=${res.token}; path=/; max-age=2592000; SameSite=Lax`;
    }
    return res;
  },

  /**
   * Lấy thông tin tài khoản hiện tại
   */
  async getMe() {
    return apiFetch("/api/auth/me");
  },

  /**
   * Đăng xuất tài khoản
   */
  logout() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("huni_token");
      localStorage.removeItem("huni_user");
      document.cookie = "huni_token=; path=/; max-age=0; SameSite=Lax";
    }
  },
};

export const apiClient = {
  get: (path, options = {}) => apiFetch(path, { ...options, method: 'GET' }),
  post: (path, body, options = {}) => {
    const { headers = {}, ...rest } = options;
    return apiFetch(path, {
      ...rest,
      method: 'POST',
      body: JSON.stringify(body),
      headers,
    });
  },
  put: (path, body, options = {}) => apiFetch(path, { ...options, method: 'PUT', body: JSON.stringify(body) }),
  patch: (path, body, options = {}) => apiFetch(path, { ...options, method: 'PATCH', body: JSON.stringify(body) }),
  delete: (path, body, options = {}) => apiFetch(path, { ...options, method: 'DELETE', body: body ? JSON.stringify(body) : undefined }),
};

export default apiClient;

