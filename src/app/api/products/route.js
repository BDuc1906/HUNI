// ==================================================
// src/app/api/products/route.js
// API Quản lý danh sách sản phẩm (Mục 7 — API_CONTRACT.md)
// GET  /api/products — Danh sách sản phẩm (Public)
// POST /api/products — Tạo sản phẩm mới (🔒 ADMIN)
// ==================================================

import { NextResponse } from "next/server";
import { db } from "@/server/db";
import { auth } from "@/server/auth";
import { productCreateSchema, formatZodErrors } from "@/server/validators";
import { PRODUCTS as STATIC_PRODUCTS } from "@/shared/data/products";

// ==================================================
// GET /api/products — Danh sách sản phẩm
// ==================================================
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search")?.trim().toLowerCase();
    const priceMin = searchParams.get("priceMin")
      ? parseInt(searchParams.get("priceMin"))
      : null;
    const priceMax = searchParams.get("priceMax")
      ? parseInt(searchParams.get("priceMax"))
      : null;
    const sort = searchParams.get("sort") || "popular";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(
      Math.max(1, parseInt(searchParams.get("limit") || "12")),
      48
    );
    const skip = (page - 1) * limit;

    // 1. Thử lấy từ Database Prisma
    try {
      const dbCount = await db.product.count({ where: { published: true } });

      if (dbCount > 0) {
        const whereClause = {
          published: true,
          ...(category && category !== "all" ? { category } : {}),
          ...(priceMin !== null || priceMax !== null
            ? {
                price: {
                  ...(priceMin !== null ? { gte: priceMin } : {}),
                  ...(priceMax !== null ? { lte: priceMax } : {}),
                },
              }
            : {}),
          ...(search
            ? {
                OR: [
                  { title: { contains: search, mode: "insensitive" } },
                  { description: { contains: search, mode: "insensitive" } },
                  { material: { contains: search, mode: "insensitive" } },
                ],
              }
            : {}),
        };

        let orderBy = { createdAt: "desc" };
        if (sort === "priceAsc") orderBy = { price: "asc" };
        if (sort === "priceDesc") orderBy = { price: "desc" };
        if (sort === "popular") orderBy = { featured: "desc" };

        const [products, total] = await Promise.all([
          db.product.findMany({
            where: whereClause,
            take: limit,
            skip,
            orderBy,
          }),
          db.product.count({ where: whereClause }),
        ]);

        return NextResponse.json({
          success: true,
          data: {
            products,
            total,
            page,
            totalPages: Math.ceil(total / limit),
          },
        });
      }
    } catch (dbErr) {
      console.warn(
        "[products] DB query skipped or unseeded, using static fallback:",
        dbErr.message
      );
    }

    // 2. Fallback sang STATIC_PRODUCTS nếu DB chưa seed để không làm gián đoạn frontend
    let filtered = [...STATIC_PRODUCTS];

    if (category && category !== "all") {
      filtered = filtered.filter(
        (p) =>
          p.category === category ||
          (Array.isArray(p.subcategories) && p.subcategories.includes(category))
      );
    }

    if (search) {
      filtered = filtered.filter(
        (p) =>
          p.title?.toLowerCase().includes(search) ||
          p.description?.toLowerCase().includes(search) ||
          p.material?.toLowerCase().includes(search)
      );
    }

    if (priceMin !== null) {
      filtered = filtered.filter((p) => (p.price || 0) >= priceMin);
    }
    if (priceMax !== null) {
      filtered = filtered.filter((p) => (p.price || 0) <= priceMax);
    }

    // Sorting
    if (sort === "priceAsc") {
      filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sort === "priceDesc") {
      filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sort === "rating") {
      filtered.sort((a, b) => (b.rating || 5) - (a.rating || 5));
    } else if (sort === "discount") {
      filtered.sort((a, b) => {
        const discA = a.originalPrice ? a.originalPrice - a.price : 0;
        const discB = b.originalPrice ? b.originalPrice - b.price : 0;
        return discB - discA;
      });
    }

    const total = filtered.length;
    const paginated = filtered.slice(skip, skip + limit);

    return NextResponse.json({
      success: true,
      data: {
        products: paginated,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("[products] GET error:", error);
    return NextResponse.json(
      { success: false, error: "Không thể tải danh sách sản phẩm" },
      { status: 500 }
    );
  }
}

// ==================================================
// POST /api/products — Tạo sản phẩm mới (🔒 ADMIN)
// ==================================================
export async function POST(request) {
  try {
    const session = await auth().catch(() => null);

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          error: "Vui lòng đăng nhập để thực hiện thao tác này.",
        },
        { status: 401 }
      );
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        {
          success: false,
          error:
            "Truy cập bị từ chối. Chỉ Quản trị viên (ADMIN) mới có quyền tạo sản phẩm.",
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const parseResult = productCreateSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Dữ liệu không hợp lệ",
          details: formatZodErrors(parseResult.error),
        },
        { status: 400 }
      );
    }

    const data = parseResult.data;

    // Kiểm tra trùng lặp slug hoặc sku
    const existing = await db.product.findFirst({
      where: {
        OR: [{ slug: data.slug }, { sku: data.sku }],
      },
    });

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          error:
            existing.slug === data.slug
              ? `Đường dẫn (slug) "${data.slug}" đã tồn tại.`
              : `Mã sản phẩm (SKU) "${data.sku}" đã tồn tại.`,
        },
        { status: 409 }
      );
    }

    const product = await db.product.create({
      data: {
        slug: data.slug,
        sku: data.sku,
        title: data.title,
        description: data.description,
        category: data.category,
        material: data.material || null,
        price: data.price,
        originalPrice: data.originalPrice || null,
        images: data.images,
        features: data.features || [],
        colors: data.colors || undefined,
        sizes: data.sizes || [],
        wholesaleTiers: data.wholesaleTiers || undefined,
        published: data.published ?? true,
        featured: data.featured ?? false,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Tạo sản phẩm thành công",
        data: product,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[products] POST error:", error);
    return NextResponse.json(
      { success: false, error: "Không thể tạo sản phẩm" },
      { status: 500 }
    );
  }
}
