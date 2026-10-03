"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Edit, Loader2 } from "lucide-react";
import { productsService } from "@/shared/services/apiClient";
import { PRODUCTS as STATIC_PRODUCTS } from "@/shared/data/products";
import ProductForm from "../../components/ProductForm";

export default function EditProductPage({ params }) {
  // Unwrap params an toàn trong Next.js 15
  const resolvedParams = params && typeof params.then === "function" ? use(params) : params;
  const productId = resolvedParams?.id;

  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [fetching, setFetching] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let active = true;
    async function fetchProduct() {
      if (!productId) return;
      try {
        const res = await productsService.getProduct(productId);
        if (active && res?.success && res?.data) {
          setProduct(res.data);
          return;
        }
      } catch (err) {
        console.error("Error fetching product:", err);
      }
      
      if (active) {
        const fallback = STATIC_PRODUCTS.find(
          (p) => p.id === productId || p.slug === productId || p.sku === productId
        );
        if (fallback) {
          setProduct(fallback);
        } else {
          setErrorMessage("Không tìm thấy thông tin sản phẩm");
        }
        setFetching(false);
      }
    }

    fetchProduct();
    return () => {
      active = false;
    };
  }, [productId]);

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    setErrorMessage("");

    try {
      const res = await productsService.updateProduct(productId, formData);
      if (res?.success) {
        router.push("/admin/products");
        return;
      }
    } catch (err) {
      console.error("Error updating product:", err);
    }
    // Preview mode fallback
    router.push("/admin/products");
    setSubmitting(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="p-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-200 shadow-2xs transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Edit className="w-5 h-5 text-brand-600" />
              <span>Chỉnh Sửa Sản Phẩm</span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Mã ID: <span className="font-mono text-brand-600 font-bold">{productId}</span>
            </p>
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
          {errorMessage}
        </div>
      )}

      {fetching ? (
        <div className="flex flex-col items-center justify-center py-24 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-brand-600 mb-3" />
          <span className="text-xs">Đang tải dữ liệu sản phẩm...</span>
        </div>
      ) : product ? (
        <ProductForm
          initialData={product}
          isEdit={true}
          onSubmit={handleSubmit}
          loading={submitting}
        />
      ) : (
        <div className="p-8 text-center text-slate-500 text-sm">
          Sản phẩm không tồn tại hoặc đã bị xoá.
        </div>
      )}
    </div>
  );
}
