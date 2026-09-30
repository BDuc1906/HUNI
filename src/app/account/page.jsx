"use client";

import React, { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useShop } from "@/shared/providers/ShopProvider";
import { PRODUCTS, BRAND_INFO } from "@/shared/data";
import ProductCard from "@/features/catalog/components/ProductCard";
import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  Lock,
  Pencil,
  Save,
  X,
  Loader2,
  AlertCircle,
  Package,
  Heart,
  ShoppingBag,
  Calendar,
  ChevronRight,
  Search,
} from "lucide-react";

/* =========================================================
   WRAPPER — bọc Suspense cho useSearchParams
   ========================================================= */
export default function AccountPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-[#004f5e] via-[#00677a] to-[#003843] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-brand-400 animate-spin" />
        </div>
      }
    >
      <AccountInner />
    </Suspense>
  );
}

/* =========================================================
   MAIN
   ========================================================= */
function AccountInner() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  const tabParam = searchParams.get("tab") || "info";
  const validTabs = ["info", "orders", "wishlist"];
  const initialTab = validTabs.includes(tabParam) ? tabParam : "info";

  const [activeTab, setActiveTab] = useState(initialTab);

  // Sync URL → state khi user đổi query (VD bấm từ UserMenu)
  useEffect(() => {
    if (validTabs.includes(tabParam) && tabParam !== activeTab) {
      setActiveTab(tabParam);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabParam]);

  // Auth guard
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?redirect=/tai-khoan");
    }
  }, [status, router]);

  if (status === "loading" || !session?.user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#004f5e] via-[#00677a] to-[#003843] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand-400 animate-spin" />
      </div>
    );
  }

  const user = session.user;
  const initial = (user.name || user.email || "U").charAt(0).toUpperCase();

  const TABS = [
    { id: "info", label: "Thông tin tài khoản", icon: User },
    { id: "orders", label: "Đơn hàng của tôi", icon: Package },
    { id: "wishlist", label: "Sản phẩm yêu thích", icon: Heart },
  ];

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    // Update URL không reload (dùng history API trực tiếp cho mượt)
    if (typeof window !== "undefined") {
      const url =
        tabId === "info" ? "/tai-khoan" : `/tai-khoan?tab=${tabId}`;
      window.history.replaceState(null, "", url);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-6 sm:py-10">
      <div className="max-w-5xl mx-auto px-3 sm:px-4">
        {/* =============================================
            Header chào mừng
            ============================================= */}
        <div className="bg-gradient-to-r from-[#004f5e] to-[#00677a] rounded-2xl sm:rounded-3xl p-4 sm:p-6 mb-5 sm:mb-6 shadow-xl border border-brand-400/20">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-black text-xl sm:text-2xl shrink-0 border-4 border-white/20">
              {initial}
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-base sm:text-xl font-black text-white truncate">
                Xin chào, {user.name || "bạn"}!
              </h1>
              <p className="text-[11px] sm:text-sm text-brand-200/80 truncate">
                {user.email}
              </p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="hidden sm:flex items-center gap-2 px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-bold transition-colors shrink-0"
            >
              Đăng xuất
            </button>
          </div>
        </div>

        {/* =============================================
            Tab navigation
            ============================================= */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm mb-4 sm:mb-5 overflow-x-auto">
          <div className="flex items-center min-w-max p-1.5 gap-1">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                    active
                      ? "bg-gradient-to-r from-brand-400 to-brand-600 text-white shadow-md"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* =============================================
            Tab content
            ============================================= */}
        {activeTab === "info" && <InfoTab user={user} />}
        {activeTab === "orders" && <OrdersTab />}
        {activeTab === "wishlist" && <WishlistTab />}

        {/* Back home */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-xs text-slate-500 hover:text-brand-600 font-medium"
          >
            ← Về trang chủ HDC
          </Link>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   TAB 1 — THÔNG TIN TÀI KHOẢN
   ========================================================= */
function InfoTab({ user }) {
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState(null);

  const handleStartEdit = () => {
    setFullName(user.name || "");
    setPhone(user.phone || "");
    setEditing(true);
    setSaveMsg(null);
  };

  const handleCancel = () => {
    setEditing(false);
    setSaveMsg(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveMsg(null);
    // TODO: wire API /api/user/update
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    setEditing(false);
    setSaveMsg({
      type: "success",
      text: "Thông tin đã được cập nhật. (Demo — cần wire API thật)",
    });
  };

  return (
    <div className="space-y-4">
      {/* Card thông tin cá nhân */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-4 sm:px-5 py-3.5 bg-gradient-to-r from-[#004f5e] to-[#00677a] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-brand-400/20 border border-brand-400/40 flex items-center justify-center text-brand-300 shrink-0">
              <User className="w-4 h-4" />
            </div>
            <div className="text-white font-extrabold text-sm sm:text-base truncate">
              Thông tin cá nhân
            </div>
          </div>
          {!editing && (
            <button
              onClick={handleStartEdit}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-500/20 hover:bg-brand-500/30 border border-brand-400/40 text-brand-200 font-bold text-[11px] rounded-lg transition-colors shrink-0"
            >
              <Pencil className="w-3 h-3" />
              <span>Chỉnh sửa</span>
            </button>
          )}
        </div>

        <div className="p-4 sm:p-5">
          {!editing ? (
            <>
              <InfoRow icon={User} label="Họ và tên" value={user.name} />
              <InfoRow icon={Mail} label="Email đăng nhập" value={user.email} />
              <InfoRow
                icon={Phone}
                label="Số điện thoại"
                value={user.phone || "Chưa cập nhật"}
              />
              <InfoRow
                icon={ShieldCheck}
                label="Vai trò"
                value={user.role === "ADMIN" ? "Quản trị viên" : "Khách hàng"}
                isLast
              />
            </>
          ) : (
            <form onSubmit={handleSave} className="space-y-4">
              {saveMsg && (
                <div
                  className={`p-3 rounded-xl border text-xs flex items-start gap-2 ${
                    saveMsg.type === "error"
                      ? "bg-rose-50 border-rose-200 text-rose-800"
                      : "bg-emerald-50 border-emerald-200 text-emerald-800"
                  }`}
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{saveMsg.text}</span>
                </div>
              )}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Họ và tên
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-200"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0984.xxx.xxx"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-200"
                />
              </div>
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-brand-400 to-brand-600 hover:from-brand-300 hover:to-brand-500 text-white font-bold text-xs rounded-xl shadow-md disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Đang lưu...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>Lưu thay đổi</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl disabled:opacity-60"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Hủy</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Card bảo mật */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-4 sm:px-5 py-3.5 bg-gradient-to-r from-[#004f5e] to-[#00677a] flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-brand-400/20 border border-brand-400/40 flex items-center justify-center text-brand-300 shrink-0">
            <Lock className="w-4 h-4" />
          </div>
          <div className="text-white font-extrabold text-sm sm:text-base">
            Bảo mật
          </div>
        </div>

        <div className="p-4 sm:p-5">
          <button
            type="button"
            onClick={() =>
              alert("Tính năng đổi mật khẩu sẽ ra mắt ở phiên bản tiếp theo.")
            }
            className="w-full flex items-center justify-between gap-3 p-3.5 rounded-xl border border-slate-200 hover:border-brand-400 hover:bg-brand-50/40 transition-colors group"
          >
            <div className="flex items-center gap-3 text-left">
              <div className="w-9 h-9 rounded-lg bg-brand-100 text-brand-600 flex items-center justify-center shrink-0 group-hover:bg-brand-500 group-hover:text-white transition-colors">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-bold text-[#004f5e]">
                  Đổi mật khẩu
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Cập nhật mật khẩu đăng nhập mới
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value, isLast }) {
  return (
    <div
      className={`flex items-start gap-3 py-3.5 ${
        !isLast ? "border-b border-slate-100" : ""
      }`}
    >
      <div className="w-9 h-9 rounded-lg bg-brand-100 text-brand-600 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
          {label}
        </div>
        <div className="text-sm font-bold text-[#004f5e] mt-0.5 break-words">
          {value || "—"}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   TAB 2 — ĐƠN HÀNG
   ========================================================= */
const STATUS_MAP = {
  PENDING: { label: "Chờ xác nhận", color: "brand" },
  QUOTED: { label: "Đã báo giá", color: "brand" },
  CONFIRMED: { label: "Đã xác nhận", color: "blue" },
  PRODUCING: { label: "Đang sản xuất", color: "blue" },
  SHIPPED: { label: "Đang giao hàng", color: "purple" },
  COMPLETED: { label: "Hoàn thành", color: "emerald" },
  CANCELLED: { label: "Đã hủy", color: "rose" },
};

const COLOR_CLASSES = {
  brand: "bg-brand-100 text-brand-800 border-brand-200",
  blue: "bg-blue-100 text-blue-800 border-blue-200",
  purple: "bg-purple-100 text-purple-800 border-purple-200",
  emerald: "bg-emerald-100 text-emerald-800 border-emerald-200",
  rose: "bg-rose-100 text-rose-800 border-rose-200",
};

const ORDER_FILTERS = [
  { id: "all", label: "Tất cả" },
  { id: "PENDING", label: "Chờ xác nhận" },
  { id: "PRODUCING", label: "Đang sản xuất" },
  { id: "SHIPPED", label: "Đang giao" },
  { id: "COMPLETED", label: "Hoàn thành" },
  { id: "CANCELLED", label: "Đã hủy" },
];

function OrdersTab() {
  const { orders, setIsOrderTrackingOpen } = useShop();
  const [filter, setFilter] = useState("all");

  const filteredOrders =
    filter === "all"
      ? orders
      : orders.filter((o) => o.status === filter);

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-3">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            {orders.length} đơn hàng
          </div>
          <button
            onClick={() => setIsOrderTrackingOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] rounded-lg transition-colors"
          >
            <Search className="w-3 h-3" />
            <span>Tra cứu</span>
          </button>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {ORDER_FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all shrink-0 ${
                filter === f.id
                  ? "bg-[#004f5e] text-brand-300"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders list */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 sm:p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-[#004f5e]">
            {filter !== "all"
              ? "Không có đơn hàng trong mục này"
              : "Bạn chưa có đơn hàng nào"}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-2 mb-5">
            {filter !== "all"
              ? "Thử chọn bộ lọc khác để xem các đơn hàng khác."
              : "Khám phá các mẫu đồng phục cao cấp của HDC và bắt đầu đặt may ngay hôm nay."}
          </p>
          <Link
            href="/#catalog-section"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-brand-400 to-brand-600 hover:from-brand-300 hover:to-brand-500 text-white font-bold text-xs rounded-xl shadow-md"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Khám phá sản phẩm</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}

function OrderCard({ order }) {
  const status = STATUS_MAP[order.status] || {
    label: order.status || "Đã tiếp nhận",
    color: "brand",
  };
  const badgeClass = COLOR_CLASSES[status.color];

  const createdAt = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "—";

  const itemCount = order.items?.length || 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:border-brand-400 hover:shadow-md transition-all">
      <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500">Mã đơn:</span>
          <strong className="text-brand-800 font-black">
            {order.orderNumber || order.id}
          </strong>
        </div>
        <span
          className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${badgeClass}`}
        >
          {status.label}
        </span>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
          <Calendar className="w-3 h-3" />
          <span>Ngày đặt: {createdAt}</span>
        </div>

        {itemCount > 0 && (
          <div className="text-[11px] text-slate-500 mt-1 line-clamp-1">
            {order.items.slice(0, 2).map((it, i) => (
              <span key={i}>
                {i > 0 ? " • " : ""}
                {it.product?.title || it.productName} (x{it.quantity})
              </span>
            ))}
            {itemCount > 2 && (
              <span className="text-brand-700 font-bold">
                {" "}
                +{itemCount - 2} sản phẩm khác
              </span>
            )}
          </div>
        )}

        <div className="mt-2 text-sm font-black text-[#004f5e]">
          {(order.total || 0).toLocaleString("vi-VN")} đ
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   TAB 3 — SẢN PHẨM YÊU THÍCH
   ========================================================= */
function WishlistTab() {
  const { wishlist } = useShop();
  const favoriteProducts = PRODUCTS.filter((p) => wishlist.includes(p.id));

  if (favoriteProducts.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 sm:p-12 text-center">
        <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center mx-auto mb-4">
          <Heart className="w-8 h-8 text-rose-400" />
        </div>
        <h3 className="text-base sm:text-lg font-bold text-[#004f5e]">
          Chưa có sản phẩm yêu thích
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-2 mb-5">
          Nhấn vào biểu tượng ❤️ trên mỗi sản phẩm để lưu lại và xem lại dễ dàng.
        </p>
        <Link
          href="/#catalog-section"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-brand-400 to-brand-600 hover:from-brand-300 hover:to-brand-500 text-white font-bold text-xs rounded-xl shadow-md"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Khám phá sản phẩm</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
      {favoriteProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
