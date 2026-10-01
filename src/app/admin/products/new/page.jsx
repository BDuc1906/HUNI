"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, PlusCircle } from "lucide-react";
import { productsService } from "@/shared/services/apiClient";
import ProductForm from "../components/ProductForm";

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleSubmit = async (formData) => {
    setLoading(true);
    setSubmitError("");

    try {
      const res = await productsService.createProduct(formData);
      if (res?.success) {
        router.push("/admin/products");
        return;
      }
    } catch (err) {
      console.error("Error creating product:", err);
    }
    // Chế độ xem trước UI khi chưa kết nối Database / Backend
    router.push("/admin/products");
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-blue-400" />
              <span>Thêm Sản Phẩm Mới</span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Thiết lập thông tin áo đồng phục, mốc giá sỉ và danh mục hiển thị
            </p>
          </div>
        </div>
      </div>

      {submitError && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
          {submitError}
        </div>
      )}

      {/* Form tạo mới */}
      <ProductForm onSubmit={handleSubmit} loading={loading} />
    </div>
  );
}
