// ==================================================
// src/app/api/admin/reviews/route.js
// API Quản trị Đánh giá & Phản hồi khách hàng
// ==================================================

import { NextResponse } from "next/server";
import { db } from "@/server/db";
import { auth } from "@/server/auth";

// Dữ liệu mẫu ban đầu để demo mượt mà khi DB chưa kết nối
let MEMORY_REVIEWS = [
  {
    id: "rev-001",
    customerName: "Nguyễn Văn Hưng",
    customerEmail: "hung.nv@techcorp.vn",
    customerPhone: "0912.345.678",
    avatar: null,
    productId: "polo-doanh-nghiep-hdc-pro",
    productTitle: "Áo Polo Doanh Nghiệp HDC Classic",
    productSku: "HDC-POLO-CORP-01",
    productImage: "/images/06_polo_01.jpg",
    rating: 5,
    content:
      "Chất vải polo cá sấu compact rất mát và co giãn tốt. Đặt 120 áo cho toàn bộ nhân sự công ty, form áo lên chuẩn, thêu logo nét căng. Giao hàng đúng tiến độ sự kiện.",
    status: "APPROVED", // APPROVED, PENDING, HIDDEN
    adminReply:
      "Dạ HDC Fashion chân thành cảm ơn anh Hưng và tập thể TechCorp đã tin tưởng đặt may đồng phục! Chúc công ty ngày càng phát triển thịnh vượng ạ!",
    repliedAt: "2026-09-28T10:30:00.000Z",
    createdAt: "2026-09-27T14:20:00.000Z",
  },
  {
    id: "rev-002",
    customerName: "Trần Thị Bích Mai",
    customerEmail: "bichmai.hr@vingroup.com",
    customerPhone: "0988.765.432",
    avatar: null,
    productId: "hdc-shirt-short-1",
    productTitle: "Sơ Mi Ngắn Tay HDC Classic Xanh Đậm",
    productSku: "HDC-SHIRT-SHORT-01",
    productImage: "/images/05_bestseller_shirts_01.jpg",
    rating: 5,
    content:
      "Vải Kate Ý chống nhăn cực kỳ tiện lợi, giặt máy không lo nhăn nhúm. Form Regular fit vừa vặn cả các bạn nam lẫn các anh quản lý. Dịch vụ may áo mẫu 0đ rất chuyên nghiệp.",
    status: "APPROVED",
    adminReply: null,
    repliedAt: null,
    createdAt: "2026-09-28T09:15:00.000Z",
  },
  {
    id: "rev-003",
    customerName: "Lê Hoàng Nam",
    customerEmail: "namlh@fptretail.vn",
    customerPhone: "0903.222.111",
    avatar: null,
    productId: "vest-doanh-nhan-bespoke",
    productTitle: "Áo Vest Nam Doanh Nhân Bespoke",
    productSku: "HDC-SUIT-BESPOKE-01",
    productImage: "/images/04_categories_suit.jpg",
    rating: 4,
    content:
      "Bộ vest may đo bespoke rất đứng dáng, đệm vai và lót lụa cao cấp. Chỉ có khuy áo giao hơi chậm hơn dự kiến 1 ngày nhưng hỗ trợ tận tình.",
    status: "PENDING",
    adminReply: null,
    repliedAt: null,
    createdAt: "2026-09-29T16:45:00.000Z",
  },
  {
    id: "rev-004",
    customerName: "Phạm Minh Tuấn",
    customerEmail: "tuan.pm@sunhouse.com.vn",
    customerPhone: "0971.888.999",
    avatar: null,
    productId: "dong-phuc-golf-premium",
    productTitle: "Áo Thun Thể Thao Golf HDC Swift",
    productSku: "HDC-SPORT-GOLF-01",
    productImage: "/images/08_golf_event_01.jpg",
    rating: 5,
    content:
      "Áo đồng phục giải Golf của tập đoàn nhận được cơn mưa lời khen. Kháng khuẩn ion bạc khử mùi mồ hôi rất hiệu quả dưới nắng hè.",
    status: "APPROVED",
    adminReply:
      "Dạ cảm ơn anh Tuấn đã phản hồi tích cực! HDC rất vinh dự được đồng hành cùng giải Golf của quý tập đoàn.",
    repliedAt: "2026-09-30T11:00:00.000Z",
    createdAt: "2026-09-30T08:00:00.000Z",
  },
  {
    id: "rev-005",
    customerName: "Vũ Đình Trọng",
    customerEmail: "trong.vu@gmail.com",
    customerPhone: "0934.567.890",
    avatar: null,
    productId: "hdc-shirt-short-2",
    productTitle: "Sơ Mi Ngắn Tay HDC Caro Xanh",
    productSku: "HDC-SHIRT-SHORT-02",
    productImage: "/images/05_bestseller_shirts_02.jpg",
    rating: 3,
    content:
      "Chất vải mát nhưng size L hơi kích ngực một chút so với bảng size chuẩn. Đã liên hệ bộ phận CSKH để xin đổi sang size XL.",
    status: "PENDING",
    adminReply: null,
    repliedAt: null,
    createdAt: "2026-10-01T07:15:00.000Z",
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
    const ratingParam = searchParams.get("rating");
    const statusParam = searchParams.get("status");
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(Math.max(1, parseInt(searchParams.get("limit") || "12")), 100);
    const skip = (page - 1) * limit;

    // 1. Thử truy vấn cơ sở dữ liệu nếu có
    try {
      const dbCount = await db.review.count().catch(() => 0);
      if (dbCount > 0) {
        const whereClause = {
          ...(ratingParam && ratingParam !== "all"
            ? { rating: parseInt(ratingParam, 10) }
            : {}),
          ...(search
            ? {
                OR: [
                  { content: { contains: search, mode: "insensitive" } },
                  { user: { fullName: { contains: search, mode: "insensitive" } } },
                ],
              }
            : {}),
        };

        const [reviews, total] = await Promise.all([
          db.review.findMany({
            where: whereClause,
            take: limit,
            skip,
            orderBy: { createdAt: "desc" },
            include: {
              user: { select: { fullName: true, email: true, phone: true, avatar: true } },
            },
          }),
          db.review.count({ where: whereClause }),
        ]);

        return NextResponse.json({
          success: true,
          data: {
            reviews: reviews.map((r) => ({
              id: r.id,
              customerName: r.user?.fullName || "Khách hàng",
              customerEmail: r.user?.email || "khachhang@huni.vn",
              customerPhone: r.user?.phone || "Chưa có",
              avatar: r.user?.avatar || null,
              productId: r.productId,
              productTitle: "Sản phẩm HDC",
              productSku: "HDC-PROD",
              productImage: "/images/06_polo_01.jpg",
              rating: r.rating,
              content: r.content,
              status: "APPROVED",
              adminReply: null,
              createdAt: r.createdAt,
            })),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
          },
        });
      }
    } catch {
      // Fallback
    }

    // 2. Dữ liệu bộ nhớ (In-memory fallback)
    let filtered = [...MEMORY_REVIEWS];

    if (search) {
      filtered = filtered.filter(
        (r) =>
          r.customerName.toLowerCase().includes(search) ||
          r.customerEmail.toLowerCase().includes(search) ||
          r.customerPhone.includes(search) ||
          r.productTitle.toLowerCase().includes(search) ||
          r.productSku.toLowerCase().includes(search) ||
          r.content.toLowerCase().includes(search)
      );
    }

    if (ratingParam && ratingParam !== "all") {
      const numRating = parseInt(ratingParam, 10);
      filtered = filtered.filter((r) => r.rating === numRating);
    }

    if (statusParam && statusParam !== "all") {
      filtered = filtered.filter((r) => r.status.toLowerCase() === statusParam.toLowerCase());
    }

    const total = filtered.length;
    const paginated = filtered.slice(skip, skip + limit);

    return NextResponse.json({
      success: true,
      data: {
        reviews: paginated,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        stats: {
          totalReviews: MEMORY_REVIEWS.length,
          avgRating: (
            MEMORY_REVIEWS.reduce((sum, r) => sum + r.rating, 0) /
            (MEMORY_REVIEWS.length || 1)
          ).toFixed(1),
          pendingCount: MEMORY_REVIEWS.filter((r) => r.status === "PENDING").length,
          fiveStarPercent: Math.round(
            (MEMORY_REVIEWS.filter((r) => r.rating === 5).length /
              (MEMORY_REVIEWS.length || 1)) *
              100
          ),
        },
      },
    });
  } catch (error) {
    console.error("[admin/reviews] GET error:", error);
    return NextResponse.json(
      { success: false, error: "Không thể tải danh sách đánh giá" },
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
    const { id, status, adminReply } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Thiếu ID đánh giá" },
        { status: 400 }
      );
    }

    const index = MEMORY_REVIEWS.findIndex((r) => r.id === id);
    if (index !== -1) {
      if (status) MEMORY_REVIEWS[index].status = status;
      if (adminReply !== undefined) {
        MEMORY_REVIEWS[index].adminReply = adminReply;
        MEMORY_REVIEWS[index].repliedAt = new Date().toISOString();
      }
    }

    return NextResponse.json({
      success: true,
      message: "Cập nhật đánh giá thành công",
      data: index !== -1 ? MEMORY_REVIEWS[index] : null,
    });
  } catch (error) {
    console.error("[admin/reviews] PATCH error:", error);
    return NextResponse.json(
      { success: false, error: "Không thể cập nhật đánh giá" },
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

    MEMORY_REVIEWS = MEMORY_REVIEWS.filter((r) => !ids.includes(r.id));

    return NextResponse.json({
      success: true,
      deletedCount: ids.length,
      message: `Đã xoá ${ids.length} đánh giá thành công`,
    });
  } catch (error) {
    console.error("[admin/reviews] DELETE error:", error);
    return NextResponse.json(
      { success: false, error: "Không thể xoá đánh giá" },
      { status: 500 }
    );
  }
}
