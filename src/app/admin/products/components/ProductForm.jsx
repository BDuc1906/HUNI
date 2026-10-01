"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Package,
  Layers,
  Sparkles,
  Image as ImageIcon,
  Plus,
  Trash2,
  Check,
  X,
  AlertCircle,
  Loader2,
  ExternalLink,
  Save,
  CheckCircle,
} from "lucide-react";
import WholesaleTiersEditor from "./WholesaleTiersEditor";
import ColorEditor from "./ColorEditor";

const STANDARD_SIZES = ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL"];

const CATEGORIES = [
  { value: "corporate", label: "Đồng Phục Doanh Nghiệp (Corporate)" },
  { value: "bespoke_suit", label: "May Đo Cao Cấp / Vest Suit (Bespoke)" },
  { value: "sport_golf", label: "Thể Thao / Golf (Sport & Golf)" },
  { value: "school", label: "Đồng Phục Học Sinh & Giáo Viên (School)" },
  { value: "accessories", label: "Phụ Kiện Doanh Nghiệp (Accessories)" },
];

function generateSlug(text) {
  if (!text) return "";
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function ProductForm({
  initialData = null,
  isEdit = false,
  onSubmit,
  loading = false,
}) {
  const router = useRouter();

  // Basic info
  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [sku, setSku] = useState(initialData?.sku || "");
  const [category, setCategory] = useState(initialData?.category || "corporate");
  const [material, setMaterial] = useState(initialData?.material || "");
  const [description, setDescription] = useState(initialData?.description || "");

  // Pricing
  const [price, setPrice] = useState(initialData?.price ? String(initialData.price) : "");
  const [originalPrice, setOriginalPrice] = useState(
    initialData?.originalPrice ? String(initialData.originalPrice) : ""
  );
  const [wholesaleTiers, setWholesaleTiers] = useState(initialData?.wholesaleTiers || []);
  const [stock, setStock] = useState(
    initialData?.stock !== undefined ? String(initialData.stock) : "120"
  );

  // Features (dynamic list)
  const [features, setFeatures] = useState(initialData?.features || []);
  const [featureInput, setFeatureInput] = useState("");

  // Media
  const [images, setImages] = useState(initialData?.images || []);
  const [imageUrlInput, setImageUrlInput] = useState("");

  // Variants
  const [colors, setColors] = useState(initialData?.colors || []);
  const [sizes, setSizes] = useState(initialData?.sizes || ["S", "M", "L", "XL", "2XL"]);
  const [customSizeInput, setCustomSizeInput] = useState("");

  // Status
  const [published, setPublished] = useState(initialData?.published ?? true);
  const [featured, setFeatured] = useState(initialData?.featured ?? false);

  const [errorMessage, setErrorMessage] = useState("");
  const [autoSlug, setAutoSlug] = useState(!isEdit);

  // Auto-generate slug khi title đổi (nếu chưa từng sửa tay slug)
  const handleTitleChange = (val) => {
    setTitle(val);
    if (autoSlug) {
      setSlug(generateSlug(val));
    }
  };

  // Add Feature Tag
  const handleAddFeature = (e) => {
    if ((e.key === "Enter" || e.type === "click") && featureInput.trim()) {
      e.preventDefault();
      if (!features.includes(featureInput.trim())) {
        setFeatures([...features, featureInput.trim()]);
      }
      setFeatureInput("");
    }
  };

  const handleRemoveFeature = (idx) => {
    setFeatures(features.filter((_, i) => i !== idx));
  };

  // Add Image URL
  const handleAddImage = (e) => {
    e.preventDefault();
    if (imageUrlInput.trim() && !images.includes(imageUrlInput.trim())) {
      setImages([...images, imageUrlInput.trim()]);
      setImageUrlInput("");
    }
  };

  const handleRemoveImage = (idx) => {
    setImages(images.filter((_, i) => i !== idx));
  };

  // Toggle Size
  const handleToggleSize = (sizeVal) => {
    if (sizes.includes(sizeVal)) {
      setSizes(sizes.filter((s) => s !== sizeVal));
    } else {
      setSizes([...sizes, sizeVal]);
    }
  };

  const handleAddCustomSize = (e) => {
    e.preventDefault();
    const sz = customSizeInput.trim().toUpperCase();
    if (sz && !sizes.includes(sz)) {
      setSizes([...sizes, sz]);
      setCustomSizeInput("");
    }
  };

  const handleSubmitForm = async (targetPublished) => {
    setErrorMessage("");

    // Validate
    if (!title.trim()) {
      setErrorMessage("Vui lòng nhập tên sản phẩm");
      return;
    }
    if (!slug.trim()) {
      setErrorMessage("Vui lòng nhập đường dẫn URL (slug)");
      return;
    }
    if (!sku.trim()) {
      setErrorMessage("Vui lòng nhập mã SKU sản phẩm");
      return;
    }
    if (!price || parseInt(price, 10) <= 0) {
      setErrorMessage("Giá niêm yết sản phẩm phải lớn hơn 0");
      return;
    }
    if (!description.trim()) {
      setErrorMessage("Vui lòng nhập mô tả chi tiết sản phẩm");
      return;
    }
    if (images.length === 0) {
      setErrorMessage("Sản phẩm cần có ít nhất 1 ảnh đại diện");
      return;
    }

    const payload = {
      title: title.trim(),
      slug: slug.trim(),
      sku: sku.trim(),
      category,
      material: material.trim() || undefined,
      description: description.trim(),
      price: parseInt(price, 10),
      originalPrice: originalPrice ? parseInt(originalPrice, 10) : undefined,
      stock: stock ? parseInt(stock, 10) : 0,
      inStock: (stock ? parseInt(stock, 10) : 0) > 0,
      wholesaleTiers: wholesaleTiers.length > 0 ? wholesaleTiers : undefined,
      features,
      images,
      colors: colors.length > 0 ? colors : undefined,
      sizes,
      published: targetPublished,
      featured,
    };

    if (onSubmit) {
      await onSubmit(payload);
    }
  };

  return (
    <div className="space-y-6">
      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Form 2 Cột */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CỘT TRÁI (2/3): THÔNG TIN CHÍNH */}
        <div className="lg:col-span-2 space-y-6">
          {/* 1. Thông tin cơ bản */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Package className="w-4 h-4 text-blue-400" />
              <span>Thông Tin Cơ Bản</span>
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Tên sản phẩm <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="VD: Áo Polo Đồng Phục Doanh Nghiệp Premium"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Đường dẫn (Slug URL) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => {
                    setSlug(e.target.value);
                    setAutoSlug(false);
                  }}
                  placeholder="ao-polo-dong-phuc-premium"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
                <p className="text-[11px] text-slate-400 mt-1 font-mono">
                  URL sẽ là: <span className="text-blue-400">/san-pham/{slug || "..."}</span>
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Mã SKU <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={sku}
                  onChange={(e) => setSku(e.target.value.toUpperCase())}
                  placeholder="VD: POLO-HDC-01"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs font-mono text-white uppercase placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Danh mục sản phẩm <span className="text-rose-400">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Chất liệu vải / Thành phần
                </label>
                <input
                  type="text"
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  placeholder="VD: Cotton Cá Sấu 65/35, Bamboo Spandex..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Mô tả chi tiết sản phẩm <span className="text-rose-400">*</span>
              </label>
              <textarea
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Mô tả form dáng, công nghệ in thêu logo, ứng dụng thực tế cho doanh nghiệp..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* 2. Giá & Mức sỉ */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>Chính Sách Giá, Tồn Kho & Bán Sỉ</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Giá niêm yết (VNĐ) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="number"
                  step="1000"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="VD: 185000"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm font-mono font-bold text-emerald-400 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Giá cũ / Gạch ngang (VNĐ)
                </label>
                <input
                  type="number"
                  step="1000"
                  min="0"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  placeholder="VD: 250000"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm font-mono text-slate-400 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Số lượng tồn kho (Chiếc)
                </label>
                <input
                  type="number"
                  min="0"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="VD: 120"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm font-mono font-bold text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Bảng WholesaleTiersEditor */}
            <div className="pt-2 border-t border-slate-800">
              <WholesaleTiersEditor
                tiers={wholesaleTiers}
                basePrice={parseInt(price, 10) || 0}
                onChange={(updated) => setWholesaleTiers(updated)}
              />
            </div>
          </div>

          {/* 3. Đặc điểm nổi bật */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Đặc Điểm Nổi Bật (Features)</span>
            </h3>

            <div className="flex gap-2">
              <input
                type="text"
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                onKeyDown={handleAddFeature}
                placeholder="Nhập đặc điểm (VD: Vải cá sấu co giãn 4 chiều) rồi ấn Enter..."
                className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              <button
                type="button"
                onClick={handleAddFeature}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
              >
                Thêm
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {features.map((feat, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-300 border border-blue-500/20"
                >
                  <span>{feat}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(idx)}
                    className="hover:text-rose-400 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* CỘT PHẢI (1/3): TRẠNG THÁI & MEDIA */}
        <div className="space-y-6">
          {/* 1. Trạng thái xuất bản */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Trạng Thái Sản Phẩm
            </h3>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 cursor-pointer">
              <div>
                <span className="text-xs font-bold text-white block">Hiển thị website</span>
                <span className="text-[11px] text-slate-400">Cho phép khách xem & đặt may</span>
              </div>
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 cursor-pointer">
              <div>
                <span className="text-xs font-bold text-white block">Sản phẩm nổi bật</span>
                <span className="text-[11px] text-slate-400">Ghim lên trang chủ & bộ sưu tập</span>
              </div>
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
              />
            </label>
          </div>

          {/* 2. Hình ảnh sản phẩm */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-blue-400" />
                <span>Hình Ảnh ({images.length})</span>
              </h3>
              <span className="text-[11px] text-slate-400">Tối thiểu 1 ảnh</span>
            </div>

            <div className="flex gap-2">
              <input
                type="url"
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                placeholder="Dán link ảnh (https://...)"
                className="flex-1 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              <button
                type="button"
                onClick={handleAddImage}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-500 transition-colors shrink-0"
              >
                Thêm
              </button>
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-2 gap-2 pt-2">
                {images.map((imgUrl, idx) => (
                  <div
                    key={idx}
                    className="relative group rounded-xl overflow-hidden border border-slate-800 aspect-square bg-slate-950"
                  >
                    <Image
                      src={imgUrl}
                      alt={`Product preview ${idx + 1}`}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="p-1.5 rounded-lg bg-rose-600 text-white hover:bg-rose-500 transition-colors"
                        title="Xoá ảnh"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    {idx === 0 && (
                      <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-blue-600 text-white text-[9px] font-bold">
                        Ảnh chính
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 3. Màu sắc */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800">
            <ColorEditor
              colors={colors}
              onChange={(updatedColors) => setColors(updatedColors)}
            />
          </div>

          {/* 4. Kích cỡ */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Kích Cỡ Có Sẵn
            </h3>

            <div className="grid grid-cols-4 gap-2">
              {STANDARD_SIZES.map((sz) => {
                const isSelected = sizes.includes(sz);
                return (
                  <button
                    type="button"
                    key={sz}
                    onClick={() => handleToggleSize(sz)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                      isSelected
                        ? "bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/30"
                        : "bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-white"
                    }`}
                  >
                    {sz}
                  </button>
                );
              })}
            </div>

            <div className="flex gap-2 pt-2">
              <input
                type="text"
                value={customSizeInput}
                onChange={(e) => setCustomSizeInput(e.target.value)}
                placeholder="Size khác (VD: 5XL, Free)"
                className="flex-1 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              <button
                type="button"
                onClick={handleAddCustomSize}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
              >
                Thêm
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Form Action Buttons */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 sticky bottom-4 z-20 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl backdrop-blur-md">
        <button
          type="button"
          onClick={() => router.back()}
          disabled={loading}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
        >
          Huỷ bỏ
        </button>

        <div className="w-full sm:w-auto flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => handleSubmitForm(false)}
            disabled={loading}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30 transition-all flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Lưu bản nháp</span>
          </button>

          <button
            type="button"
            onClick={() => handleSubmitForm(true)}
            disabled={loading}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang lưu...</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>{isEdit ? "Cập nhật sản phẩm" : "Xuất bản sản phẩm"}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
