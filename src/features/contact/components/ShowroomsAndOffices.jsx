"use client";

import React, { useState } from "react";
import {
  Building2,
  MapPin,
  Factory,
  Phone,
  Clock,
  Navigation,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  Users,
  Compass,
} from "lucide-react";
import { BRAND_INFO } from "@/shared/data";
import { useShop } from "@/shared/providers/ShopProvider";

export const FACILITIES = [
  {
    id: "headquarters",
    icon: Building2,
    badge: "Trụ Sở Chính & Showroom",
    name: "HDC FASHION — Phú Thọ",
    address: "LK-17 Dự án Dạ Hợp 6 tầng, Phường Hòa Bình, TP. Việt Trì, Tỉnh Phú Thọ",
    addressFull: "LK-17 Dự án Dạ Hợp 6 tầng, Phường Hòa Bình, TP. Việt Trì, Tỉnh Phú Thọ, Việt Nam",
    phone: BRAND_INFO.contact.hotline,
    phoneRaw: BRAND_INFO.contact.hotlineRaw,
    hours: "08:00 - 18:00 (Thứ 2 - Thứ 7)",
    highlight: "Showroom trưng bày hơn 200+ mẫu vải & mẫu áo đồng phục thực tế",
    features: [
      "Trưng bày đầy đủ mẫu áo Polo, Vest, Sơ mi, Đồng phục Thể thao",
      "Tiếp đón lãnh đạo doanh nghiệp ký kết hợp đồng",
      "Khu vực thử phom dáng và chọn màu sắc theo nhận diện",
    ],
    lat: 21.3095,
    lng: 105.0654,
    mapQuery: "LK-17 Dự án Dạ Hợp, Hòa Bình, Việt Trì, Phú Thọ",
  },
  {
    id: "branch-hanoi",
    icon: MapPin,
    badge: "Văn Phòng Đại Diện",
    name: "VP Giao Dịch — Hà Nội",
    address: "Số 6, Kim Đồng, Hoàng Mai, Hà Nội",
    addressFull: "Số 6, Kim Đồng, Hoàng Mai, Hà Nội, Việt Nam",
    phone: BRAND_INFO.contact.hotline,
    phoneRaw: BRAND_INFO.contact.hotlineRaw,
    hours: "08:00 - 18:00 (Thứ 2 - Thứ 7)",
    highlight: "Trung tâm chăm sóc khách hàng doanh nghiệp khu vực miền Bắc",
    features: [
      "Hỗ trợ chuyên viên may đo mang mẫu vải đến tận văn phòng khách hàng",
      "Tư vấn thiết kế 3D trực tiếp và lấy số đo cho từng nhân sự",
      "Giao nhận mẫu thử tận nơi hỏa tốc trong nội thành Hà Nội",
    ],
    lat: 20.9822,
    lng: 105.8455,
    mapQuery: "Số 6, Kim Đồng, Hoàng Mai, Hà Nội",
  },
  {
    id: "factory",
    icon: Factory,
    badge: "Xưởng May Sản Xuất",
    name: "Nhà Máy May HDC 2.500m²",
    address: "KCN Thụy Vân, TP. Việt Trì, Tỉnh Phú Thọ",
    addressFull: "KCN Thụy Vân, Phường Thụy Vân, TP. Việt Trì, Tỉnh Phú Thọ, Việt Nam",
    phone: BRAND_INFO.contact.hotline,
    phoneRaw: BRAND_INFO.contact.hotlineRaw,
    hours: "07:30 - 17:30 (Thứ 2 - Thứ 7)",
    highlight: "Dây chuyền máy may tự động, công suất 50.000 sản phẩm / tháng",
    features: [
      "Hệ thống máy thêu vi tính Tajima Nhật Bản sắc sảo từng đường kim",
      "Máy in chuyển nhiệt kỹ thuật số bền màu vĩnh viễn không bong tróc",
      "Khách hàng có thể đăng ký tham quan quy trình sản xuất thực tế",
    ],
    lat: 21.2816,
    lng: 105.423,
    mapQuery: "KCN Thụy Vân, Việt Trì, Phú Thọ",
  },
];

export default function ShowroomsAndOffices({ selectedId, onSelectLocation }) {
  const { showToast } = useShop();
  const [copiedId, setCopiedId] = useState(null);

  const handleCopyAddress = (facility) => {
    navigator.clipboard.writeText(facility.addressFull);
    setCopiedId(facility.id);
    setTimeout(() => setCopiedId(null), 2000);
    showToast(`Đã sao chép địa chỉ ${facility.name}`);
  };

  return (
    <section className="py-14 sm:py-20 bg-slate-50 border-b border-slate-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-bold uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5 text-brand-600" />
            Hệ Thống Cơ Sở HDC FASHION
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#004f5e]">
            SHOWROOM TRƯNG BÀY &amp; XƯỞNG SẢN XUẤT
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            HDC sở hữu hệ thống văn phòng giao dịch tại Hà Nội, showroom chính và xưởng may quy mô lớn
            2.500m² tại Phú Thọ. Quý đối tác luôn được chào đón đến tham quan và trải nghiệm trực tiếp.
          </p>
        </div>

        {/* 3 Facility Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {FACILITIES.map((facility) => {
            const Icon = facility.icon;
            const isSelected = selectedId === facility.id;

            return (
              <div
                key={facility.id}
                onClick={() => onSelectLocation && onSelectLocation(facility)}
                className={`bg-white rounded-3xl p-6 sm:p-7 border transition-all duration-300 flex flex-col justify-between cursor-pointer relative group ${
                  isSelected
                    ? "border-brand-500 shadow-xl shadow-brand-500/10 ring-2 ring-brand-500/20"
                    : "border-slate-200 hover:border-brand-300 hover:shadow-lg"
                }`}
              >
                {/* Badge top */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 border border-brand-200/80 text-brand-700 text-xs font-bold">
                      <Sparkles className="w-3 h-3 text-brand-500" />
                      {facility.badge}
                    </span>

                    {isSelected && (
                      <span className="text-[11px] font-extrabold text-brand-600 bg-brand-100/70 px-2.5 py-0.5 rounded-full">
                        Đang chọn xem bản đồ
                      </span>
                    )}
                  </div>

                  {/* Icon & Title */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-black text-[#004f5e] group-hover:text-brand-600 transition-colors">
                        {facility.name}
                      </h3>
                      <p className="text-xs text-brand-700 font-semibold mt-0.5">
                        {facility.highlight}
                      </p>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="space-y-2.5 mb-5 text-xs sm:text-sm text-slate-700 bg-slate-50/80 rounded-2xl p-3.5 border border-slate-100">
                    <div className="flex items-start gap-2.5">
                      <MapPin className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                      <span className="font-medium leading-relaxed">{facility.address}</span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <Clock className="w-4 h-4 text-brand-600 shrink-0" />
                      <span>{facility.hours}</span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <Phone className="w-4 h-4 text-brand-600 shrink-0" />
                      <a
                        href={`tel:${facility.phoneRaw}`}
                        onClick={(e) => e.stopPropagation()}
                        className="font-bold text-[#004f5e] hover:text-brand-600 transition-colors"
                      >
                        {facility.phone}
                      </a>
                    </div>
                  </div>

                  {/* Key Features Bullet Points */}
                  <div className="space-y-2 mb-6">
                    {facility.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-500 shrink-0 mt-1.5" />
                        <span className="leading-snug">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyAddress(facility);
                    }}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    {copiedId === facility.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Đã chép địa chỉ</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Sao chép địa chỉ</span>
                      </>
                    )}
                  </button>

                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                      facility.addressFull
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="py-2.5 px-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Chỉ đường</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
