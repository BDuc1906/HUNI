// ==================================================
// src/app/api/admin/returns/route.js
// API Quản trị Đổi trả & Hoàn tiền khách hàng
// ==================================================

import { NextResponse } from "next/server";
import { auth } from "@/server/auth";

// Dữ liệu mẫu ban đầu để demo quản lý đổi trả & hoàn tiền
let MEMORY_RETURNS = [
  {
    id: "RT-261001-001",
    orderNumber: "HN-260930-1001",
    customerName: "Nguyễn Văn Hưng",
    customerPhone: "0912.345.678",
    customerEmail: "hung.nv@techcorp.vn",
    company: "TechCorp Việt Nam",
    productId: "polo-doanh-nghiep-hdc-pro",
    productTitle: "Áo Polo Doanh Nghiệp HDC Classic",
    quantity: 5,
    type: "EXCHANGE", // EXCHANGE (1 đổi 1) | REFUND (Hoàn tiền)
    reason: "Sai kích thước / form áo chật hơn bảng size",
    details:
      "Có 5 nhân viên phòng kinh doanh mặc size L bị kích bắp tay, xin hỗ trợ đổi sang size XL. Áo còn nguyên tem mác chưa giặt.",
    refundAmount: 0,
    bankInfo: null,
    evidenceImages: ["/images/06_polo_01.jpg"],
    status: "PROCESSING", // PENDING, PROCESSING, EXCHANGED, REFUNDED, REJECTED
    adminNotes: "Đã liên hệ anh Hưng, nhân viên kho đã chuẩn bị 5 áo size XL gửi shipper đi đổi chiều nay.",
    createdAt: "2026-10-01T08:30:00.000Z",
    updatedAt: "2026-10-01T10:15:00.000Z",
  },
  {
    id: "RT-261001-002",
    orderNumber: "HN-260929-2042",
    customerName: "Trần Thị Bích Mai",
    customerPhone: "0988.765.432",
    customerEmail: "bichmai.hr@vingroup.com",
    company: "Vingroup HR Hub",
    productId: "hdc-shirt-short-1",
    productTitle: "Sơ Mi Ngắn Tay HDC Classic Xanh Đậm",
    quantity: 2,
    type: "REFUND",
    reason: "Lỗi đường chỉ may cổ áo",
    details:
      "2 áo bị bung chỉ viền mép cổ áo sau khi bóc hộp kiểm tra. Nhân sự đã đủ số lượng nên công ty xin hoàn lại tiền 2 áo này.",
    refundAmount: 470000,
    bankInfo: {
      bankName: "Vietcombank (VCB)",
      accountNumber: "10188992288",
      accountHolder: "TRAN THI BICH MAI",
    },
    evidenceImages: ["/images/05_bestseller_shirts_01.jpg"],
    status: "PENDING",
    adminNotes: "Cần kiểm tra xác nhận thu hồi 2 áo lỗi trước khi chuyển khoản hoàn tiền.",
    createdAt: "2026-10-01T09:45:00.000Z",
    updatedAt: "2026-10-01T09:45:00.000Z",
  },
  {
    id: "RT-260930-003",
    orderNumber: "HN-260925-8812",
    customerName: "Lê Hoàng Nam",
    customerPhone: "0903.222.111",
    customerEmail: "namlh@fptretail.vn",
    company: "FPT Retail Corp",
    productId: "vest-doanh-nhan-bespoke",
    productTitle: "Áo Vest Nam Doanh Nhân Bespoke",
    quantity: 1,
    type: "EXCHANGE",
    reason: "Chiều dài tay áo dài hơn số đo",
    details: "Vest giám đốc may đo tay áo dài hơn cổ tay 2cm, xin xưởng hỗ trợ may đo chỉnh sửa lại vừa vặn.",
    refundAmount: 0,
    bankInfo: null,
    evidenceImages: ["/images/04_categories_suit.jpg"],
    status: "EXCHANGED",
    adminNotes: "Thợ may trưởng đã chỉnh sửa hạ tay áo 2cm và gửi lại cho anh Nam, khách rất hài lòng.",
    createdAt: "2026-09-30T14:20:00.000Z",
    updatedAt: "2026-10-01T08:00:00.000Z",
  },
  {
    id: "RT-260929-004",
    orderNumber: "HN-260922-4411",
    customerName: "Đặng Thị Thảo",
    customerPhone: "0977.112.233",
    customerEmail: "thao.dang@misa.vn",
    company: "MISA JSC",
    productId: "dong-phuc-golf-premium",
    productTitle: "Áo Thun Thể Thao Golf HDC Swift",
    quantity: 10,
    type: "REFUND",
    reason: "Huỷ đơn hàng sự kiện do bão hoãn tổ chức",
    details: "Sự kiện chạy bộ bị huỷ do thời tiết, khách hàng yêu cầu hoàn lại tiền toàn bộ áo.",
    refundAmount: 1850000,
    bankInfo: {
      bankName: "Techcombank",
      accountNumber: "19033445566778",
      accountHolder: "DANG THI THAO",
    },
    evidenceImages: [],
    status: "REJECTED",
    adminNotes: "Từ chối vì áo đã in logo độc quyền của sự kiện MISA Run 2026 theo điều khoản chính sách bảo hành.",
    createdAt: "2026-09-29T11:10:00.000Z",
    updatedAt: "2026-09-29T15:30:00.000Z",
  },
  {
    id: "RT-260928-005",
    orderNumber: "HN-260920-9900",
    customerName: "Phạm Quốc Dũng",
    customerPhone: "0966.554.433",
    customerEmail: "dung.pq@vinamilk.com.vn",
    company: "Vinamilk Logistics",
    productId: "hdc-shirt-short-2",
    productTitle: "Sơ Mi Ngắn Tay HDC Caro Xanh",
    quantity: 3,
    type: "REFUND",
    reason: "Giao sai mẫu áo caro so với mẫu duyệt",
    details: "Giao nhầm 3 áo sơ mi caro xanh nhạt thay vì xanh đậm, xin hoàn tiền vào tài khoản.",
    refundAmount: 735000,
    bankInfo: {
      bankName: "MB Bank (Quân Đội)",
      accountNumber: "068899998888",
      accountHolder: "PHAM QUOC DUNG",
    },
    evidenceImages: ["/images/05_bestseller_shirts_02.jpg"],
    status: "REFUNDED",
    adminNotes: "Đã thu hồi 3 áo và thực hiện ủy nhiệm chi chuyển khoản 735.000đ ngày 30/09.",
    createdAt: "2026-09-28T16:00:00.000Z",
    updatedAt: "2026-09-30T17:00:00.000Z",
  },
];

export async function GET(request) {
  try {
    const session = await auth().catch(() => null);
    const isBypass =
      process.env.NODE_ENV !== "production" ||
      process.env.ADMIN_PREVIEW_MODE === "true" ||
      process.env.REQUIRE_ADMIN_AUTH !== "true";

    if (!isBypass && session?.user?.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Truy cập bị từ chối" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.toLowerCase().trim();
    const typeParam = searchParams.get("type");
    const statusParam = searchParams.get("status");
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(Math.max(1, parseInt(searchParams.get("limit") || "12")), 100);
    const skip = (page - 1) * limit;

    let filtered = [...MEMORY_RETURNS];

    if (search) {
      filtered = filtered.filter(
        (r) =>
          r.id.toLowerCase().includes(search) ||
          r.orderNumber.toLowerCase().includes(search) ||
          r.customerName.toLowerCase().includes(search) ||
          r.customerPhone.includes(search) ||
          r.customerEmail.toLowerCase().includes(search) ||
          r.company?.toLowerCase().includes(search) ||
          r.productTitle.toLowerCase().includes(search) ||
          r.reason.toLowerCase().includes(search)
      );
    }

    if (typeParam && typeParam !== "all") {
      filtered = filtered.filter((r) => r.type.toLowerCase() === typeParam.toLowerCase());
    }

    if (statusParam && statusParam !== "all") {
      filtered = filtered.filter((r) => r.status.toLowerCase() === statusParam.toLowerCase());
    }

    const total = filtered.length;
    const paginated = filtered.slice(skip, skip + limit);

    return NextResponse.json({
      success: true,
      data: {
        returns: paginated,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        stats: {
          totalRequests: MEMORY_RETURNS.length,
          pendingCount: MEMORY_RETURNS.filter((r) => r.status === "PENDING").length,
          processingCount: MEMORY_RETURNS.filter((r) => r.status === "PROCESSING").length,
          completedCount: MEMORY_RETURNS.filter(
            (r) => r.status === "EXCHANGED" || r.status === "REFUNDED"
          ).length,
          totalRefunded: MEMORY_RETURNS.filter((r) => r.status === "REFUNDED").reduce(
            (sum, r) => sum + (r.refundAmount || 0),
            0
          ),
        },
      },
    });
  } catch (error) {
    console.error("[admin/returns] GET error:", error);
    return NextResponse.json(
      { success: false, error: "Không thể tải danh sách đổi trả" },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    const session = await auth().catch(() => null);
    const isBypass =
      process.env.NODE_ENV !== "production" ||
      process.env.ADMIN_PREVIEW_MODE === "true" ||
      process.env.REQUIRE_ADMIN_AUTH !== "true";

    if (!isBypass && session?.user?.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Truy cập bị từ chối" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { id, status, adminNotes, refundAmount } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Thiếu mã yêu cầu đổi trả" },
        { status: 400 }
      );
    }

    const index = MEMORY_RETURNS.findIndex((r) => r.id === id);
    if (index !== -1) {
      if (status) MEMORY_RETURNS[index].status = status;
      if (adminNotes !== undefined) MEMORY_RETURNS[index].adminNotes = adminNotes;
      if (refundAmount !== undefined) MEMORY_RETURNS[index].refundAmount = refundAmount;
      MEMORY_RETURNS[index].updatedAt = new Date().toISOString();
    }

    return NextResponse.json({
      success: true,
      message: "Cập nhật yêu cầu đổi trả thành công",
      data: index !== -1 ? MEMORY_RETURNS[index] : null,
    });
  } catch (error) {
    console.error("[admin/returns] PATCH error:", error);
    return NextResponse.json(
      { success: false, error: "Không thể cập nhật yêu cầu đổi trả" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const session = await auth().catch(() => null);
    const isBypass =
      process.env.NODE_ENV !== "production" ||
      process.env.ADMIN_PREVIEW_MODE === "true" ||
      process.env.REQUIRE_ADMIN_AUTH !== "true";

    if (!isBypass && session?.user?.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Truy cập bị từ chối" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const ids = Array.isArray(body.ids) ? body.ids : [body.id].filter(Boolean);

    if (ids.length === 0) {
      return NextResponse.json(
        { success: false, error: "Không có danh sách ID cần xoá" },
        { status: 400 }
      );
    }

    MEMORY_RETURNS = MEMORY_RETURNS.filter((r) => !ids.includes(r.id));

    return NextResponse.json({
      success: true,
      deletedCount: ids.length,
      message: `Đã xoá ${ids.length} yêu cầu đổi trả thành công`,
    });
  } catch (error) {
    console.error("[admin/returns] DELETE error:", error);
    return NextResponse.json(
      { success: false, error: "Không thể xoá yêu cầu đổi trả" },
      { status: 500 }
    );
  }
}
