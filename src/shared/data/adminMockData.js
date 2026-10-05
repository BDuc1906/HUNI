// ============================================================
// src/shared/data/adminMockData.js
// Dữ liệu mẫu chuẩn nghiệp vụ cho Cổng Quản Trị HDC Fashion
// ============================================================

import { PRODUCTS } from "./products";

/* ============================================================
   DASHBOARD STATS
   ============================================================ */
export const MOCK_DASHBOARD_STATS = {
  totalOrders: 148,
  totalRevenue: 856400000,
  totalQuotes: 34,
  totalCustomers: 68,
  statusCounts: {
    orders: {
      pending: 12,
      quoted: 8,
      confirmed: 24,
      producing: 42,
      shipped: 18,
      completed: 40,
      cancelled: 4,
    },
    quotes: {
      new: 9,
      contacted: 11,
      quoted: 8,
      converted: 4,
      closed: 2,
    },
  },
};

/* ============================================================
   DASHBOARD CHARTS DATA (MỚI)
   ============================================================ */
export const MOCK_REVENUE_KPI = {
  current: 856400000,
  target: 1000000000,
  delta: 12.5,
  comparedTo: "last month",
};

export const MOCK_FUNNEL_B2B = [
  { stage: "Quote gửi",  value: 34, percentage: 100, color: "#0097B2" },
  { stage: "Đã liên hệ", value: 28, percentage: 82,  color: "#33B0CB" },
  { stage: "Đã báo giá", value: 22, percentage: 65,  color: "#66C5D8" },
  { stage: "Chốt đơn",   value: 14, percentage: 41,  color: "#99D9E5" },
  { stage: "Hoàn thành", value: 12, percentage: 35,  color: "#CCECF2" },
];

export const MOCK_REVENUE_BY_CATEGORY = [
  { category: "Polo Doanh Nghiệp", revenue: 385000000, percentage: 45, color: "#0097B2" },
  { category: "Sơ Mi Công Sở",     revenue: 214000000, percentage: 25, color: "#33B0CB" },
  { category: "Vest Lãnh Đạo",     revenue: 128500000, percentage: 15, color: "#66C5D8" },
  { category: "Đồng Phục Golf",    revenue: 85600000,  percentage: 10, color: "#99D9E5" },
  { category: "Phụ Kiện",          revenue: 43300000,  percentage: 5,  color: "#CCECF2" },
];

export const MOCK_TOP_PRODUCTS = [
  { id: 1, name: "Áo Polo Doanh Nghiệp HDC Classic Gold",  sold: 234, revenue: 43290000 },
  { id: 2, name: "Sơ Mi Ngắn Tay HDC Classic Xanh Đậm",    sold: 189, revenue: 44415000 },
  { id: 3, name: "Bộ Vest Doanh Nhân HDC Royal Bespoke",   sold: 145, revenue: 268250000 },
  { id: 4, name: "Set Golf & Pickleball HDC AeroCool Pro", sold: 98,  revenue: 28910000 },
  { id: 5, name: "Phụ Kiện Branding VIP Pack HDC",         sold: 67,  revenue: 9715000 },
];

export const MOCK_ALERTS = [
  {
    id: 1,
    type: "danger",
    icon: "Clock",
    title: "5 đơn hàng chờ xử lý quá 24h",
    action: "/admin/orders?status=PENDING",
    cta: "Xử lý ngay",
  },
  {
    id: 2,
    type: "warning",
    icon: "FileText",
    title: "3 yêu cầu báo giá mới chưa liên hệ",
    action: "/admin/quotes?status=NEW",
    cta: "Xem báo giá",
  },
  {
    id: 3,
    type: "info",
    icon: "RotateCcw",
    title: "2 yêu cầu đổi trả đang chờ duyệt",
    action: "/admin/returns",
    cta: "Duyệt",
  },
  {
    id: 4,
    type: "success",
    icon: "TrendingUp",
    title: "Doanh thu tháng này vượt 85% mục tiêu",
    action: "/admin/orders",
    cta: "Xem chi tiết",
  },
];

/* ============================================================
   ORDERS — 5 đơn hàng mẫu
   ============================================================ */
export const MOCK_ORDERS = [
  {
    id: "HDC-ORD-2026-001",
    orderCode: "HDC-ORD-2026-001",
    createdAt: "2026-10-02T14:30:00Z",
    customerName: "Nguyễn Văn Hùng",
    customerPhone: "0912 345 678",
    customerEmail: "hung.nv@vingroup.net",
    companyName: "Tập Đoàn Vingroup - Khối Vận Hành",
    shippingAddress: "Tòa nhà Symphony, Chu Huy Mân, Long Biên, Hà Nội",
    status: "PRODUCING",
    depositPaid: 45000000,
    totalAmount: 89500000,
    paymentMethod: "BANK_TRANSFER",
    paymentStatus: "PARTIAL",
    deliveryDate: "2026-10-15",
    items: [
      {
        id: "hdc-shirt-short-1",
        title: "Sơ Mi Ngắn Tay HDC Classic Xanh Đậm",
        image: "/images/05_bestseller_shirts_01.jpg",
        color: "Xanh Đậm",
        size: "40",
        quantity: 150,
        unitPrice: 175000,
        totalPrice: 26250000,
      },
      {
        id: "hdc-polo-premium-01",
        title: "Áo Polo Đồng Phục Doanh Nghiệp CVC Pique",
        image: "/images/01_hero_slide_01.jpg",
        color: "Xanh Navy",
        size: "L",
        quantity: 350,
        unitPrice: 180000,
        totalPrice: 63000000,
      },
    ],
    notes: "Thêu logo ngực trái màu trắng bạc vi tính nét cao, may viền cổ bo dệt kháng khuẩn.",
    timeline: [
      { time: "2026-10-02 14:30", text: "Khách hàng duyệt thiết kế 2D và ký hợp đồng sản xuất." },
      { time: "2026-10-02 16:00", text: "Kế toán xác nhận nhận tiền cọc 50% (45.000.000đ)." },
      { time: "2026-10-03 08:30", text: "Xưởng may HDC cắt vải Kate Ý và tiến hành thêu logo tự động." },
    ],
  },
  {
    id: "HDC-ORD-2026-002",
    orderCode: "HDC-ORD-2026-002",
    createdAt: "2026-10-02T10:15:00Z",
    customerName: "Trần Mai Anh",
    customerPhone: "0988 765 432",
    customerEmail: "maianh.tran@fpt.com",
    companyName: "FPT Software F-Town 3",
    shippingAddress: "Khu Công Nghệ Cao, P. Long Thạnh Mỹ, TP. Thủ Đức, TP.HCM",
    status: "CONFIRMED",
    depositPaid: 25000000,
    totalAmount: 52000000,
    paymentMethod: "BANK_TRANSFER",
    paymentStatus: "PARTIAL",
    deliveryDate: "2026-10-20",
    items: [
      {
        id: "hdc-polo-coolmax-02",
        title: "Áo Polo Thể Thao Phối Bo Cổ Công Nghệ AeroCool",
        image: "/images/02_banner_polo_sport.jpg",
        color: "Cam San Hô",
        size: "XL",
        quantity: 260,
        unitPrice: 200000,
        totalPrice: 52000000,
      },
    ],
    notes: "In chuyển nhiệt slogan kỷ niệm 15 năm thành lập chi nhánh sau lưng.",
    timeline: [
      { time: "2026-10-02 10:15", text: "Tạo đơn hàng từ báo giá B2B #HDC-QT-109." },
      { time: "2026-10-02 11:30", text: "Đã duyệt mẫu áo thử 0đ gửi qua bưu điện." },
    ],
  },
  {
    id: "HDC-ORD-2026-003",
    orderCode: "HDC-ORD-2026-003",
    createdAt: "2026-10-01T16:45:00Z",
    customerName: "Lê Hoàng Quân",
    customerPhone: "0903 112 334",
    customerEmail: "quan.lh@vietcombank.com.vn",
    companyName: "Vietcombank Chi Nhánh Trụ Sở Chính",
    shippingAddress: "198 Trần Quang Khải, Hoàn Kiếm, Hà Nội",
    status: "PENDING",
    depositPaid: 0,
    totalAmount: 145000000,
    paymentMethod: "BANK_TRANSFER",
    paymentStatus: "UNPAID",
    deliveryDate: "2026-11-05",
    items: [
      {
        id: "hdc-vest-luxury-01",
        title: "Bộ Vest Doanh Nhân May Đo Cao Cấp Len Ý",
        image: "/images/03_banner_tailored_suit.jpg",
        color: "Đen Than",
        size: "May đo cá nhân",
        quantity: 50,
        unitPrice: 2900000,
        totalPrice: 145000000,
      },
    ],
    notes: "Thợ may đo lấy số đo trực tiếp tại hội sở Vietcombank vào thứ 2 tuần tới.",
    timeline: [
      { time: "2026-10-01 16:45", text: "Yêu cầu đặt may đo cao cấp được tiếp nhận." },
    ],
  },
  {
    id: "HDC-ORD-2026-004",
    orderCode: "HDC-ORD-2026-004",
    createdAt: "2026-09-30T09:20:00Z",
    customerName: "Phạm Thu Hương",
    customerPhone: "0977 456 789",
    customerEmail: "huong.pt@gamuda.com.my",
    companyName: "Gamuda Land Vietnam",
    shippingAddress: "Gamuda City, Km 1.5 Pháp Vân, Công viên Yên Sở, Hà Nội",
    status: "SHIPPED",
    depositPaid: 38000000,
    totalAmount: 38000000,
    paymentMethod: "BANK_TRANSFER",
    paymentStatus: "PAID",
    deliveryDate: "2026-10-04",
    items: [
      {
        id: "hdc-golf-shirt-01",
        title: "Áo Thun Thể Thao Golf HDC Pro Dry-Fit",
        image: "/images/04_banner_school_sport.jpg",
        color: "Trắng Phối Xanh",
        size: "M",
        quantity: 180,
        unitPrice: 211000,
        totalPrice: 38000000,
      },
    ],
    notes: "Giao hàng trực tiếp cho ban tổ chức giải Golf G-Open 2026.",
    timeline: [
      { time: "2026-09-30 09:20", text: "Tiếp nhận đơn hàng giải đấu." },
      { time: "2026-10-01 14:00", text: "Hoàn tất sản xuất và kiểm thử chất lượng KCS." },
      { time: "2026-10-03 09:00", text: "Đang vận chuyển hỏa tốc xe riêng tới sân Golf." },
    ],
  },
  {
    id: "HDC-ORD-2026-005",
    orderCode: "HDC-ORD-2026-005",
    createdAt: "2026-09-28T11:00:00Z",
    customerName: "Vũ Đức Trọng",
    customerPhone: "0934 889 900",
    customerEmail: "trong.vd@shopee.vn",
    companyName: "Shopee Express Việt Nam",
    shippingAddress: "Kho Tổng Củ Chi, Quốc Lộ 22, Củ Chi, TP.HCM",
    status: "COMPLETED",
    depositPaid: 112000000,
    totalAmount: 112000000,
    paymentMethod: "BANK_TRANSFER",
    paymentStatus: "PAID",
    deliveryDate: "2026-10-01",
    items: [
      {
        id: "hdc-shirt-short-2",
        title: "Sơ Mi Ngắn Tay HDC Caro Xanh",
        image: "/images/05_bestseller_shirts_02.jpg",
        color: "Xanh Caro",
        size: "L",
        quantity: 600,
        unitPrice: 185000,
        totalPrice: 111000000,
      },
    ],
    notes: "Đơn hàng đã bàn giao đủ số lượng kèm biên bản nghiệm thu đạt 100%.",
    timeline: [
      { time: "2026-09-28 11:00", text: "Ký hợp đồng sản xuất lô 600 áo sơ mi." },
      { time: "2026-10-01 15:30", text: "Bàn giao thành công tại kho tổng và thanh toán tất toán." },
    ],
  },
];

/* ============================================================
   QUOTES — 4 yêu cầu báo giá
   ============================================================ */
export const MOCK_QUOTES = [
  {
    id: "HDC-QT-2026-001",
    code: "HDC-QT-2026-001",
    createdAt: "2026-10-03T09:15:00Z",
    fullName: "Đỗ Minh Tuấn",
    phone: "0915 223 344",
    email: "tuan.dm@techcombank.com.vn",
    company: "Ngân Hàng Techcombank",
    category: "polo",
    categoryLabel: "Áo Polo Đồng Phục",
    quantity: 450,
    fabricType: "Pique Cotton Compact 4 chiều",
    estimatedBudget: 85000000,
    notes: "May áo polo cho sự kiện chạy Marathon Techcombank 2026, màu đỏ thương hiệu, thêu ngực và in tay áo.",
    status: "NEW",
    source: "QuickQuote Widget",
  },
  {
    id: "HDC-QT-2026-002",
    code: "HDC-QT-2026-002",
    createdAt: "2026-10-02T15:40:00Z",
    fullName: "Lê Cẩm Tú",
    phone: "0938 998 877",
    email: "tu.lc@bambooairways.com",
    company: "Hãng Hàng Không Bamboo Airways",
    category: "shirt",
    categoryLabel: "Sơ Mi Công Sở",
    quantity: 300,
    fabricType: "Kate Ý Chống Nhăn Cao Cấp",
    estimatedBudget: 75000000,
    notes: "May sơ mi đồng phục khối văn phòng mặt đất, phối nẹp cúc màu xanh lá đặc trưng.",
    status: "CONTACTED",
    source: "Trang Liên Hệ",
  },
  {
    id: "HDC-QT-2026-003",
    code: "HDC-QT-2026-003",
    createdAt: "2026-10-01T11:20:00Z",
    fullName: "Vũ Hải Nam",
    phone: "0909 334 556",
    email: "nam.vh@sun-group.vn",
    company: "Tập Đoàn Sun Group - Chi Nhánh Phú Quốc",
    category: "vest",
    categoryLabel: "Vest / Suit Cao Cấp",
    quantity: 60,
    fabricType: "Len Pha Cashmere Ý",
    estimatedBudget: 180000000,
    notes: "Vest cao cấp cho ban quản lý khu nghỉ dưỡng 5 sao. Cần thợ lấy số đo trực tiếp.",
    status: "QUOTED",
    source: "Trang Tự Thiết Kế",
  },
  {
    id: "HDC-QT-2026-004",
    code: "HDC-QT-2026-004",
    createdAt: "2026-09-30T14:10:00Z",
    fullName: "Hoàng Ngọc Lan",
    phone: "0982 112 233",
    email: "lan.hn@vinuni.edu.vn",
    company: "Trường Đại Học VinUni",
    category: "school",
    categoryLabel: "Đồng Phục Trường Học",
    quantity: 800,
    fabricType: "Cotton TC Cao Cấp Thoáng Mát",
    estimatedBudget: 160000000,
    notes: "Áo polo sinh viên nhập khóa mới, phối viền cổ phong cách Ivy League.",
    status: "CONVERTED",
    source: "Tư Vấn Hotline",
  },
];

/* ============================================================
   CUSTOMERS — 5 khách hàng
   ============================================================ */
export const MOCK_CUSTOMERS = [
  {
    id: "CUST-001",
    name: "Tập Đoàn Vingroup",
    contactPerson: "Nguyễn Văn Hùng",
    email: "hung.nv@vingroup.net",
    phone: "0912 345 678",
    tier: "KIM CƯƠNG",
    totalOrders: 8,
    totalSpent: 420000000,
    lastOrder: "2026-10-02",
    status: "ACTIVE",
    notes: "Đối tác lớn, luôn thanh toán đúng hạn 100%.",
  },
  {
    id: "CUST-002",
    name: "FPT Software",
    contactPerson: "Trần Mai Anh",
    email: "maianh.tran@fpt.com",
    phone: "0988 765 432",
    tier: "VÀNG",
    totalOrders: 5,
    totalSpent: 260000000,
    lastOrder: "2026-10-02",
    status: "ACTIVE",
    notes: "Đặt định kỳ theo các kỳ teambuilding và giải chạy công nghệ.",
  },
  {
    id: "CUST-003",
    name: "Vietcombank Hội Sở",
    contactPerson: "Lê Hoàng Quân",
    email: "quan.lh@vietcombank.com.vn",
    phone: "0903 112 334",
    tier: "KIM CƯƠNG",
    totalOrders: 6,
    totalSpent: 380000000,
    lastOrder: "2026-10-01",
    status: "ACTIVE",
    notes: "May đo vest và sơ mi định kỳ hàng năm cho khối văn phòng.",
  },
  {
    id: "CUST-004",
    name: "Shopee Express",
    contactPerson: "Vũ Đức Trọng",
    email: "trong.vd@shopee.vn",
    phone: "0934 889 900",
    tier: "VÀNG",
    totalOrders: 4,
    totalSpent: 215000000,
    lastOrder: "2026-09-28",
    status: "ACTIVE",
    notes: "Áo polo và áo khoác gió đồng phục nhân viên kho bãi.",
  },
  {
    id: "CUST-005",
    name: "Trường Quốc Tế BVIS",
    contactPerson: "Phạm Thúy Hằng",
    email: "hang.pt@bvis.edu.vn",
    phone: "0918 776 554",
    tier: "BẠC",
    totalOrders: 3,
    totalSpent: 145000000,
    lastOrder: "2026-09-15",
    status: "ACTIVE",
    notes: "Đồng phục học sinh tiểu học và trung học.",
  },
];

/* ============================================================
   VOUCHERS — 3 voucher
   ============================================================ */
export const MOCK_VOUCHERS = [
  {
    id: "VOUCHER-01",
    code: "HDCVIP2026",
    title: "Ưu Đãi Khách Hàng Doanh Nghiệp VIP",
    discountType: "PERCENT",
    discountValue: 15,
    maxDiscount: 15000000,
    minOrderValue: 50000000,
    startDate: "2026-09-01",
    endDate: "2026-12-31",
    usedCount: 14,
    totalLimit: 50,
    active: true,
  },
  {
    id: "VOUCHER-02",
    code: "POLO100",
    title: "Giảm Ngay 10% Cho Đơn Hàng Polo Từ 100 Chiếc",
    discountType: "PERCENT",
    discountValue: 10,
    maxDiscount: 5000000,
    minOrderValue: 20000000,
    startDate: "2026-09-15",
    endDate: "2026-11-30",
    usedCount: 28,
    totalLimit: 100,
    active: true,
  },
  {
    id: "VOUCHER-03",
    code: "FREESHIPB2B",
    title: "Miễn Phí Vận Chuyển Toàn Quốc Cho Đơn Hàng B2B",
    discountType: "FIXED",
    discountValue: 1500000,
    maxDiscount: 1500000,
    minOrderValue: 30000000,
    startDate: "2026-10-01",
    endDate: "2026-10-31",
    usedCount: 42,
    totalLimit: 200,
    active: true,
  },
];

/* ============================================================
   REVIEWS — 3 đánh giá
   ============================================================ */
export const MOCK_REVIEWS = [
  {
    id: "REV-01",
    customerName: "Nguyễn Thu Hà - HR Manager Viettel",
    productTitle: "Sơ Mi Ngắn Tay HDC Classic Xanh Đậm",
    rating: 5,
    comment: "Chất vải Kate Ý thực sự vượt mong đợi, không nhăn sau nhiều lần giặt. Nhân viên ai cũng khen form áo lên dáng đẹp.",
    createdAt: "2026-10-02T16:20:00Z",
    status: "APPROVED",
    reply: "HDC Fashion chân thành cảm ơn chị Hà và Viettel đã tin tưởng lựa chọn đồng phục công sở HDC.",
  },
  {
    id: "REV-02",
    customerName: "Lê Minh Trí - Ban Đối Ngoại Vingroup",
    productTitle: "Áo Polo Đồng Phục Doanh Nghiệp CVC Pique",
    rating: 5,
    comment: "Đường thêu vi tính logo Vin rất sắc sảo, giao hàng đúng hẹn trước sự kiện 3 ngày. Dịch vụ may mẫu 0đ rất chuyên nghiệp.",
    createdAt: "2026-10-01T09:40:00Z",
    status: "APPROVED",
    reply: "Cảm ơn anh Trí! Rất hân hạnh được đồng hành cùng Vingroup trong các sự kiện tiếp theo.",
  },
  {
    id: "REV-03",
    customerName: "Trần Bảo Ngọc - CLB Golf Saigon",
    productTitle: "Áo Thun Thể Thao Golf HDC Pro Dry-Fit",
    rating: 5,
    comment: "Chất liệu thể thao co giãn 4 chiều mặc đánh golf rất thoát mồ hôi và mát mẻ.",
    createdAt: "2026-09-29T14:15:00Z",
    status: "APPROVED",
    reply: null,
  },
];

/* ============================================================
   RETURNS — 2 yêu cầu đổi trả
   ============================================================ */
export const MOCK_RETURNS = [
  {
    id: "RET-01",
    orderCode: "HDC-ORD-2026-002",
    customerName: "Trần Mai Anh (FPT Software)",
    customerPhone: "0988 765 432",
    reason: "Cần đổi 5 áo size M sang size L do nhân viên đăng ký nhầm size",
    status: "PROCESSING",
    type: "EXCHANGE_SIZE",
    createdAt: "2026-10-02T14:00:00Z",
    solution: "Đã may thêm 5 áo size L thay thế, chuyển phát nhanh trong ngày.",
  },
  {
    id: "RET-02",
    orderCode: "HDC-ORD-2026-004",
    customerName: "Gamuda Land Vietnam",
    customerPhone: "0977 456 789",
    reason: "Bảo hành 2 cúc áo dự phòng cho ban tổ chức",
    status: "COMPLETED",
    type: "WARRANTY",
    createdAt: "2026-09-30T10:00:00Z",
    solution: "Đã bàn giao bộ phụ liệu cúc dự phòng tận tay khách hàng.",
  },
];