"use client";

import React from "react";
import { BRAND_INFO } from "@/shared/data";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Building2,
  Factory,
  Navigation,
  Copy,
  Check,
  Users,
  Calendar,
  ExternalLink,
  MessageCircle
} from "lucide-react";

/* =========================================================
   LOCATIONS — Dùng tọa độ GPS để marker đỏ chính xác
   ========================================================= */
const LOCATIONS = [
  {
    id: "headquarters",
    icon: Building2,
    label: "Trụ sở chính",
    name: "HDC FASHION — Trụ sở chính",
    address: "LK-17 Dự án Dạ Hợp 6 tầng, Phường Hòa Bình, Tỉnh Hòa Bình",
    addressFull: "LK-17 Dự án Dạ Hợp 6 tầng, Phường Hòa Bình, Tỉnh Hòa Bình, Việt Nam",
    phone: "0984 95 95 86",
    email: "dongphuchuni@gmail.com",
    hours: "Thứ 2 - Thứ 7: 8:00 - 18:00",
    hoursDetail: "Chủ nhật nghỉ (có hẹn trước cho đoàn đông)",
    note: "Trụ sở chính — văn phòng giao dịch & showroom trưng bày mẫu vải",
    lat: 21.3095,
    lng: 105.0654
  },
  {
    id: "branch-hanoi",
    icon: MapPin,
    label: "Văn phòng Hà Nội",
    name: "VP Hà Nội — HDC FASHION",
    address: "Số 6, Kim Đồng, Hoàng Mai, Hà Nội",
    addressFull: "Số 6, Kim Đồng, Hoàng Mai, Hà Nội, Việt Nam",
    phone: "0984 95 95 86",
    email: "dongphuchuni@gmail.com",
    hours: "Thứ 2 - Thứ 7: 8:00 - 18:00",
    hoursDetail: "Hỗ trợ đo đạc tận nơi trong nội thành",
    note: "Văn phòng đại diện — tiếp khách doanh nghiệp khu vực Hà Nội",
    query: "Số 6, Kim Đồng, Hoàng Mai, Hà Nội"
  },
  {
    id: "factory",
    icon: Factory,
    label: "Xưởng sản xuất",
    name: "Xưởng may HDC 2.500m²",
    address: "KCN Thụy Vân, TP. Việt Trì, Tỉnh Phú Thọ",
    addressFull: "KCN Thụy Vân, Phường Thụy Vân, TP. Việt Trì, Tỉnh Phú Thọ, Việt Nam",
    phone: "0984 95 95 86",
    email: "dongphuchuni@gmail.com",
    hours: "Thứ 2 - Thứ 7: 7:30 - 17:30",
    hoursDetail: "Công suất 50.000 sản phẩm / tháng",
    note: "Xưởng may trực tiếp — tham quan được khi có hẹn trước",
    lat: 21.2816,
    lng: 105.4230
  }
];

export default function MapSection() {
  const [activeLocation, setActiveLocation] = React.useState(LOCATIONS[0]);
  const [copied, setCopied] = React.useState(false);
  const [mapType, setMapType] = React.useState("hybrid"); // "roadmap" | "hybrid"

  // =========================================================
  // GOOGLE MAPS EMBED API
  // Yêu cầu: NEXT_PUBLIC_GOOGLE_MAPS_API_KEY (Maps Embed API đã enable)
  // Fallback: nếu không có API key → dùng embed miễn phí
  // =========================================================
  const mapApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  // Điểm nào có `query` (địa chỉ) thì tìm theo địa chỉ, ngược lại dùng tọa độ GPS
  const mapQuery = activeLocation.query
    ? encodeURIComponent(activeLocation.query)
    : `${activeLocation.lat},${activeLocation.lng}`;

  const mapEmbedUrl = mapApiKey
    ? `https://www.google.com/maps/embed/v1/place?key=${mapApiKey}&q=${mapQuery}&zoom=16&maptype=${mapType}&language=vi`
    : `https://www.google.com/maps?q=${mapQuery}&z=16&hl=vi&output=embed`;

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${mapQuery}`;
  const mapsUrl = `https://www.google.com/maps?q=${mapQuery}`;

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(activeLocation.addressFull);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="map-section" className="py-14 sm:py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-4">

        {/* ============================================
            Header
            ============================================ */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 space-y-2 sm:space-y-3">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-[11px] sm:text-xs font-bold uppercase tracking-wider">
            <Navigation className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-brand-500" />
            Liên Hệ & Bản Đồ
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#004f5e]">
            ĐẾN THĂM HDC FASHION
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Ghé trực tiếp để xem mẫu vải thật, thử áo và duyệt thiết kế cùng chuyên viên.
          </p>
        </div>

        {/* ============================================
            3 Cards selector — Grid 3 cột
            ============================================ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-5 sm:mb-6">
          {LOCATIONS.map((loc) => {
            const Icon = loc.icon;
            const isActive = activeLocation.id === loc.id;
            return (
              <button
                key={loc.id}
                onClick={() => setActiveLocation(loc)}
                className={`group text-left p-3.5 sm:p-4 rounded-2xl border-2 transition-all active:scale-[0.98] ${
                  isActive
                    ? "border-brand-500 bg-white shadow-xl ring-2 ring-brand-500/20"
                    : "border-slate-200 bg-white hover:border-brand-300 hover:shadow-md"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      isActive
                        ? "bg-gradient-to-br from-brand-400 to-brand-600 text-white shadow-md"
                        : "bg-slate-100 text-slate-600 group-hover:bg-brand-100 group-hover:text-brand-600"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                          isActive
                            ? "bg-brand-500 text-white"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {loc.label}
                      </span>
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      )}
                    </div>
                    <h3 className="font-extrabold text-[#004f5e] text-sm mt-1 line-clamp-1">
                      {loc.name}
                    </h3>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* ============================================
            MAIN — Map + Info
            ============================================ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">

          {/* ==========================================
              LEFT: MAP
              ========================================== */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border-2 border-slate-200 shadow-lg bg-slate-100 h-[300px] sm:h-[350px] lg:h-full lg:min-h-[450px]">
              <iframe
                key={`${activeLocation.id}-${mapType}`}
                src={mapEmbedUrl}
                title={`Bản đồ ${activeLocation.name}`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />

              {/* ==========================================
                  Toggle layer — Đường phố / Vệ tinh
                  Chỉ hiển thị khi có API key
                  ========================================== */}
              {mapApiKey && (
                <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/95 backdrop-blur-md rounded-xl p-1 shadow-lg border border-slate-200 z-10">
                  <button
                    onClick={() => setMapType("roadmap")}
                    className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-colors ${
                      mapType === "roadmap"
                        ? "bg-[#004f5e] text-brand-300"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                    title="Xem bản đồ đường phố"
                  >
                    🗺️ Đường phố
                  </button>
                  <button
                    onClick={() => setMapType("hybrid")}
                    className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-colors ${
                      mapType === "hybrid"
                        ? "bg-[#004f5e] text-brand-300"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                    title="Xem ảnh vệ tinh"
                  >
                    🛰️ Vệ tinh
                  </button>
                </div>
              )}

              {/* Badge tên cơ sở */}
              <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md rounded-xl px-3 py-2 shadow-lg border border-slate-200 max-w-[calc(100%-160px)] pointer-events-none">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  <div className="text-[11px] font-bold text-[#004f5e] truncate">
                    {activeLocation.name}
                  </div>
                </div>
              </div>

              {/* Nút mở Google Maps */}
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 px-3 py-2 bg-white/95 backdrop-blur-md hover:bg-white text-[#004f5e] font-bold text-[11px] sm:text-xs rounded-lg shadow-lg active:scale-95 transition-all border border-slate-200"
              >
                <ExternalLink className="w-3.5 h-3.5 text-brand-600" />
                <span>Mở Maps</span>
              </a>
            </div>
          </div>

          {/* ==========================================
              RIGHT: INFO LIÊN HỆ
              ========================================== */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden h-full flex flex-col">

              {/* Header teal */}
              <div className="bg-gradient-to-r from-[#004f5e] to-[#00677a] px-4 sm:px-5 py-3.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-brand-400/20 border border-brand-400/40 flex items-center justify-center text-brand-300 shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-white font-extrabold text-sm sm:text-base truncate">
                      Thông Tin Liên Hệ
                    </div>
                    <div className="text-brand-200/80 text-[10px] uppercase tracking-wider font-semibold truncate">
                      {activeLocation.label}
                    </div>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-4 sm:p-5 space-y-3.5 flex-1 flex flex-col">

                {/* Địa chỉ chính xác */}
                <div className="p-3 sm:p-4 bg-brand-50 rounded-xl border border-brand-200">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-brand-600 shrink-0" />
                      <span className="text-[10px] uppercase font-bold tracking-wider text-brand-700">
                        Địa chỉ chính xác
                      </span>
                    </div>
                    <button
                      onClick={handleCopyAddress}
                      className="p-1.5 rounded-lg bg-white hover:bg-brand-100 text-brand-700 active:scale-95 transition-all border border-brand-200 shrink-0"
                      title="Sao chép địa chỉ"
                      aria-label="Sao chép địa chỉ"
                    >
                      {copied ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                  <p className="text-sm sm:text-base font-bold text-[#004f5e] leading-snug">
                    {activeLocation.addressFull}
                  </p>
                  {activeLocation.note && (
                    <p className="text-[11px] text-slate-600 italic mt-2 leading-relaxed">
                      💡 {activeLocation.note}
                    </p>
                  )}
                </div>

                {/* Phone + Email grid 2 cột */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <a
                    href={`tel:${activeLocation.phone.replace(/\./g, "")}`}
                    className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-brand-400 hover:bg-brand-50/50 transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-brand-100 text-brand-600 flex items-center justify-center shrink-0 group-hover:bg-brand-500 group-hover:text-white transition-colors">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                        Hotline / Zalo
                      </div>
                      <div className="font-extrabold text-[#004f5e] text-sm truncate">
                        {activeLocation.phone}
                      </div>
                    </div>
                  </a>

                  <a
                    href={`mailto:${activeLocation.email}`}
                    className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-brand-400 hover:bg-brand-50/50 transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-brand-100 text-brand-600 flex items-center justify-center shrink-0 group-hover:bg-brand-500 group-hover:text-white transition-colors">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                        Email
                      </div>
                      <div className="font-extrabold text-[#004f5e] text-sm truncate">
                        {activeLocation.email}
                      </div>
                    </div>
                  </a>
                </div>

                {/* Giờ làm việc */}
                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="w-9 h-9 rounded-lg bg-brand-100 text-brand-600 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                      Giờ làm việc
                    </div>
                    <div className="font-bold text-[#004f5e] text-sm">
                      {activeLocation.hours}
                    </div>
                    {activeLocation.hoursDetail && (
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {activeLocation.hoursDetail}
                      </div>
                    )}
                  </div>
                </div>

                {/* Action buttons — 3 nút */}
                <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-1 mt-auto">
                  <a
                    href={`tel:${activeLocation.phone.replace(/\./g, "")}`}
                    className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 py-2.5 sm:py-3 bg-gradient-to-r from-brand-400 to-brand-600 hover:from-brand-300 hover:to-brand-500 text-white font-bold text-[11px] sm:text-sm rounded-xl shadow-md active:scale-[0.98] transition-all"
                  >
                    <Phone className="w-4 h-4 shrink-0" />
                    <span>Gọi ngay</span>
                  </a>
                  <a
                    href={directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 py-2.5 sm:py-3 bg-[#004f5e] hover:bg-slate-800 text-brand-300 font-bold text-[11px] sm:text-sm rounded-xl active:scale-[0.98] transition-all"
                  >
                    <Navigation className="w-4 h-4 shrink-0" />
                    <span>Chỉ đường</span>
                  </a>
                  <a
                    href={`https://zalo.me/${BRAND_INFO.contact.zalo}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] sm:text-sm rounded-xl shadow-md active:scale-[0.98] transition-all"
                  >
                    <MessageCircle className="w-4 h-4 shrink-0" />
                    <span>Chat Zalo</span>
                  </a>
                </div>

                {/* Meta info */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3 h-3 text-brand-500" />
                    <span>Tiếp khách DN & đoàn đông</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3 h-3 text-brand-500" />
                    <span>Hẹn trước 24h</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================
            Bottom CTA
            ============================================ */}
        <div className="mt-5 sm:mt-6 p-4 rounded-2xl bg-gradient-to-r from-brand-50 via-brand-100/60 to-brand-50 border border-brand-200 text-center">
          <p className="text-xs sm:text-sm text-slate-700">
            <strong className="text-[#004f5e]">Quý doanh nghiệp ở xa?</strong>{" "}
            HDC hỗ trợ cử chuyên viên mang thước, bảng vải mẫu
            <strong> đến tận văn phòng</strong> đo đạc miễn phí.
          </p>
          <a
            href={`tel:${BRAND_INFO.contact.hotlineRaw}`}
            className="inline-flex items-center gap-2 mt-3 px-5 py-2.5 bg-gradient-to-r from-brand-400 to-brand-600 hover:from-brand-300 hover:to-brand-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md active:scale-[0.98] transition-all"
          >
            <Phone className="w-4 h-4" />
            <span>Đặt hẹn: {BRAND_INFO.contact.hotline}</span>
          </a>
        </div>
      </div>
    </section>
  );
}
