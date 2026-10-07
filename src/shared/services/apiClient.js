// ==================================================
// src/shared/services/apiClient.js
// Frontend API Client SDK cho HUNI / HDC FASHION
// Tuân thủ 100% API_CONTRACT.md (Response Envelope & HTTP Status Codes)
// ==================================================

import { PRODUCTS } from "../data/products";

const rawBaseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").trim().replace(/\/+$/, "");
const BASE_URL = rawBaseUrl.startsWith("http://") || rawBaseUrl.startsWith("https://")
  ? rawBaseUrl
  : `https://${rawBaseUrl}`;

export async function apiFetch(endpoint, options = {}) {
  const { headers = {}, ...customOptions } = options;

  const url = endpoint.startsWith("http") ? endpoint : `${BASE_URL}${endpoint}`;

  const defaultHeaders = {
    "Content-Type": "application/json",
    ...headers,
  };

  try {
    const response = await fetch(url, {
      ...customOptions,
      headers: defaultHeaders,
      credentials: "include", // gửi cookie cross-origin
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
    return apiFetch("/api/admin/dashboard");
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
    const res = await apiFetch(`/api/admin/orders${qs ? `?${qs}` : ""}`);
    if (res?.success && res?.data) {
      if (!res.data.pagination && res.data.total !== undefined) {
        res.data.pagination = {
          page: res.data.page || 1,
          limit: res.data.limit || 20,
          total: res.data.total || 0,
          totalPages: res.data.totalPages || 1,
        };
      }
    }
    return res;
  },

  /**
   * Cập nhật trạng thái đơn hàng
   */
  async updateOrderStatus(id, { status, notes }) {
    return apiFetch(`/api/admin/orders/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify({ status, notes }),
    });
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
    const res = await apiFetch(`/api/admin/quotes${qs ? `?${qs}` : ""}`);
    if (res?.success && res?.data) {
      if (!res.data.pagination && res.data.total !== undefined) {
        res.data.pagination = {
          page: res.data.page || 1,
          limit: res.data.limit || 20,
          total: res.data.total || 0,
          totalPages: res.data.totalPages || 1,
        };
      }
    }
    return res;
  },

  /**
   * Cập nhật trạng thái báo giá
   */
  async updateQuoteStatus(id, { status, estimatedPrice, notes }) {
    return apiFetch(`/api/admin/quotes/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify({ status, estimatedPrice, notes }),
    });
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
    const res = await apiFetch(`/api/admin/customers${qs ? `?${qs}` : ""}`);
    if (res?.success && res?.data) {
      if (!res.data.pagination && res.data.total !== undefined) {
        res.data.pagination = {
          page: res.data.page || 1,
          limit: res.data.limit || 20,
          total: res.data.total || 0,
          totalPages: res.data.totalPages || 1,
        };
      }
    }
    return res;
  },

  /**
   * Danh sách mã voucher
   */
  async getVouchers() {
    return apiFetch("/api/admin/vouchers");
  },

  /**
   * Tạo voucher mới
   */
  async createVoucher(voucherData) {
    return apiFetch("/api/admin/vouchers", {
      method: "POST",
      body: JSON.stringify(voucherData),
    });
  },

  /**
   * Cập nhật trạng thái kích hoạt của voucher
   */
  async updateVoucherStatus(id, active) {
    return apiFetch(`/api/admin/vouchers/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify({ active }),
    });
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
    const res = await apiFetch(`/api/admin/reviews${qs ? `?${qs}` : ""}`);
    if (res?.success && res?.data) {
      if (!res.data.pagination && res.data.total !== undefined) {
        res.data.pagination = {
          page: res.data.page || 1,
          limit: res.data.limit || 10,
          total: res.data.total || 0,
          totalPages: res.data.totalPages || 1,
        };
      }
    }
    return res;
  },

  /**
   * Cập nhật trạng thái hoặc gửi phản hồi đánh giá
   */
  async updateReview(id, data) {
    return apiFetch("/api/admin/reviews", {
      method: "PATCH",
      body: JSON.stringify({ id, ...data }),
    });
  },

  /**
   * Xoá 1 hoặc nhiều đánh giá
   */
  async deleteReview(idOrIds) {
    return apiFetch("/api/admin/reviews", {
      method: "DELETE",
      body: JSON.stringify({ ids: Array.isArray(idOrIds) ? idOrIds : [idOrIds] }),
    });
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
    const res = await apiFetch(`/api/admin/returns${qs ? `?${qs}` : ""}`);
    if (res?.success && res?.data) {
      if (!res.data.pagination && res.data.total !== undefined) {
        res.data.pagination = {
          page: res.data.page || 1,
          limit: res.data.limit || 10,
          total: res.data.total || 0,
          totalPages: res.data.totalPages || 1,
        };
      }
    }
    return res;
  },

  /**
   * Cập nhật trạng thái yêu cầu đổi trả / hoàn tiền
   */
  async updateReturn(id, data) {
    return apiFetch("/api/admin/returns", {
      method: "PATCH",
      body: JSON.stringify({
        id,
        status: data.status,
        adminNotes: data.adminNotes || data.notes || data.solution,
        refundAmount: data.refundAmount,
      }),
    });
  },

  /**
   * Xoá 1 hoặc nhiều yêu cầu đổi trả
   */
  async deleteReturn(idOrIds) {
    return apiFetch("/api/admin/returns", {
      method: "DELETE",
      body: JSON.stringify({ ids: Array.isArray(idOrIds) ? idOrIds : [idOrIds] }),
    });
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
  async register(dataOrName, maybeEmail, maybePhone, maybePassword) {
    let payload;
    if (typeof dataOrName === "object" && dataOrName !== null) {
      payload = dataOrName;
    } else {
      payload = {
        fullName: dataOrName,
        email: maybeEmail,
        phone: maybePhone,
        password: maybePassword,
      };
    }
    return apiFetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  /**
   * Đăng nhập tài khoản bằng email & password
   */
  async login(emailOrObj, maybePassword) {
    let email, password;
    if (typeof emailOrObj === "object" && emailOrObj !== null) {
      email = emailOrObj.email;
      password = emailOrObj.password;
    } else {
      email = emailOrObj;
      password = maybePassword;
    }

    const res = await apiFetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    if (res.success && res.user && typeof window !== "undefined") {
      sessionStorage.setItem("huni_user", JSON.stringify(res.user));
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
      sessionStorage.removeItem("huni_user");
      // Gọi BE để xóa httpOnly cookie (JS không xóa được)
      fetch(`${BASE_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      }).catch(() => {});
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

