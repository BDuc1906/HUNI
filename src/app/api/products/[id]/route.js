// ==================================================
// src/app/api/products/[id]/route.js
// API Chi tiết, Cập nhật, Xóa sản phẩm (Mục 7.2 - 7.5 API_CONTRACT.md)
// GET    /api/products/[id] — Chi tiết sản phẩm (Public)
// PUT    /api/products/[id] — Cập nhật sản phẩm (🔒 ADMIN)
// DELETE /api/products/[id] — Xóa sản phẩm (🔒 ADMIN)
// ==================================================

import { NextResponse } from "next/server";
import { db } from "@/server/db";
import { auth } from "@/server/auth";
import { productUpdateSchema, formatZodErrors } from "@/server/validators";
import { PRODUCTS as STATIC_PRODUCTS } from "@/shared/data/products";

async function resolveParamId(params) {
  if (params && typeof params.then === "function") {
    const resolved = await params;
    return resolved?.id;
  }
  return params?.id;
}

// ==================================================
// GET /api/products/[id] — Chi tiết sản phẩm
// ==================================================
export async function GET(request, { params }) {
  try {
    const id = await resolveParamId(params);

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Thiếu mã sản phẩm" },
        { status: 400 }
      );
    }

    // 1. Tìm trong DB theo id hoặc slug
    try {
      const product = await db.product.findFirst({
        where: {
          OR: [{ id }, { slug: id }, { sku: id }],
        },
      });

      if (product) {
        return NextResponse.json({
          success: true,
          data: product,
        });
      }
    } catch (dbErr) {
      console.warn("[products/[id]] DB query error, checking static fallback:", dbErr.message);
    }

    // 2. Fallback sang STATIC_PRODUCTS nếu DB chưa seed
    const staticProduct = STATIC_PRODUCTS.find(
      (p) => p.id === id || p.slug === id || p.sku === id
    );

    if (staticProduct) {
      return NextResponse.json({
        success: true,
        data: staticProduct,
      });
    }

    return NextResponse.json(
      { success: false, error: "Không tìm thấy sản phẩm" },
      { status: 404 }
    );
  } catch (error) {
    console.error("[products/[id]] GET error:", error);
    return NextResponse.json(
      { success: false, error: "Lỗi máy chủ khi tải chi tiết sản phẩm" },
      { status: 500 }
    );
  }
}

// ==================================================
// PUT /api/products/[id] — Cập nhật sản phẩm (🔒 ADMIN)
// ==================================================
export async function PUT(request, { params }) {
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
            "Truy cập bị từ chối. Chỉ Quản trị viên (ADMIN) mới có quyền chỉnh sửa sản phẩm.",
        },
        { status: 403 }
      );
    }

    const id = await resolveParamId(params);
    const body = await request.json();

    const parseResult = productUpdateSchema.safeParse(body);
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

    // Kiểm tra sản phẩm tồn tại trong DB
    const existing = await db.product.findFirst({
      where: { OR: [{ id }, { slug: id }] },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Không tìm thấy sản phẩm để cập nhật" },
        { status: 404 }
      );
    }

    // Nếu sửa slug hoặc sku -> kiểm tra trùng lặp
    if (data.slug && data.slug !== existing.slug) {
      const duplicateSlug = await db.product.findUnique({
        where: { slug: data.slug },
      });
      if (duplicateSlug) {
        return NextResponse.json(
          { success: false, error: `Slug "${data.slug}" đã tồn tại.` },
          { status: 409 }
        );
      }
    }

    if (data.sku && data.sku !== existing.sku) {
      const duplicateSku = await db.product.findUnique({
        where: { sku: data.sku },
      });
      if (duplicateSku) {
        return NextResponse.json(
          { success: false, error: `SKU "${data.sku}" đã tồn tại.` },
          { status: 409 }
        );
      }
    }

    const updated = await db.product.update({
      where: { id: existing.id },
      data: {
        ...(data.slug ? { slug: data.slug } : {}),
        ...(data.sku ? { sku: data.sku } : {}),
        ...(data.title ? { title: data.title } : {}),
        ...(data.description ? { description: data.description } : {}),
        ...(data.category ? { category: data.category } : {}),
        ...(data.material !== undefined ? { material: data.material } : {}),
        ...(data.price !== undefined ? { price: data.price } : {}),
        ...(data.originalPrice !== undefined
          ? { originalPrice: data.originalPrice }
          : {}),
        ...(data.images ? { images: data.images } : {}),
        ...(data.features ? { features: data.features } : {}),
        ...(data.colors !== undefined ? { colors: data.colors } : {}),
        ...(data.sizes ? { sizes: data.sizes } : {}),
        ...(data.wholesaleTiers !== undefined
          ? { wholesaleTiers: data.wholesaleTiers }
          : {}),
        ...(data.published !== undefined ? { published: data.published } : {}),
        ...(data.featured !== undefined ? { featured: data.featured } : {}),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Cập nhật sản phẩm thành công",
      data: updated,
    });
  } catch (error) {
    console.error("[products/[id]] PUT error:", error);
    return NextResponse.json(
      { success: false, error: "Không thể cập nhật sản phẩm" },
      { status: 500 }
    );
  }
}

// ==================================================
// DELETE /api/products/[id] — Xóa sản phẩm (🔒 ADMIN)
// ==================================================
export async function DELETE(request, { params }) {
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
            "Truy cập bị từ chối. Chỉ Quản trị viên (ADMIN) mới có quyền xóa sản phẩm.",
        },
        { status: 403 }
      );
    }

    const id = await resolveParamId(params);

    const existing = await db.product.findFirst({
      where: { OR: [{ id }, { slug: id }] },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Không tìm thấy sản phẩm để xóa" },
        { status: 404 }
      );
    }

    await db.product.delete({
      where: { id: existing.id },
    });

    return NextResponse.json({
      success: true,
      message: "Xóa sản phẩm thành công",
    });
  } catch (error) {
    console.error("[products/[id]] DELETE error:", error);
    return NextResponse.json(
      { success: false, error: "Không thể xóa sản phẩm" },
      { status: 500 }
    );
  }
}
