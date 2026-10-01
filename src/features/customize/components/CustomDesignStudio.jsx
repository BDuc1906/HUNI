"use client";

import React, { useState, useId, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Palette,
  Upload,
  Sparkles,
  Check,
  CheckCircle2,
  Phone,
  MessageCircle,
  HelpCircle,
  RefreshCw,
  FileText,
  FileArchive,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sliders,
  Eye,
  Type,
  Layers,
  ChevronDown,
  X,
  Plus,
  Minus,
  Ruler,
  Users,
  User,
  Info,
} from "lucide-react";
import GarmentCanvas, { LOGO_POSITIONS } from "./GarmentCanvas";
import { quotesService } from "@/shared/services/apiClient";
import { BRAND_INFO } from "@/shared/data";

// ====================================================
// DANH SÁCH MẪU TRANG PHỤC HỖ TRỢ THIẾT KẾ
// ====================================================
const GARMENT_TYPES = [
  {
    id: "polo",
    categoryKey: "polo",
    name: "Áo Polo Doanh Nghiệp",
    shortName: "Polo",
    basePrice: 175000,
    desc: "Cổ bẻ thanh lịch, bo dệt vi tính, chuẩn phom văn phòng",
    fabrics: [
      { id: "cvc_pique", name: "Pique Cá Sấu CVC 65/35 (Được chuộng nhất)", priceAdj: 0 },
      { id: "cotton_compact", name: "Cotton Compact 100% kháng khuẩn 250gsm", priceAdj: 25000 },
      { id: "bamboo_silk", name: "Sợi Tre Bamboo Silk cao cấp chống tia UV", priceAdj: 45000 },
    ],
  },
  {
    id: "shirt",
    categoryKey: "shirt",
    name: "Áo Sơ Mi Công Sở",
    shortName: "Sơ Mi",
    basePrice: 285000,
    desc: "Kate Ý chống nhăn, phom đứng chuẩn CEO & lãnh đạo",
    fabrics: [
      { id: "kate_italy", name: "Kate Ý Chống Nhăn Cao Cấp", priceAdj: 0 },
      { id: "kate_usa", name: "Kate Mỹ Mịn Mát Thoáng Khí", priceAdj: 20000 },
      { id: "bamboo_nano", name: "Nano Bamboo Kháng Khuẩn Tự Nhiên", priceAdj: 50000 },
    ],
  },
  {
    id: "tshirt",
    categoryKey: "polo",
    name: "Áo Thun Cổ Tròn Sự Kiện",
    shortName: "Áo Thun",
    basePrice: 125000,
    desc: "Cotton 100% 4 chiều, trẻ trung, năng động cho team building",
    fabrics: [
      { id: "cotton_2way", name: "Cotton 65/35 Co Giãn Tiêu Chuẩn", priceAdj: 0 },
      { id: "cotton_4way", name: "Cotton 100% 4 Chiều Cao Cấp (230gsm)", priceAdj: 20000 },
      { id: "poly_mè", name: "Thun Mè Thể Thao Mát Mẻ", priceAdj: -10000 },
    ],
  },
  {
    id: "golf",
    categoryKey: "golf",
    name: "Đồng Phục Golf & Thể Thao",
    shortName: "Golf & Sport",
    basePrice: 195000,
    desc: "Poly Spandex Dry-fit thoát mồ hôi cực nhanh, tay Raglan",
    fabrics: [
      { id: "dryfit_poly", name: "Dry-Fit Mắt Chim Siêu Thoát Khí", priceAdj: 0 },
      { id: "spandex_4d", name: "Spandex 4D Co Giãn Không Giới Hạn", priceAdj: 30000 },
      { id: "air_mesh", name: "Air Mesh Kháng Khuẩn Ion Bạc", priceAdj: 45000 },
    ],
  },
  {
    id: "jacket",
    categoryKey: "accessories",
    name: "Áo Khoác Gió Doanh Nghiệp",
    shortName: "Áo Gió",
    basePrice: 265000,
    desc: "Gió Micro tráng bạc 2 lớp chống nước, cản gió mùa đông",
    fabrics: [
      { id: "gio_micro", name: "Gió Micro Tráng Bạc 2 Lớp", priceAdj: 0 },
      { id: "gio_chong_nuoc", name: "Gió Gân Chống Nước Tuyệt Đối 3 Lớp", priceAdj: 35000 },
      { id: "gio_lot_long", name: "Gió Trần Bông / Lót Lông Cừu Giữ Nhiệt", priceAdj: 65000 },
    ],
  },
];

// ====================================================
// BẢNG MÀU THỰC TẾ CHUẨN DOANH NGHIỆP CỦA HDC
// ====================================================
const COLOR_SWATCHES = [
  { name: "Deep Teal Signature", hex: "#004f5e", desc: "Xanh ngọc đậm nhận diện HDC" },
  { name: "Xanh Navy Doanh Nghiệp", hex: "#0A2540", desc: "Sang trọng, lịch lãm, phổ biến nhất" },
  { name: "Đen Quyền Lực", hex: "#1E293B", desc: "Hiện đại, sạch sẽ, chuẩn CEO" },
  { name: "Trắng Tinh Khôi", hex: "#F8FAFC", desc: "Thanh lịch, dễ phối màu logo" },
  { name: "Xanh Dương Nhạt", hex: "#93C5FD", desc: "Trẻ trung, thân thiện, dịu mắt" },
  { name: "Đỏ Đô Burgundy", hex: "#881337", desc: "Nhiệt huyết, quyền lực và đẳng cấp" },
  { name: "Xám Melange Tiêu", hex: "#64748B", desc: "Phong cách châu Âu hiện đại" },
  { name: "Xanh Rêu Forest", hex: "#14532D", desc: "Vững chãi, tinh tế, xu hướng 2026" },
  { name: "Be Cát Sang Trọng", hex: "#E2D9C8", desc: "Thanh thoát, quý phái, tối giản" },
  { name: "Xanh Coban Năng Động", hex: "#1D4ED8", desc: "Nổi bật, tràn đầy năng lượng" },
  { name: "Cam Nhiệt Huyết", hex: "#EA580C", desc: "Phù hợp công nghệ, khởi nghiệp, sự kiện" },
  { name: "Đỏ Cờ Tươi Trẻ", hex: "#DC2626", desc: "Nổi bật cho các lễ hội và kỷ niệm" },
];

// ====================================================
// CÔNG NGHỆ IN / THÊU LOGO
// ====================================================
const EMBROIDERY_METHODS = [
  {
    id: "theu_tajima",
    name: "Thêu Vi Tính Tajima 3D Nhật Bản",
    shortName: "Thêu Tajima",
    desc: "Mũi chỉ sắc nét, bền vĩnh viễn, sang trọng bậc nhất cho ngực áo",
    badge: "Khuyên dùng",
    extraCost: 0,
  },
  {
    id: "in_pet_4k",
    name: "In Chuyển Nhiệt PET 4K Siêu Nét",
    shortName: "In PET 4K",
    desc: "Đa sắc màu, thể hiện dải gradient phức tạp không giới hạn màu",
    badge: "Đa sắc màu",
    extraCost: 0,
  },
  {
    id: "in_lua_cao_cap",
    name: "In Lụa Mực Plastisol Châu Âu",
    shortName: "In Lụa Cao Cấp",
    desc: "Bền màu 100+ lần giặt, tối ưu chi phí cho các đơn hàng lớn",
    badge: "Tiết kiệm",
    extraCost: 0,
  },
  {
    id: "in_phan_quang",
    name: "In Phản Quang 3M Cao Cấp",
    shortName: "In Phản Quang",
    desc: "Nổi bật phát sáng ban đêm, thể thao, áo gió và sự kiện chạy bộ",
    badge: "Nổi bật",
    extraCost: 15000,
  },
];

// ====================================================
// BẬC SỐ LƯỢNG VÀ TỶ LỆ CHIẾT KHẤU
// ====================================================
const QUANTITY_TIERS = [
  { min: 10, max: 29, discountRate: -0.25, label: "10 - 29 áo", multiplier: 1.25 },
  { min: 30, max: 49, discountRate: -0.10, label: "30 - 49 áo", multiplier: 1.10 },
  { min: 50, max: 99, discountRate: 0.0, label: "50 - 99 áo (Chuẩn)", multiplier: 1.00 },
  { min: 100, max: 199, discountRate: 0.12, label: "100 - 199 áo (Giảm 12%)", multiplier: 0.88 },
  { min: 200, max: 499, discountRate: 0.20, label: "200 - 499 áo (Giảm 20%)", multiplier: 0.80 },
  { min: 500, max: 100000, discountRate: 0.28, label: "500+ áo (Giảm 28% giá xưởng)", multiplier: 0.72 },
];

// ====================================================
// BẢNG THÔNG SỐ SIZE CHUẨN HDC FASHION
// ====================================================
export const SIZE_SPECS_MEN = [
  { size: "S", weight: "50 - 57 kg", height: "1m55 - 1m62", chest: "88 - 92 cm", shoulder: "42 cm", length: "66 cm" },
  { size: "M", weight: "58 - 65 kg", height: "1m63 - 1m69", chest: "92 - 96 cm", shoulder: "44 cm", length: "68 cm" },
  { size: "L", weight: "66 - 73 kg", height: "1m70 - 1m75", chest: "96 - 100 cm", shoulder: "46 cm", length: "70 cm" },
  { size: "XL", weight: "74 - 82 kg", height: "1m75 - 1m80", chest: "100 - 106 cm", shoulder: "48 cm", length: "72 cm" },
  { size: "2XL", weight: "83 - 90 kg", height: "1m78 - 1m85", chest: "106 - 112 cm", shoulder: "50 cm", length: "74 cm" },
  { size: "3XL", weight: "91 - 100 kg", height: "1m80 - 1m90", chest: "112 - 120 cm", shoulder: "52 cm", length: "76 cm" },
];

export const SIZE_SPECS_WOMEN = [
  { size: "S", weight: "42 - 47 kg", height: "1m50 - 1m55", chest: "80 - 84 cm", shoulder: "36 cm", length: "58 cm" },
  { size: "M", weight: "48 - 53 kg", height: "1m55 - 1m60", chest: "84 - 88 cm", shoulder: "38 cm", length: "60 cm" },
  { size: "L", weight: "54 - 59 kg", height: "1m60 - 1m65", chest: "88 - 92 cm", shoulder: "40 cm", length: "62 cm" },
  { size: "XL", weight: "60 - 66 kg", height: "1m63 - 1m68", chest: "92 - 96 cm", shoulder: "42 cm", length: "64 cm" },
  { size: "2XL", weight: "67 - 75 kg", height: "1m65 - 1m72", chest: "96 - 102 cm", shoulder: "44 cm", length: "66 cm" },
];

export const SIZE_SPECS_UNISEX = [
  { size: "S", weight: "45 - 53 kg", height: "1m50 - 1m60" },
  { size: "M", weight: "54 - 63 kg", height: "1m60 - 1m68" },
  { size: "L", weight: "64 - 72 kg", height: "1m68 - 1m75" },
  { size: "XL", weight: "73 - 82 kg", height: "1m75 - 1m80" },
  { size: "2XL", weight: "83 - 90 kg", height: "1m80 - 1m85" },
  { size: "3XL", weight: "91 - 100 kg", height: "1m80 - 1m90" },
];

// Phân bổ size chuẩn theo thông số nhân sự doanh nghiệp Việt Nam
const SIZE_PRESETS = {
  split: {
    30: {
      men: { S: 0, M: 5, L: 8, XL: 5, "2XL": 0, "3XL": 0 },
      women: { S: 2, M: 6, L: 4, XL: 0, "2XL": 0 },
    },
    50: {
      men: { S: 0, M: 8, L: 12, XL: 8, "2XL": 2, "3XL": 0 },
      women: { S: 3, M: 10, L: 5, XL: 2, "2XL": 0 },
    },
    100: {
      men: { S: 2, M: 18, L: 25, XL: 12, "2XL": 3, "3XL": 0 },
      women: { S: 5, M: 20, L: 12, XL: 3, "2XL": 0 },
    },
    200: {
      men: { S: 5, M: 35, L: 50, XL: 25, "2XL": 5, "3XL": 0 },
      women: { S: 10, M: 40, L: 25, XL: 5, "2XL": 0 },
    },
  },
  unisex: {
    30: { S: 3, M: 10, L: 12, XL: 5, "2XL": 0, "3XL": 0 },
    50: { S: 5, M: 15, L: 20, XL: 8, "2XL": 2, "3XL": 0 },
    100: { S: 10, M: 30, L: 40, XL: 15, "2XL": 5, "3XL": 0 },
    200: { S: 20, M: 60, L: 80, XL: 30, "2XL": 10, "3XL": 0 },
  },
};

export default function CustomDesignStudio() {
  const customColorInputId = useId();
  // Tab chế độ: "interactive" (Studio tự thiết kế) | "upload_file" (Gửi file mẫu có sẵn)
  const [activeTab, setActiveTab] = useState("interactive");

  // State cho Studio Tự Thiết Kế (Interactive)
  const [selectedGarmentId, setSelectedGarmentId] = useState("polo");
  const [garmentView, setGarmentView] = useState("front"); // "front" | "back"
  const [selectedColor, setSelectedColor] = useState(COLOR_SWATCHES[0].hex);
  const [collarStyle, setCollarStyle] = useState("plain"); // "plain" | "striped" | "contrast"
  const [contrastCollarColor, setContrastCollarColor] = useState("#0A2540");
  const [cuffStyle, setCuffStyle] = useState("plain"); // "plain" | "contrast"

  // Logo / Artwork
  const [logoMode, setLogoMode] = useState("upload"); // "upload" | "text"
  const [uploadedLogoUrl, setUploadedLogoUrl] = useState(null);
  const [uploadedLogoName, setUploadedLogoName] = useState("");
  const [brandText, setBrandText] = useState("HDC GROUP");
  const [brandFont, setBrandFont] = useState("font-sans");
  const [brandTextColor, setBrandTextColor] = useState("#ffffff");
  const [logoPosition, setLogoPosition] = useState("chest_left");
  const [logoScale, setLogoScale] = useState(100);
  const [selectedMethod, setSelectedMethod] = useState("theu_tajima");

  // Vải may
  const [selectedFabricId, setSelectedFabricId] = useState("cvc_pique");

  // ====================================================
  // HỆ THỐNG PHÂN BỔ NHIỀU KÍCH CỠ (MULTI-SIZE MATRIX)
  // ====================================================
  // sizeMode: "split" (Nam & Nữ riêng) | "unisex" (Form chung) | "quick" (Nhập nhanh tổng)
  const [sizeMode, setSizeMode] = useState("split");
  const [menSizes, setMenSizes] = useState({ S: 0, M: 10, L: 15, XL: 10, "2XL": 5, "3XL": 0 });
  const [womenSizes, setWomenSizes] = useState({ S: 5, M: 15, L: 10, XL: 5, "2XL": 0 });
  const [unisexSizes, setUnisexSizes] = useState({ S: 5, M: 15, L: 20, XL: 15, "2XL": 5, "3XL": 0 });
  const [quickQuantity, setQuickQuantity] = useState(50);
  const [sendSizeChartLater, setSendSizeChartLater] = useState(false);
  const [requestFittingKit, setRequestFittingKit] = useState(false);

  // Modal Bảng Thông Số Size
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [sizeGuideTab, setSizeGuideTab] = useState("men");

  // State cho Chế độ 2: Gửi File Bản Vẽ Có Sẵn
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadCategory, setUploadCategory] = useState("polo");
  const [uploadQuantity, setUploadQuantity] = useState(50);
  const [uploadBudget, setUploadBudget] = useState("standard"); // "budget" | "standard" | "vip"
  const [uploadTimeline, setUploadTimeline] = useState("standard"); // "urgent" | "standard" | "relaxed"
  const [uploadNotes, setUploadNotes] = useState("");
  const [uploadRequestFittingKit, setUploadRequestFittingKit] = useState(false);

  // Modal gửi thông tin & nhận báo giá
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerCompany, setCustomerCompany] = useState("");
  const [generalNotes, setGeneralNotes] = useState("");
  const [phoneError, setPhoneError] = useState("");

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(null); // null | { quoteId, data }
  const [submitError, setSubmitError] = useState("");

  // Lấy cấu hình garment đang chọn
  const currentGarment =
    GARMENT_TYPES.find((g) => g.id === selectedGarmentId) || GARMENT_TYPES[0];
  const currentFabric =
    currentGarment.fabrics.find((f) => f.id === selectedFabricId) ||
    currentGarment.fabrics[0];
  const currentMethod =
    EMBROIDERY_METHODS.find((m) => m.id === selectedMethod) ||
    EMBROIDERY_METHODS[0];

  // ====================================================
  // TỔNG HỢP SỐ LƯỢNG VÀ PHÂN BỔ KÍCH CỠ
  // ====================================================
  const menTotal = useMemo(
    () => Object.values(menSizes).reduce((acc, q) => acc + (Number(q) || 0), 0),
    [menSizes]
  );
  const womenTotal = useMemo(
    () => Object.values(womenSizes).reduce((acc, q) => acc + (Number(q) || 0), 0),
    [womenSizes]
  );
  const unisexTotal = useMemo(
    () => Object.values(unisexSizes).reduce((acc, q) => acc + (Number(q) || 0), 0),
    [unisexSizes]
  );

  const totalInteractiveQuantity = useMemo(() => {
    if (sizeMode === "split") return menTotal + womenTotal;
    if (sizeMode === "unisex") return unisexTotal;
    return Math.max(0, Number(quickQuantity) || 0);
  }, [sizeMode, menTotal, womenTotal, unisexTotal, quickQuantity]);

  // Handler cập nhật số lượng từng size (+ / -)
  const handleUpdateSize = (gender, sizeKey, delta) => {
    if (gender === "men") {
      setMenSizes((prev) => {
        const current = Number(prev[sizeKey] || 0);
        return { ...prev, [sizeKey]: Math.max(0, current + delta) };
      });
    } else if (gender === "women") {
      setWomenSizes((prev) => {
        const current = Number(prev[sizeKey] || 0);
        return { ...prev, [sizeKey]: Math.max(0, current + delta) };
      });
    } else if (gender === "unisex") {
      setUnisexSizes((prev) => {
        const current = Number(prev[sizeKey] || 0);
        return { ...prev, [sizeKey]: Math.max(0, current + delta) };
      });
    }
  };

  // Handler nhập trực tiếp số lượng vào input
  const handleSetDirectSize = (gender, sizeKey, val) => {
    const num = Math.max(0, parseInt(val, 10) || 0);
    if (gender === "men") {
      setMenSizes((prev) => ({ ...prev, [sizeKey]: num }));
    } else if (gender === "women") {
      setWomenSizes((prev) => ({ ...prev, [sizeKey]: num }));
    } else if (gender === "unisex") {
      setUnisexSizes((prev) => ({ ...prev, [sizeKey]: num }));
    }
  };

  // Handler áp dụng tỉ lệ chia size chuẩn doanh nghiệp
  const handleApplyPreset = (targetQty) => {
    if (sizeMode === "split") {
      const preset = SIZE_PRESETS.split[targetQty];
      if (preset) {
        setMenSizes({ ...preset.men });
        setWomenSizes({ ...preset.women });
      }
    } else if (sizeMode === "unisex") {
      const preset = SIZE_PRESETS.unisex[targetQty];
      if (preset) {
        setUnisexSizes({ ...preset });
      }
    } else {
      setQuickQuantity(targetQty);
    }
  };

  // Handler đặt lại toàn bộ size về 0 để nhập từ đầu
  const handleResetSizes = () => {
    if (sizeMode === "split") {
      setMenSizes({ S: 0, M: 0, L: 0, XL: 0, "2XL": 0, "3XL": 0 });
      setWomenSizes({ S: 0, M: 0, L: 0, XL: 0, "2XL": 0 });
    } else if (sizeMode === "unisex") {
      setUnisexSizes({ S: 0, M: 0, L: 0, XL: 0, "2XL": 0, "3XL": 0 });
    } else {
      setQuickQuantity(0);
    }
  };

  // Chuỗi tóm tắt phân bổ size ngắn gọn gửi theo Quote (< 100 ký tự)
  const getSizeSummaryText = () => {
    if (sizeMode === "split") {
      const activeMen = Object.entries(menSizes)
        .filter(([, q]) => Number(q) > 0)
        .map(([s, q]) => `${s}:${q}`);
      const activeWomen = Object.entries(womenSizes)
        .filter(([, q]) => Number(q) > 0)
        .map(([s, q]) => `${s}:${q}`);

      const parts = [];
      if (activeMen.length > 0) parts.push(`Nam[${activeMen.join(",")}]`);
      if (activeWomen.length > 0) parts.push(`Nữ[${activeWomen.join(",")}]`);
      let summary =
        parts.length > 0
          ? parts.join(" ")
          : `Tổng ${totalInteractiveQuantity} áo`;
      if (requestFittingKit) summary += " (+Thử size)";
      return summary;
    } else if (sizeMode === "unisex") {
      const activeUnisex = Object.entries(unisexSizes)
        .filter(([, q]) => Number(q) > 0)
        .map(([s, q]) => `${s}:${q}`);
      let summary =
        activeUnisex.length > 0
          ? `Unisex[${activeUnisex.join(",")}]`
          : `Tổng ${totalInteractiveQuantity} áo`;
      if (requestFittingKit) summary += " (+Thử size)";
      return summary;
    } else {
      let summary = sendSizeChartLater
        ? `Tổng ${quickQuantity} áo (gửi bảng size sau)`
        : `Tổng ${quickQuantity} áo`;
      if (requestFittingKit) summary += " (+Thử size)";
      return summary;
    }
  };

  // ====================================================
  // TÍNH TOÁN GIÁ SỈ & CHIẾT KHẤU THEO TỔNG SỐ LƯỢNG
  // ====================================================
  const calculatePrice = () => {
    const activeQty = Math.max(1, totalInteractiveQuantity);
    const tier =
      QUANTITY_TIERS.find((t) => activeQty >= t.min && activeQty <= t.max) ||
      (activeQty < 10
        ? QUANTITY_TIERS[0]
        : QUANTITY_TIERS[QUANTITY_TIERS.length - 1]);
    const baseWithFabric =
      currentGarment.basePrice + (currentFabric?.priceAdj || 0);
    const methodExtra = currentMethod?.extraCost || 0;
    const unitPrice = Math.round(
      (baseWithFabric * tier.multiplier + methodExtra) / 1000
    ) * 1000;
    const totalPrice = unitPrice * activeQty;
    const originalPrice = (baseWithFabric + methodExtra) * 1.25 * activeQty;
    const savings = Math.max(0, originalPrice - totalPrice);

    return {
      unitPrice,
      totalPrice,
      savings,
      tier,
      activeQty,
    };
  };

  const pricing = calculatePrice();

  // Xử lý upload ảnh logo cho Studio
  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 15 * 1024 * 1024) {
        alert("File ảnh logo tối đa 15MB. Vui lòng chọn file nhẹ hơn.");
        return;
      }
      const previewUrl = URL.createObjectURL(file);
      setUploadedLogoUrl(previewUrl);
      setUploadedLogoName(file.name);
      setLogoMode("upload");
    }
  };

  // Xử lý upload file thiết kế cho Tab 2 (Gửi mẫu)
  const handleFileUploadList = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newFiles = files.map((f) => ({
      id: Math.random().toString(36).substring(2, 9),
      file: f,
      name: f.name,
      size: (f.size / (1024 * 1024)).toFixed(2) + " MB",
      type: f.name.split(".").pop().toUpperCase(),
    }));

    setUploadedFiles((prev) => [...prev, ...newFiles]);
  };

  const removeUploadedFile = (id) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  // Chuẩn hóa và validate số điện thoại (10-11 số)
  const validatePhone = (phone) => {
    const clean = phone.replace(/[\s.\-()+]/g, "");
    if (!/^[0-9]{10,11}$/.test(clean)) {
      return "Số điện thoại phải từ 10 - 11 chữ số";
    }
    return "";
  };

  // Mở modal gửi thông tin
  const handleOpenSubmitModal = () => {
    setIsSubmitModalOpen(true);
    setSubmitError("");
  };

  // Gửi Quote Request đến API /api/quotes
  const handleSubmitQuote = async (e) => {
    e.preventDefault();
    setSubmitError("");

    const phoneErr = validatePhone(customerPhone);
    if (phoneErr) {
      setPhoneError(phoneErr);
      return;
    }
    setPhoneError("");

    if (!customerName.trim() || customerName.trim().length < 2) {
      setSubmitError("Vui lòng nhập họ và tên (tối thiểu 2 ký tự)");
      return;
    }

    if (activeTab === "interactive" && totalInteractiveQuantity < 10) {
      setSubmitError(
        "Số lượng đặt may tối thiểu là 10 áo để đảm bảo quy trình dệt nhuộm & in thêu vi tính. Vui lòng chọn thêm số lượng."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // Chuẩn bị payload theo API_CONTRACT.md
      let category = "polo";
      let structuredNotes = "";
      let estPrice = 0;
      let finalQty = 10;

      if (activeTab === "interactive") {
        category = currentGarment.categoryKey || "polo";
        finalQty = Math.max(10, totalInteractiveQuantity);
        estPrice = pricing.totalPrice;

        const colorName =
          COLOR_SWATCHES.find((c) => c.hex.toLowerCase() === selectedColor.toLowerCase())?.name ||
          selectedColor;
        const posName = LOGO_POSITIONS[logoPosition]?.name || logoPosition;
        const sizeStr = getSizeSummaryText();

        // Giữ cấu trúc ghi chú ngắn gọn, súc tích (dưới 500 ký tự per contract)
        structuredNotes = `[Studio 2D] Áo: ${currentGarment.name} | Màu: ${colorName} (${selectedColor}) | Vải: ${currentFabric.name} | Size: ${sizeStr} | In/thêu: ${currentMethod.shortName} (${posName})${uploadedLogoName ? " | Logo: " + uploadedLogoName : ""}${generalNotes ? " | Y/c: " + generalNotes.trim() : ""}`;
      } else {
        category = uploadCategory || "polo";
        finalQty = Math.max(10, uploadQuantity);
        estPrice = 0;

        const fileNames = uploadedFiles.map((f) => f.name).join(", ");
        const fittingNote = uploadRequestFittingKit ? " | Có y/c thử size tại VP" : "";
        structuredNotes = `[Gửi Mẫu Thiết Kế] Ngân sách: ${uploadBudget} | Tiến độ: ${uploadTimeline}${fittingNote} | File: ${fileNames || "Chưa chọn file"} | Yêu cầu: ${uploadNotes || generalNotes || "Tư vấn báo giá"}`;
      }

      // Đảm bảo không quá 500 ký tự theo validation của createQuoteSchema
      if (structuredNotes.length > 490) {
        structuredNotes = structuredNotes.substring(0, 485) + "...";
      }

      const quotePayload = {
        fullName: customerName.trim(),
        phone: customerPhone.replace(/[\s.\-()+]/g, ""),
        email: customerEmail.trim() || undefined,
        company: customerCompany.trim() || undefined,
        category,
        quantity: finalQty,
        estimatedPrice: estPrice > 0 ? estPrice : undefined,
        notes: structuredNotes,
      };

      const res = await quotesService.submitQuote(quotePayload);

      if (res && res.success) {
        setSubmitSuccess({
          quoteId: res.data?.quoteId || res.quoteId || "HDC-QUOTE",
          category: currentGarment.name,
          quantity: finalQty,
          sizeSummary:
            activeTab === "interactive"
              ? getSizeSummaryText()
              : `${finalQty} áo`,
          requestFittingKit:
            activeTab === "interactive"
              ? requestFittingKit
              : uploadRequestFittingKit,
          pricing: activeTab === "interactive" ? pricing : null,
        });
      } else {
        setSubmitError(
          res.error ||
            "Không thể gửi yêu cầu báo giá vào lúc này. Vui lòng liên hệ trực tiếp hotline!"
        );
      }
    } catch (err) {
      console.error("Quote submission error:", err);
      setSubmitError("Lỗi kết nối máy chủ. Vui lòng thử lại hoặc gọi Hotline.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      {/* ====================================================
          TAB CONTROLLER: 2 CHẾ ĐỘ
          ==================================================== */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 bg-slate-900/60 p-2 sm:p-2.5 rounded-2xl border border-slate-800">
        <div className="grid grid-cols-2 w-full sm:w-auto gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("interactive")}
            className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === "interactive"
                ? "bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-lg shadow-brand-500/25 ring-2 ring-brand-400/40"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Palette className="w-4 h-4 text-brand-300 shrink-0" />
            <span>Studio Tự Thiết Kế 2D</span>
            <span className="hidden md:inline-block px-1.5 py-0.5 text-[9px] font-black uppercase rounded bg-amber-400 text-slate-950">
              Mới
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("upload_file")}
            className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === "upload_file"
                ? "bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-lg shadow-brand-500/25 ring-2 ring-brand-400/40"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Upload className="w-4 h-4 text-brand-300 shrink-0" />
            <span>Gửi Bản Vẽ / File Có Sẵn</span>
            <span className="hidden md:inline-block px-1.5 py-0.5 text-[9px] font-semibold uppercase rounded bg-white/10 text-slate-300">
              AI / PDF
            </span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-300 px-3 py-1.5 bg-slate-800/80 rounded-xl border border-slate-700 w-full sm:w-auto justify-center">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Cam kết may mẫu thực tế 0đ & phối cảnh 3D miễn phí</span>
        </div>
      </div>

      {/* ====================================================
          TAB 1: STUDIO TỰ THIẾT KẾ 2D (INTERACTIVE MODE)
          ==================================================== */}
      {activeTab === "interactive" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* CỘT TRÁI: MOCKUP CANVAS & GÓC NHÌN */}
          <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-24">
            {/* Component Canvas tương tác */}
            <GarmentCanvas
              garmentType={selectedGarmentId}
              view={garmentView}
              colorHex={selectedColor}
              collarHex={contrastCollarColor}
              collarStyle={collarStyle}
              cuffStyle={cuffStyle}
              logoImage={logoMode === "upload" ? uploadedLogoUrl : null}
              logoText={logoMode === "text" ? brandText : ""}
              logoFont={brandFont}
              logoTextColor={brandTextColor}
              logoPosition={logoPosition}
              logoScale={logoScale}
              methodName={currentMethod.name}
              onSelectPosition={(posId) => {
                setLogoPosition(posId);
                // Tự động chuyển view sang trước/sau tương ứng
                if (LOGO_POSITIONS[posId]?.view) {
                  setGarmentView(LOGO_POSITIONS[posId].view);
                }
              }}
            />

            {/* Điều khiển góc nhìn & Thao tác nhanh */}
            <div className="flex items-center justify-center gap-2 p-2 bg-slate-900 rounded-2xl border border-slate-800 max-w-[440px] mx-auto">
              <button
                type="button"
                onClick={() => setGarmentView("front")}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 ${
                  garmentView === "front"
                    ? "bg-brand-500 text-white shadow"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                Mặt Trước
              </button>
              <button
                type="button"
                onClick={() => setGarmentView("back")}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 ${
                  garmentView === "back"
                    ? "bg-brand-500 text-white shadow"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Mặt Sau
              </button>
              <button
                type="button"
                onClick={() => {
                  const random =
                    COLOR_SWATCHES[
                      Math.floor(Math.random() * COLOR_SWATCHES.length)
                    ].hex;
                  setSelectedColor(random);
                }}
                title="Đổi màu ngẫu nhiên"
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-700 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Cam kết hỗ trợ thiết kế */}
            <div className="bg-slate-900/60 rounded-2xl p-4 border border-slate-800 space-y-2.5 max-w-[440px] mx-auto">
              <div className="flex items-start gap-2.5 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  Đội ngũ designer HDC sẽ hoàn thiện bản vẽ 3D sắc nét theo đúng mã màu Pantone của quý công ty.
                </span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  Hỗ trợ thêu / in mẫu thử thực tế trên đúng chất vải trước khi tiến hành may hàng loạt.
                </span>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: BẢNG ĐIỀU KHIỂN THIẾT KẾ & TÙY CHỌN */}
          <div className="lg:col-span-7 space-y-6">
            {/* BƯỚC 1: CHỌN MẪU TRANG PHỤC */}
            <div className="bg-slate-900/90 rounded-3xl p-5 sm:p-6 border border-slate-800 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-brand-500 text-slate-950 font-black text-xs flex items-center justify-center">
                    1
                  </span>
                  <h3 className="font-extrabold text-white text-base sm:text-lg">
                    Chọn Loại Trang Phục
                  </h3>
                </div>
                <span className="text-xs text-brand-300 font-semibold">
                  {currentGarment.name}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {GARMENT_TYPES.map((garment) => {
                  const isSelected = garment.id === selectedGarmentId;
                  return (
                    <button
                      key={garment.id}
                      type="button"
                      onClick={() => {
                        setSelectedGarmentId(garment.id);
                        setSelectedFabricId(garment.fabrics[0].id);
                      }}
                      className={`p-3 rounded-2xl border text-left transition-all relative ${
                        isSelected
                          ? "bg-brand-500/10 border-brand-400 ring-2 ring-brand-500/30 text-white"
                          : "bg-slate-800/60 border-slate-700/80 text-slate-300 hover:border-slate-600 hover:bg-slate-800"
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-brand-400 text-slate-950 flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      )}
                      <div className="font-bold text-xs sm:text-sm">
                        {garment.shortName}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1 line-clamp-1">
                        Từ {garment.basePrice.toLocaleString("vi-VN")} đ
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* BƯỚC 2: PHỐI MÀU THÂN ÁO & CHI TIẾT */}
            <div className="bg-slate-900/90 rounded-3xl p-5 sm:p-6 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-brand-500 text-slate-950 font-black text-xs flex items-center justify-center">
                    2
                  </span>
                  <h3 className="font-extrabold text-white text-base sm:text-lg">
                    Phối Màu Thân & Cổ Áo
                  </h3>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <span>Màu đang chọn:</span>
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-white/40"
                    style={{ backgroundColor: selectedColor }}
                  />
                </div>
              </div>

              {/* Bảng màu mẫu có sẵn */}
              <div>
                <label className="text-xs text-slate-400 block mb-2 font-medium">
                  Bảng màu doanh nghiệp tiêu chuẩn HDC (12 màu phổ biến):
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5">
                  {COLOR_SWATCHES.map((swatch) => {
                    const isSelected =
                      selectedColor.toLowerCase() === swatch.hex.toLowerCase();
                    return (
                      <button
                        key={swatch.hex}
                        type="button"
                        onClick={() => setSelectedColor(swatch.hex)}
                        title={`${swatch.name}: ${swatch.desc}`}
                        className={`group relative p-1.5 rounded-xl border flex flex-col items-center transition-all ${
                          isSelected
                            ? "border-brand-400 bg-brand-500/10 ring-2 ring-brand-400/40"
                            : "border-slate-700/80 bg-slate-800/40 hover:border-slate-500"
                        }`}
                      >
                        <span
                          className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg shadow-inner border border-white/20 mb-1 flex items-center justify-center transition-transform group-hover:scale-105"
                          style={{ backgroundColor: swatch.hex }}
                        >
                          {isSelected && (
                            <Check
                              className={`w-3.5 h-3.5 ${
                                swatch.hex === "#F8FAFC" || swatch.hex === "#E2D9C8"
                                  ? "text-slate-900"
                                  : "text-white"
                              } stroke-[3]`}
                            />
                          )}
                        </span>
                        <span className="text-[10px] text-slate-300 truncate w-full text-center font-medium">
                          {swatch.name.split(" ")[0]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tùy chỉnh màu theo mã HEX riêng */}
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-800/80">
                <div className="text-xs text-slate-400">
                  Doanh nghiệp có mã màu chuẩn theo Brand Guidelines?
                </div>
                <div className="flex items-center gap-2">
                  <label
                    htmlFor={customColorInputId}
                    className="relative cursor-pointer flex items-center gap-2 px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white hover:border-slate-500 transition-colors"
                  >
                    <input
                      id={customColorInputId}
                      type="color"
                      value={selectedColor}
                      onChange={(e) => setSelectedColor(e.target.value)}
                      className="w-5 h-5 rounded cursor-pointer border-0 p-0 bg-transparent"
                    />
                    <span>Chọn mã màu khác</span>
                  </label>
                  <input
                    type="text"
                    value={selectedColor}
                    onChange={(e) => {
                      if (e.target.value.startsWith("#") || e.target.value === "") {
                        setSelectedColor(e.target.value);
                      }
                    }}
                    placeholder="#004f5e"
                    className="w-24 px-2 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white font-mono text-center uppercase focus:outline-none focus:border-brand-400"
                  />
                </div>
              </div>

              {/* Kiểu phối cổ áo & viền tay (đối với áo Polo) */}
              {selectedGarmentId === "polo" && (
                <div className="pt-3 border-t border-slate-800 space-y-2">
                  <label className="text-xs text-slate-400 font-medium block">
                    Kiểu phối bo cổ & gấu tay:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setCollarStyle("plain")}
                      className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition-all ${
                        collarStyle === "plain"
                          ? "bg-brand-500/20 border-brand-400 text-white"
                          : "bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800"
                      }`}
                    >
                      Cổ trơn cùng màu
                    </button>
                    <button
                      type="button"
                      onClick={() => setCollarStyle("striped")}
                      className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition-all ${
                        collarStyle === "striped"
                          ? "bg-brand-500/20 border-brand-400 text-white"
                          : "bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800"
                      }`}
                    >
                      Dệt vi tính 2 sọc
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCollarStyle("contrast");
                        setCuffStyle("contrast");
                      }}
                      className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition-all ${
                        collarStyle === "contrast"
                          ? "bg-brand-500/20 border-brand-400 text-white"
                          : "bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800"
                      }`}
                    >
                      Cổ phối tương phản
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* BƯỚC 3: LOGO & CÔNG NGHỆ IN / THÊU */}
            <div className="bg-slate-900/90 rounded-3xl p-5 sm:p-6 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-brand-500 text-slate-950 font-black text-xs flex items-center justify-center">
                    3
                  </span>
                  <h3 className="font-extrabold text-white text-base sm:text-lg">
                    Logo & Công Nghệ In / Thêu
                  </h3>
                </div>
                <span className="text-xs text-brand-300 font-semibold">
                  {LOGO_POSITIONS[logoPosition]?.shortName}
                </span>
              </div>

              {/* Chọn nguồn logo: Tải ảnh hoặc gõ chữ */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-800 rounded-xl">
                <button
                  type="button"
                  onClick={() => setLogoMode("upload")}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    logoMode === "upload"
                      ? "bg-brand-500 text-white shadow"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" />
                  Tải Lên File Logo
                </button>
                <button
                  type="button"
                  onClick={() => setLogoMode("text")}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    logoMode === "text"
                      ? "bg-brand-500 text-white shadow"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Type className="w-3.5 h-3.5" />
                  Gõ Tên Doanh Nghiệp
                </button>
              </div>

              {/* Form Tải logo */}
              {logoMode === "upload" ? (
                <div className="space-y-3">
                  <div className="border-2 border-dashed border-slate-700 hover:border-brand-400/70 rounded-2xl p-4 text-center transition-colors bg-slate-800/40">
                    <input
                      type="file"
                      id="logo-upload"
                      accept="image/png,image/jpeg,image/svg+xml,image/webp"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                    <label
                      htmlFor="logo-upload"
                      className="cursor-pointer flex flex-col items-center justify-center"
                    >
                      {uploadedLogoUrl ? (
                        <div className="flex items-center gap-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={uploadedLogoUrl}
                            alt="Logo preview"
                            className="w-12 h-12 object-contain bg-black/40 rounded-lg p-1 border border-slate-600"
                          />
                          <div className="text-left">
                            <div className="text-xs font-bold text-white truncate max-w-[200px]">
                              {uploadedLogoName || "Logo đã tải lên"}
                            </div>
                            <span className="text-[10px] text-brand-300 font-medium">
                              Nhấn để đổi logo khác
                            </span>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="w-10 h-10 rounded-full bg-brand-500/10 text-brand-400 flex items-center justify-center mb-2">
                            <Upload className="w-5 h-5" />
                          </div>
                          <span className="text-xs font-bold text-white mb-0.5">
                            Bấm để chọn file logo (PNG, JPG, SVG)
                          </span>
                          <span className="text-[10px] text-slate-400">
                            Khuyên dùng file nền trong suốt (transparent PNG)
                          </span>
                        </>
                      )}
                    </label>
                  </div>
                </div>
              ) : (
                /* Form Gõ chữ thương hiệu */
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-slate-400 font-medium block mb-1">
                      Tên thương hiệu / Slogan:
                    </label>
                    <input
                      type="text"
                      value={brandText}
                      onChange={(e) => setBrandText(e.target.value)}
                      placeholder="VD: VIETCOMBANK / FPT CORP"
                      className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-400"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <label className="text-[11px] text-slate-400 block mb-1">
                        Kiểu chữ:
                      </label>
                      <select
                        value={brandFont}
                        onChange={(e) => setBrandFont(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-brand-400"
                      >
                        <option value="font-sans">Hiện đại (Sans-serif)</option>
                        <option value="font-serif">Sang trọng (Serif cổ điển)</option>
                        <option value="font-mono">Công nghệ (Monospace)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">
                        Màu chữ:
                      </label>
                      <input
                        type="color"
                        value={brandTextColor}
                        onChange={(e) => setBrandTextColor(e.target.value)}
                        className="w-10 h-8 rounded-xl cursor-pointer border border-slate-700 p-0.5 bg-slate-800"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Vị trí đặt logo trên áo */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <label className="text-xs text-slate-400 font-medium block">
                  Chọn vị trí đặt logo:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {Object.values(LOGO_POSITIONS).map((pos) => {
                    const isSelected = pos.id === logoPosition;
                    return (
                      <button
                        key={pos.id}
                        type="button"
                        onClick={() => {
                          setLogoPosition(pos.id);
                          setGarmentView(pos.view);
                        }}
                        className={`p-2 rounded-xl border text-left text-xs transition-all ${
                          isSelected
                            ? "bg-brand-500/20 border-brand-400 text-white ring-1 ring-brand-400"
                            : "bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-800"
                        }`}
                      >
                        <div className="font-bold flex items-center justify-between">
                          <span className="truncate">{pos.shortName}</span>
                          {isSelected && (
                            <Check className="w-3 h-3 text-brand-300" />
                          )}
                        </div>
                        <div className="text-[9px] text-slate-400 mt-0.5">
                          {pos.view === "front" ? "Mặt trước" : "Mặt sau"}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Kích thước logo slider */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">
                    Kích thước logo trên mockup:
                  </span>
                  <span className="text-brand-300 font-bold font-mono">
                    {logoScale}%
                  </span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="140"
                  step="5"
                  value={logoScale}
                  onChange={(e) => setLogoScale(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-400"
                />
              </div>

              {/* Lựa chọn công nghệ in/thêu */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <label className="text-xs text-slate-400 font-medium block">
                  Công nghệ in / thêu:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {EMBROIDERY_METHODS.map((method) => {
                    const isSelected = method.id === selectedMethod;
                    return (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setSelectedMethod(method.id)}
                        className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                          isSelected
                            ? "bg-brand-500/20 border-brand-400 text-white ring-1 ring-brand-400"
                            : "bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-800"
                        }`}
                      >
                        <div className="font-bold flex items-center justify-between gap-1">
                          <span className="truncate">{method.shortName}</span>
                          <span className="px-1.5 py-0.5 text-[9px] rounded bg-white/10 text-brand-300 font-semibold">
                            {method.badge}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1 line-clamp-1">
                          {method.desc}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* BƯỚC 4: CHẤT LIỆU VẢI & PHÂN BỔ KÍCH CỠ & BÁO GIÁ SỈ */}
            <div className="bg-slate-900/90 rounded-3xl p-5 sm:p-6 border border-slate-800 shadow-xl space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-brand-500 text-slate-950 font-black text-xs flex items-center justify-center">
                    4
                  </span>
                  <h3 className="font-extrabold text-white text-base sm:text-lg">
                    Chất Liệu & Phân Bổ Kích Cỡ
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="text-xs text-brand-300 hover:text-brand-200 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-500/10 hover:bg-brand-500/20 border border-brand-400/30 transition-all font-semibold"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>Bảng Thông Số Size Chuẩn</span>
                </button>
              </div>

              {/* Lựa chọn chất liệu vải cho dòng áo */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs text-slate-400 font-medium block">
                    Dòng vải may khuyên dùng cho {currentGarment.name}:
                  </label>
                  <Link
                    href="/bang-vai"
                    target="_blank"
                    className="text-[11px] text-brand-300 hover:underline flex items-center gap-1"
                  >
                    <Layers className="w-3 h-3" />
                    Xem bảng vải
                  </Link>
                </div>
                <div className="space-y-2">
                  {currentGarment.fabrics.map((fabric) => {
                    const isSelected = fabric.id === selectedFabricId;
                    return (
                      <button
                        key={fabric.id}
                        type="button"
                        onClick={() => setSelectedFabricId(fabric.id)}
                        className={`w-full p-3 rounded-2xl border text-left text-xs transition-all flex items-center justify-between ${
                          isSelected
                            ? "bg-brand-500/20 border-brand-400 text-white ring-1 ring-brand-400"
                            : "bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              isSelected
                                ? "border-brand-400 bg-brand-400"
                                : "border-slate-500"
                            }`}
                          >
                            {isSelected && (
                              <Check className="w-2.5 h-2.5 text-slate-950 stroke-[3]" />
                            )}
                          </div>
                          <span className="font-bold">{fabric.name}</span>
                        </div>
                        {fabric.priceAdj !== 0 && (
                          <span className="text-[11px] text-brand-300 font-mono">
                            {fabric.priceAdj > 0 ? "+" : ""}
                            {fabric.priceAdj.toLocaleString("vi-VN")} đ
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* KHU VỰC PHÂN BỔ KÍCH CỠ */}
              <div className="pt-4 border-t border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
                      <Users className="w-4 h-4 text-brand-400" />
                      Phân Bổ Kích Cỡ Đặt May
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Chọn số lượng từng size hoặc nhập nhanh rồi gửi danh sách sau
                    </p>
                  </div>

                  {/* Chuyển chế độ chọn size */}
                  <div className="grid grid-cols-3 gap-1 p-1 bg-slate-800/90 rounded-xl border border-slate-700/60 text-xs">
                    <button
                      type="button"
                      onClick={() => setSizeMode("split")}
                      className={`px-2.5 py-1.5 rounded-lg font-bold transition-all flex items-center justify-center gap-1 ${
                        sizeMode === "split"
                          ? "bg-brand-500 text-white shadow-sm"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <Users className="w-3 h-3" />
                      <span>Nam & Nữ</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSizeMode("unisex")}
                      className={`px-2.5 py-1.5 rounded-lg font-bold transition-all flex items-center justify-center gap-1 ${
                        sizeMode === "unisex"
                          ? "bg-brand-500 text-white shadow-sm"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <User className="w-3 h-3" />
                      <span>Unisex</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSizeMode("quick")}
                      className={`px-2.5 py-1.5 rounded-lg font-bold transition-all flex items-center justify-center gap-1 ${
                        sizeMode === "quick"
                          ? "bg-brand-500 text-white shadow-sm"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <Sliders className="w-3 h-3" />
                      <span>Nhập Nhanh</span>
                    </button>
                  </div>
                </div>

                {/* Chế độ 1: Phân bổ Nam & Nữ riêng */}
                {sizeMode === "split" && (
                  <div className="space-y-4">
                    {/* BẢNG SIZE NAM */}
                    <div className="bg-slate-800/40 p-3.5 sm:p-4 rounded-2xl border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center justify-center">
                            <User className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-xs font-bold text-white uppercase tracking-wider">
                            Size Áo Nam (Form Suông Chuẩn Công Sở)
                          </span>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 text-xs font-black font-mono">
                          {menTotal} áo
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                        {SIZE_SPECS_MEN.map((spec) => {
                          const qty = menSizes[spec.size] || 0;
                          return (
                            <div
                              key={`men-${spec.size}`}
                              className={`p-2.5 rounded-xl border text-center transition-all ${
                                qty > 0
                                  ? "bg-sky-500/10 border-sky-400/50 shadow-sm"
                                  : "bg-slate-900/60 border-slate-800 opacity-85 hover:opacity-100"
                              }`}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-black text-sm text-white">{spec.size}</span>
                                <span className="text-[10px] text-slate-400 font-medium">
                                  {spec.weight.split(" ")[0]}-{spec.weight.split(" ")[2]}kg
                                </span>
                              </div>
                              <div className="flex items-center justify-between bg-slate-900 rounded-lg p-0.5 border border-slate-700">
                                <button
                                  type="button"
                                  onClick={() => handleUpdateSize("men", spec.size, -1)}
                                  disabled={qty <= 0}
                                  className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-20 text-slate-300 hover:text-white flex items-center justify-center transition-all"
                                  aria-label={`Giảm size Nam ${spec.size}`}
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <input
                                  type="number"
                                  min="0"
                                  max="5000"
                                  value={qty === 0 ? "" : qty}
                                  placeholder="0"
                                  onChange={(e) => handleSetDirectSize("men", spec.size, e.target.value)}
                                  className="w-8 text-center font-black font-mono text-xs text-sky-300 bg-transparent focus:outline-none"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleUpdateSize("men", spec.size, 1)}
                                  className="w-6 h-6 rounded bg-slate-800 hover:bg-sky-500 hover:text-slate-950 text-slate-300 flex items-center justify-center transition-all"
                                  aria-label={`Tăng size Nam ${spec.size}`}
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* BẢNG SIZE NỮ */}
                    <div className="bg-slate-800/40 p-3.5 sm:p-4 rounded-2xl border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-lg bg-pink-500/10 text-pink-400 border border-pink-500/20 flex items-center justify-center">
                            <User className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-xs font-bold text-white uppercase tracking-wider">
                            Size Áo Nữ (Form Chiết Eo Tôn Dáng)
                          </span>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 text-xs font-black font-mono">
                          {womenTotal} áo
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                        {SIZE_SPECS_WOMEN.map((spec) => {
                          const qty = womenSizes[spec.size] || 0;
                          return (
                            <div
                              key={`women-${spec.size}`}
                              className={`p-2.5 rounded-xl border text-center transition-all ${
                                qty > 0
                                  ? "bg-pink-500/10 border-pink-400/50 shadow-sm"
                                  : "bg-slate-900/60 border-slate-800 opacity-85 hover:opacity-100"
                              }`}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-black text-sm text-white">{spec.size}</span>
                                <span className="text-[10px] text-slate-400 font-medium">
                                  {spec.weight.split(" ")[0]}-{spec.weight.split(" ")[2]}kg
                                </span>
                              </div>
                              <div className="flex items-center justify-between bg-slate-900 rounded-lg p-0.5 border border-slate-700">
                                <button
                                  type="button"
                                  onClick={() => handleUpdateSize("women", spec.size, -1)}
                                  disabled={qty <= 0}
                                  className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-20 text-slate-300 hover:text-white flex items-center justify-center transition-all"
                                  aria-label={`Giảm size Nữ ${spec.size}`}
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <input
                                  type="number"
                                  min="0"
                                  max="5000"
                                  value={qty === 0 ? "" : qty}
                                  placeholder="0"
                                  onChange={(e) => handleSetDirectSize("women", spec.size, e.target.value)}
                                  className="w-8 text-center font-black font-mono text-xs text-pink-300 bg-transparent focus:outline-none"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleUpdateSize("women", spec.size, 1)}
                                  className="w-6 h-6 rounded bg-slate-800 hover:bg-pink-500 hover:text-slate-950 text-slate-300 flex items-center justify-center transition-all"
                                  aria-label={`Tăng size Nữ ${spec.size}`}
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* Chế độ 2: Form Unisex chung */}
                {sizeMode === "unisex" && (
                  <div className="bg-slate-800/40 p-3.5 sm:p-4 rounded-2xl border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-brand-500/10 text-brand-400 border border-brand-500/20 flex items-center justify-center">
                          <Users className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs font-bold text-white uppercase tracking-wider">
                          Size Unisex Chung (Sự kiện / Thể thao / Teambuilding)
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 text-xs font-black font-mono">
                        {unisexTotal} áo
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                      {SIZE_SPECS_UNISEX.map((spec) => {
                        const qty = unisexSizes[spec.size] || 0;
                        return (
                          <div
                            key={`unisex-${spec.size}`}
                            className={`p-2.5 rounded-xl border text-center transition-all ${
                              qty > 0
                                ? "bg-brand-500/10 border-brand-400/50 shadow-sm"
                                : "bg-slate-900/60 border-slate-800 opacity-85 hover:opacity-100"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-black text-sm text-white">{spec.size}</span>
                              <span className="text-[10px] text-slate-400 font-medium">
                                {spec.weight.split(" ")[0]}-{spec.weight.split(" ")[2]}kg
                              </span>
                            </div>
                            <div className="flex items-center justify-between bg-slate-900 rounded-lg p-0.5 border border-slate-700">
                              <button
                                type="button"
                                onClick={() => handleUpdateSize("unisex", spec.size, -1)}
                                disabled={qty <= 0}
                                className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-20 text-slate-300 hover:text-white flex items-center justify-center transition-all"
                                aria-label={`Giảm size Unisex ${spec.size}`}
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <input
                                type="number"
                                min="0"
                                max="5000"
                                value={qty === 0 ? "" : qty}
                                placeholder="0"
                                onChange={(e) => handleSetDirectSize("unisex", spec.size, e.target.value)}
                                className="w-8 text-center font-black font-mono text-xs text-brand-300 bg-transparent focus:outline-none"
                              />
                              <button
                                type="button"
                                onClick={() => handleUpdateSize("unisex", spec.size, 1)}
                                className="w-6 h-6 rounded bg-slate-800 hover:bg-brand-500 hover:text-slate-950 text-slate-300 flex items-center justify-center transition-all"
                                aria-label={`Tăng size Unisex ${spec.size}`}
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Chế độ 3: Nhập nhanh tổng số */}
                {sizeMode === "quick" && (
                  <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-300 font-semibold">
                        Nhập nhanh tổng số lượng áo:
                      </span>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="10"
                          max="10000"
                          value={quickQuantity}
                          onChange={(e) => setQuickQuantity(Math.max(0, Number(e.target.value)))}
                          className="w-20 px-2 py-1 rounded-lg bg-slate-900 border border-slate-700 text-center font-black font-mono text-brand-300 text-base focus:outline-none focus:border-brand-400"
                        />
                        <span className="text-xs text-slate-400">áo</span>
                      </div>
                    </div>

                    <input
                      type="range"
                      min="10"
                      max="500"
                      step="5"
                      value={quickQuantity}
                      onChange={(e) => setQuickQuantity(Number(e.target.value))}
                      className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-400"
                    />

                    <label className="flex items-start gap-2.5 pt-1 text-xs text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={sendSizeChartLater}
                        onChange={(e) => setSendSizeChartLater(e.target.checked)}
                        className="mt-0.5 rounded border-slate-700 bg-slate-900 text-brand-500 focus:ring-0 cursor-pointer"
                      />
                      <span>
                        Tôi sẽ gửi danh sách phân bổ size chi tiết qua Zalo / file Excel sau khi duyệt maket thiết kế 3D.
                      </span>
                    </label>
                  </div>
                )}

                {/* HÀNG NÚT CHIA NHANH & ĐẶT VỀ 0 */}
                <div className="flex items-center justify-between gap-2 flex-wrap pt-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] text-slate-400 font-medium mr-1">
                      Tỉ lệ chuẩn Cty:
                    </span>
                    {[30, 50, 100, 200].map((qty) => (
                      <button
                        key={qty}
                        type="button"
                        onClick={() => handleApplyPreset(qty)}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700 hover:border-brand-400/60 hover:text-white transition-all"
                      >
                        {qty} áo
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={handleResetSizes}
                    className="px-2.5 py-1 rounded-lg text-xs text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-slate-700/60 transition-all flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Đặt lại về 0</span>
                  </button>
                </div>

                {/* DỊCH VỤ THỬ SIZE TẬN VĂN PHÒNG MIỄN PHÍ */}
                <div className="p-3.5 rounded-2xl bg-amber-400/5 border border-amber-400/25">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={requestFittingKit}
                      onChange={(e) => setRequestFittingKit(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded border-amber-400/40 bg-slate-900 text-brand-500 focus:ring-0 cursor-pointer"
                    />
                    <div>
                      <span className="text-xs font-bold text-amber-300 block">
                        Đăng ký mượn bộ áo mẫu đủ size (S - 3XL) đến văn phòng thử trực tiếp (Miễn phí 100%)
                      </span>
                      <span className="text-[11px] text-slate-400 block mt-0.5">
                        Chuyên viên mang tận nơi để từng nhân viên mặc thử phom dáng và chọn size vừa vặn trước khi may hàng loạt.
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* CẢNH BÁO NẾU DƯỚI 10 ÁO */}
              {totalInteractiveQuantity < 10 && (
                <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-2.5 text-xs text-amber-300">
                  <Info className="w-4 h-4 shrink-0 text-amber-400" />
                  <span>
                    Số lượng tối thiểu của xưởng là <strong>10 áo</strong> để đảm bảo dây chuyền dệt nhuộm và thêu vi tính. Hiện có: <strong>{totalInteractiveQuantity} áo</strong>.
                  </span>
                </div>
              )}

              {/* HỘP TÍNH GIÁ VÀ QUÀ TẶNG DOANH NGHIỆP */}
              <div className="bg-gradient-to-br from-brand-950/60 to-slate-950 rounded-2xl p-4 sm:p-5 border border-brand-500/30 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-xs text-slate-400 block">
                      Đơn giá tạm tính (đã gồm thêu/in):
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl sm:text-2xl font-black text-brand-300 font-mono">
                        {pricing.unitPrice.toLocaleString("vi-VN")} đ
                      </span>
                      <span className="text-xs text-slate-400">/ chiếc</span>
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-xs text-slate-400 block">
                      Tổng ngân sách ({totalInteractiveQuantity} áo):
                    </span>
                    <span className="text-lg sm:text-xl font-black text-white font-mono">
                      {pricing.totalPrice.toLocaleString("vi-VN")} đ
                    </span>
                  </div>
                </div>

                {/* Chi tiết phân bổ tóm tắt & chiết khấu */}
                <div className="flex items-center justify-between text-xs text-slate-300 pt-0.5 flex-wrap gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400">Cơ cấu size:</span>
                    <strong className="text-brand-300 font-medium">
                      {sizeMode === "split" && `Nam: ${menTotal} áo | Nữ: ${womenTotal} áo`}
                      {sizeMode === "unisex" && `Form Unisex: ${unisexTotal} áo`}
                      {sizeMode === "quick" && `Tổng ${quickQuantity} áo (gửi size sau)`}
                    </strong>
                  </div>
                  <div className="px-2 py-0.5 rounded-lg bg-brand-500/10 text-brand-300 border border-brand-400/30 text-[11px] font-semibold">
                    {pricing.tier.label}
                  </div>
                </div>

                {/* Quà tặng & chính sách bảo vệ */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-300 pt-1">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>May mẫu thử 0đ (Đơn từ 50 áo)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Miễn phí thiết kế bản vẽ 3D</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-sky-400 shrink-0" />
                    <span>Miễn phí giao hàng toàn quốc</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <RotateCcw className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>Bảo hành 1 đổi 1 trong 30 ngày</span>
                  </div>
                </div>
              </div>

              {/* NÚT KÍCH HOẠT NHẬN BÁO GIÁ */}
              <button
                type="button"
                onClick={handleOpenSubmitModal}
                disabled={totalInteractiveQuantity < 10}
                className="w-full py-4 bg-gradient-to-r from-brand-400 via-brand-500 to-brand-600 hover:from-brand-300 hover:to-brand-500 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-black text-sm sm:text-base rounded-2xl shadow-xl shadow-brand-500/20 flex items-center justify-center gap-2.5 transition-all active:scale-[0.98]"
              >
                <Sparkles className="w-5 h-5 text-slate-950" />
                <span>Gửi Thiết Kế & Nhận Báo Giá 3D Chính Thức (0đ)</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================
          TAB 2: GỬI MẪU BẢN VẼ / FILE THIẾT KẾ CÓ SẴN
          ==================================================== */}
      {activeTab === "upload_file" && (
        <div className="max-w-4xl mx-auto bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 text-brand-300 text-xs font-bold uppercase tracking-wider border border-brand-400/30">
              <Upload className="w-3.5 h-3.5" />
              Tiếp nhận file đồ họa chuyên nghiệp
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Gửi Mẫu Bản Vẽ Hoặc File Thiết Kế Có Sẵn
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm">
              Dành cho quý doanh nghiệp, agency hoặc phòng marketing đã có sẵn file thiết kế từ Photoshop, Illustrator, Corel, PDF hoặc ảnh chụp mẫu thực tế.
            </p>
          </div>

          {/* Vùng kéo thả File Upload lớn */}
          <div className="border-2 border-dashed border-slate-700 hover:border-brand-400 rounded-3xl p-6 sm:p-10 text-center bg-slate-800/30 transition-all">
            <input
              type="file"
              id="file-design-upload"
              multiple
              accept=".ai,.psd,.pdf,.cdr,.eps,.png,.jpg,.jpeg,.zip,.rar"
              onChange={handleFileUploadList}
              className="hidden"
            />
            <label
              htmlFor="file-design-upload"
              className="cursor-pointer flex flex-col items-center justify-center space-y-3"
            >
              <div className="w-16 h-16 rounded-2xl bg-brand-500/10 text-brand-400 flex items-center justify-center shadow-inner border border-brand-500/20">
                <Upload className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <div className="text-sm sm:text-base font-bold text-white">
                  Kéo thả file vào đây hoặc <span className="text-brand-300 underline">bấm để tải lên</span>
                </div>
                <div className="text-xs text-slate-400">
                  Hỗ trợ định dạng: AI, PSD, PDF, CDR, EPS, PNG, JPG, ZIP, RAR (Tối đa 50MB/file)
                </div>
              </div>
            </label>
          </div>

          {/* Danh sách file đã chọn */}
          {uploadedFiles.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-300">
                Danh sách file đính kèm ({uploadedFiles.length}):
              </div>
              <div className="space-y-2">
                {uploadedFiles.map((f) => (
                  <div
                    key={f.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-brand-500/20 text-brand-300 flex items-center justify-center font-bold text-[10px] shrink-0">
                        {f.type}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-white truncate max-w-xs sm:max-w-md">
                          {f.name}
                        </div>
                        <div className="text-[10px] text-slate-400">{f.size}</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeUploadedFile(f.id)}
                      className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Xóa file"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Form thông số kỹ thuật đính kèm */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800">
            <div>
              <label className="text-xs text-slate-300 font-semibold block mb-1.5">
                Loại trang phục cần may:
              </label>
              <select
                value={uploadCategory}
                onChange={(e) => setUploadCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-brand-400"
              >
                <option value="polo">Áo Polo Doanh Nghiệp</option>
                <option value="shirt">Áo Sơ Mi Công Sở</option>
                <option value="suit">Vest May Đo Lãnh Đạo</option>
                <option value="golf">Đồng Phục Thể Thao & Golf</option>
                <option value="school">Đồng Phục Học Sinh & Trường Học</option>
                <option value="accessories">Phụ Kiện (Mũ nón, Cặp da, Tạp dề)</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-300 font-semibold block mb-1.5">
                Số lượng may dự kiến:
              </label>
              <input
                type="number"
                min="10"
                value={uploadQuantity}
                onChange={(e) => setUploadQuantity(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-brand-400"
                placeholder="VD: 50, 100, 500 chiếc"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 font-semibold block mb-1.5">
                Mức ngân sách mục tiêu:
              </label>
              <select
                value={uploadBudget}
                onChange={(e) => setUploadBudget(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-brand-400"
              >
                <option value="standard">Tiêu chuẩn chất lượng (Cân đối chi phí)</option>
                <option value="budget">Tiết kiệm tối ưu (Đơn hàng lớn / sự kiện)</option>
                <option value="vip">Cao cấp VIP (Chất liệu nhập khẩu cho ban lãnh đạo)</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-300 font-semibold block mb-1.5">
                Thời gian cần hàng:
              </label>
              <select
                value={uploadTimeline}
                onChange={(e) => setUploadTimeline(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-brand-400"
              >
                <option value="standard">Tiêu chuẩn: 7 - 10 ngày</option>
                <option value="urgent">Gấp cho sự kiện: 3 - 5 ngày</option>
                <option value="relaxed">Thư thả: Trên 15 ngày</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-300 font-semibold block mb-1.5">
              Ghi chú thêm về yêu cầu kỹ thuật (in, thêu, cúc dập logo, bảng size):
            </label>
            <textarea
              rows={3}
              value={uploadNotes}
              onChange={(e) => setUploadNotes(e.target.value)}
              placeholder="VD: In chuyển nhiệt ngực trái 8cm, sau lưng in lụa chữ HDC trắng 28cm. Cần gửi áo mẫu trước ngày 15..."
              className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-400"
            />
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-400/5 border border-amber-400/25">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={uploadRequestFittingKit}
                onChange={(e) => setUploadRequestFittingKit(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-amber-400/40 bg-slate-900 text-brand-500 focus:ring-0 cursor-pointer"
              />
              <div>
                <span className="text-xs font-bold text-amber-300 block">
                  Đăng ký mượn bộ áo mẫu đủ size (S - 3XL) đến văn phòng thử trực tiếp (Miễn phí 100%)
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Chuyên viên HDC sẽ mang đầy đủ mẫu vải và bộ áo mẫu thực tế đến tư vấn & đo đạc trực tiếp.
                </span>
              </div>
            </label>
          </div>

          <button
            type="button"
            onClick={handleOpenSubmitModal}
            className="w-full py-4 bg-gradient-to-r from-brand-400 via-brand-500 to-brand-600 hover:from-brand-300 hover:to-brand-500 text-slate-950 font-black text-sm sm:text-base rounded-2xl shadow-xl shadow-brand-500/20 flex items-center justify-center gap-2.5 transition-all active:scale-[0.98]"
          >
            <Sparkles className="w-5 h-5 text-slate-950" />
            <span>Tiếp Tục & Gửi Thông Tin Liên Hệ Nhận Báo Giá</span>
            <ArrowRight className="w-4 h-4 text-slate-950" />
          </button>
        </div>
      )}

      {/* ====================================================
          MODAL GỬI YÊU CẦU & THÔNG TIN LIÊN HỆ
          ==================================================== */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
          <div className="relative w-full max-w-lg bg-slate-900 rounded-3xl shadow-2xl border border-brand-500/40 overflow-hidden animate-in fade-in zoom-in-95">
            {/* Header Modal */}
            <div className="bg-[#004f5e] p-4 sm:p-5 text-white flex items-center justify-between border-b border-brand-400/30">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-brand-400/20 border border-brand-400/40 flex items-center justify-center text-brand-300 shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base">
                    Nhận Bản Vẽ 3D & Báo Giá Ưu Đãi
                  </h3>
                  <p className="text-[11px] text-brand-200">
                    Chuyên viên HDC liên hệ hỗ trợ trong 15 phút
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsSubmitModalOpen(false);
                  setSubmitSuccess(null);
                }}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body: Form hoặc Trạng thái Thành Công */}
            {submitSuccess ? (
              <div className="p-6 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div className="space-y-1">
                  <h4 className="text-xl font-black text-white">
                    Gửi Yêu Cầu Thành Công!
                  </h4>
                  <p className="text-xs text-slate-300">
                    Mã tiếp nhận của bạn:{" "}
                    <strong className="text-brand-300 font-mono">
                      #{submitSuccess.quoteId}
                    </strong>
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-left text-xs space-y-2 text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Trang phục:</span>
                    <strong className="text-white">{submitSuccess.category}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Số lượng:</span>
                    <strong className="text-white">{submitSuccess.quantity} chiếc</strong>
                  </div>
                  {submitSuccess.sizeSummary && (
                    <div className="flex flex-col gap-1 border-t border-slate-700/60 pt-2">
                      <span className="text-slate-400">Cơ cấu size đặt may:</span>
                      <span className="px-2.5 py-1.5 rounded-xl bg-slate-900/90 text-brand-300 font-mono text-[11px] border border-slate-700">
                        {submitSuccess.sizeSummary}
                      </span>
                    </div>
                  )}
                  {submitSuccess.requestFittingKit && (
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-amber-400/10 border border-amber-400/25 text-amber-300 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>Đã đăng ký mang bộ áo mẫu đủ size đến văn phòng thử trực tiếp</span>
                    </div>
                  )}
                  {submitSuccess.pricing && (
                    <div className="flex justify-between border-t border-slate-700/60 pt-2">
                      <span className="text-slate-400">Ngân sách ước tính:</span>
                      <strong className="text-brand-300 font-mono">
                        {submitSuccess.pricing.totalPrice.toLocaleString("vi-VN")} đ
                      </strong>
                    </div>
                  )}
                </div>

                <p className="text-xs text-slate-400">
                  Chuyên viên tư vấn & thiết kế HDC sẽ gọi điện xác nhận và gửi bản vẽ 3D chính thức qua Zalo trong vòng <strong>15 phút</strong>.
                </p>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <a
                    href={`tel:${BRAND_INFO.contact.hotlineRaw}`}
                    className="py-2.5 px-3 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-white hover:bg-slate-700 flex items-center justify-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5 text-brand-400" />
                    Gọi: {BRAND_INFO.contact.hotline}
                  </a>
                  <a
                    href={`https://zalo.me/${BRAND_INFO.contact.zalo}`}
                    target="_blank"
                    rel="noreferrer"
                    className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white flex items-center justify-center gap-1.5"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    Chat Zalo Ngay
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitQuote} className="p-5 sm:p-6 space-y-4">
                {submitError && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                    {submitError}
                  </div>
                )}

                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-slate-300 font-bold block mb-1">
                      Họ và tên người nhận tư vấn <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="VD: Nguyễn Văn A"
                      className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-300 font-bold block mb-1">
                      Số điện thoại nhận bản vẽ 3D / Zalo <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => {
                        setCustomerPhone(e.target.value);
                        if (phoneError) setPhoneError("");
                      }}
                      placeholder="VD: 0984959586"
                      className={`w-full px-3.5 py-2.5 bg-slate-800 border rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none ${
                        phoneError
                          ? "border-rose-500 focus:border-rose-500"
                          : "border-slate-700 focus:border-brand-400"
                      }`}
                    />
                    {phoneError && (
                      <span className="text-[11px] text-rose-400 mt-1 block">
                        {phoneError}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-slate-300 font-bold block mb-1">
                        Email nhận bảng giá (tùy chọn)
                      </label>
                      <input
                        type="email"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder="ten@congty.com"
                        className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-400"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-300 font-bold block mb-1">
                        Tên công ty / Doanh nghiệp
                      </label>
                      <input
                        type="text"
                        value={customerCompany}
                        onChange={(e) => setCustomerCompany(e.target.value)}
                        placeholder="VD: FPT Software, Techcombank"
                        className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-slate-300 font-bold block mb-1">
                      Ghi chú thêm cho thiết kế (nếu có):
                    </label>
                    <textarea
                      rows={2}
                      value={generalNotes}
                      onChange={(e) => setGeneralNotes(e.target.value)}
                      placeholder="VD: Thêu chỉ vàng ánh kim, may theo bảng size nam nữ riêng..."
                      className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-400"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 bg-gradient-to-r from-brand-400 via-brand-500 to-brand-600 hover:from-brand-300 hover:to-brand-500 disabled:opacity-50 text-slate-950 font-black text-sm rounded-xl shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2 transition-all"
                  >
                    {isSubmitting ? (
                      <span>Đang chuyển thông tin lên xưởng...</span>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-slate-950" />
                        <span>Xác Nhận & Nhận Báo Giá 3D Tức Thì</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ====================================================
          MODAL BẢNG THÔNG SỐ SIZE CHUẨN HDC FASHION
          ==================================================== */}
      {isSizeGuideOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
          <div className="relative w-full max-w-2xl bg-slate-900 rounded-3xl shadow-2xl border border-brand-500/40 overflow-hidden animate-in fade-in zoom-in-95">
            {/* Header Modal */}
            <div className="bg-[#004f5e] p-4 sm:p-5 text-white flex items-center justify-between border-b border-brand-400/30">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-brand-400/20 border border-brand-400/40 flex items-center justify-center text-brand-300 shrink-0">
                  <Ruler className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base">
                    Bảng Thông Số Size Đồng Phục Chuẩn HDC
                  </h3>
                  <p className="text-[11px] text-brand-200">
                    Áp dụng cho Áo Polo, Sơ Mi, Áo Thun & Thể Thao Doanh Nghiệp
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsSizeGuideOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-4 sm:p-6 space-y-4">
              {/* Tab giới tính */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-800 rounded-xl">
                <button
                  type="button"
                  onClick={() => setSizeGuideTab("men")}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    sizeGuideTab === "men"
                      ? "bg-sky-600 text-white shadow"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  Bảng Size Nam (Form Suông)
                </button>
                <button
                  type="button"
                  onClick={() => setSizeGuideTab("women")}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    sizeGuideTab === "women"
                      ? "bg-pink-600 text-white shadow"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  Bảng Size Nữ (Form Chiết Eo)
                </button>
              </div>

              {/* Bảng so sánh thông số */}
              <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/60">
                <table className="w-full text-xs text-left text-slate-300">
                  <thead className="text-[11px] uppercase bg-slate-800/80 text-brand-300 font-bold border-b border-slate-700">
                    <tr>
                      <th className="px-3.5 py-3">Size</th>
                      <th className="px-3.5 py-3">Cân Nặng</th>
                      <th className="px-3.5 py-3">Chiều Cao</th>
                      <th className="px-3.5 py-3">Vòng Ngực</th>
                      <th className="px-3.5 py-3">Rộng Vai</th>
                      <th className="px-3.5 py-3">Dài Áo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {(sizeGuideTab === "men" ? SIZE_SPECS_MEN : SIZE_SPECS_WOMEN).map((row) => (
                      <tr key={row.size} className="hover:bg-slate-800/40 transition-colors">
                        <td className="px-3.5 py-2.5 font-sans font-black text-white text-sm">
                          {row.size}
                        </td>
                        <td className="px-3.5 py-2.5 text-amber-300 font-semibold">{row.weight}</td>
                        <td className="px-3.5 py-2.5">{row.height}</td>
                        <td className="px-3.5 py-2.5">{row.chest}</td>
                        <td className="px-3.5 py-2.5 text-slate-400">{row.shoulder}</td>
                        <td className="px-3.5 py-2.5 text-slate-400">{row.length}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Lời khuyên từ chuyên gia HDC */}
              <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-2 text-xs text-slate-300">
                <div className="flex items-center gap-2 text-amber-400 font-bold">
                  <Sparkles className="w-4 h-4" />
                  <span>Lời Khuyên Từ Trưởng Phòng Thiết Kế & Kỹ Thuật HDC:</span>
                </div>
                <ul className="list-disc pl-5 space-y-1 text-slate-400 text-[11px]">
                  <li>
                    Nếu số đo chiều cao và cân nặng ở 2 size khác nhau, quý khách nên ưu tiên chọn theo <strong>cân nặng</strong> để vòng ngực và bụng cử động dễ chịu.
                  </li>
                  <li>
                    Nhân sự thích mặc rộng rãi hoặc môi trường làm việc vận động nhiều nên chọn <strong>tăng lên 1 size</strong>.
                  </li>
                  <li>
                    HDC hỗ trợ may đo riêng cho nhân sự có vóc dáng đặc biệt hoặc Big Size từ <strong>4XL đến 5XL</strong>.
                  </li>
                </ul>
              </div>

              <button
                type="button"
                onClick={() => setIsSizeGuideOpen(false)}
                className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-all border border-slate-700"
              >
                Đã Hiểu, Quay Lại Chọn Số Lượng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
