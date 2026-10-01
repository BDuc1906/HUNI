// ==================================================
// src/shared/services/apiClient.js
// Frontend API Client SDK cho HUNI / HDC FASHION
// Tuân thủ 100% API_CONTRACT.md (Response Envelope & HTTP Status Codes)
// ==================================================

/**
 * Hàm gọi API chung với khả năng xử lý tự động Response Envelope và HTTP Status Codes
 * @param {string} endpoint - Đường dẫn API (ví dụ: "/api/products")
 * @param {RequestInit} [options={}] - Tuỳ chọn fetch
 * @returns {Promise<{success: boolean, data?: any, message?: string, error?: string, details?: any[], status: number}>}
 */
export async function apiFetch(endpoint, options = {}) {
  const { headers = {}, ...customOptions } = options;

  const defaultHeaders = {
    "Content-Type": "application/json",
    ...headers,
  };

  try {
    const response = await fetch(endpoint, {
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
    return apiFetch(`/api/products${qs ? `?${qs}` : ""}`);
  },

  /**
   * Lấy chi tiết sản phẩm theo ID hoặc Slug
   */
  async getProduct(idOrSlug) {
    return apiFetch(`/api/products/${encodeURIComponent(idOrSlug)}`);
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
    return apiFetch(`/api/admin/orders${qs ? `?${qs}` : ""}`);
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
    return apiFetch(`/api/admin/quotes${qs ? `?${qs}` : ""}`);
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
    return apiFetch(`/api/admin/customers${qs ? `?${qs}` : ""}`);
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
    return apiFetch("/api/admin/vouchers", {
      method: "PATCH",
      body: JSON.stringify({ id, active }),
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
  async register({ fullName, email, phone, password }) {
    return apiFetch("/api/register", {
      method: "POST",
      body: JSON.stringify({ fullName, email, phone, password }),
    });
  },
};
