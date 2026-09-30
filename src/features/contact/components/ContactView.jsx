"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BRAND_INFO } from "@/shared/data";
import { useShop } from "@/shared/providers/ShopProvider";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Sparkles,
  ChevronRight,
  Send,
  CheckCircle2,
  Calendar,
  Building2,
  Factory,
  Copy,
  Check,
  ExternalLink,
  MessageCircle,
  HelpCircle,
  ChevronDown,
  ShieldCheck,
  Scissors,
  FileCheck2,
  ArrowRight,
  Truck,
  Layers,
  Award,
  AlertCircle
} from "lucide-react";

// ============================================================
// LOCATIONS DATA
// ============================================================
const CONTACT_LOCATIONS = [
  {
    id: "headquarters",
    type: "Trụ sở chính & Showroom",
    icon: Building2,
    name: "HDC FASHION — Trụ Sở Chính & Showroom",
    address: "LK-17 Dự án Dạ Hợp 6 tầng, Phường Hòa Bình, Tỉnh Hòa Bình",
    addressFull: "LK-17 Dự án Dạ Hợp 6 tầng, Phường Hòa Bình, Tỉnh Hòa Bình, Việt Nam",
    phone: "0984.959.586",
    phoneRaw: "0984959586",
    email: "dongphuchuni@gmail.com",
    hours: "Thứ 2 - Thứ 7: 08:00 - 18:00",
    note: "Văn phòng điều hành & Showroom trưng bày 12+ dòng vải mẫu thiên nhiên",
    features: ["Bãi đỗ ô tô miễn phí", "Showroom mẫu vải & áo mẫu", "Phòng thử đồ chuẩn phom", "Tiếp đoàn đông người"],
    query: "LK-17 Dự án Dạ Hợp 6 tầng, Phường Hòa Bình, Tỉnh Hòa Bình",
    lat: 21.3095,
    lng: 105.0654,
  },
  {
    id: "branch-hanoi",
    type: "Văn phòng đại diện",
    icon: MapPin,
    name: "Văn Phòng Đại Diện Hà Nội",
    address: "Số 6, Kim Đồng, P. Giáp Bát, Q. Hoàng Mai, Hà Nội",
    addressFull: "Số 6, Kim Đồng, P. Giáp Bát, Q. Hoàng Mai, Hà Nội, Việt Nam",
    phone: "0984.959.586",
    phoneRaw: "0984959586",
    email: "dongphuchuni@gmail.com",
    hours: "Thứ 2 - Thứ 7: 08:00 - 18:00",
    note: "Tiếp đón khách hàng doanh nghiệp & hỗ trợ chuyên viên mang mẫu đo đạc nội thành",
    features: ["Tiếp khách doanh nghiệp", "Có sẵn tập vải mẫu", "Hỗ trợ chuyên viên đo tận nơi", "Tư vấn thiết kế 3D"],
    query: "Số 6, Kim Đồng, Hoàng Mai, Hà Nội",
    lat: 20.9856,
    lng: 105.8427,
  },
  {
    id: "factory",
    type: "Nhà máy sản xuất",
    icon: Factory,
    name: "Nhà Máy Sản Xuất & Xưởng May HDC",
    address: "KCN Thụy Vân, TP. Việt Trì, Tỉnh Phú Thọ",
    addressFull: "KCN Thụy Vân, Phường Thụy Vân, TP. Việt Trì, Tỉnh Phú Thọ, Việt Nam",
    phone: "0984.959.586",
    phoneRaw: "0984959586",
    email: "dongphuchuni@gmail.com",
    hours: "Thứ 2 - Thứ 7: 07:30 - 17:30",
    note: "Xưởng may 2.500m², xưởng thêu vi tính Tajima, chuyền in công nghệ cao (tham quan có hẹn trước)",
    features: ["Quy mô 2.500m²", "Công suất 50.000 sp/tháng", "Thêu vi tính Tajima 20 đầu", "Kiểm định KCS nghiêm ngặt"],
    query: "KCN Thụy Vân, TP. Việt Trì, Tỉnh Phú Thọ",
    lat: 21.2816,
    lng: 105.4230,
  },
];

// ============================================================
// PRODUCT CATEGORIES FOR CONTACT FORM
// ============================================================
const PRODUCT_OPTIONS = [
  { id: "polo", label: "Áo Polo Doanh Nghiệp", desc: "Cổ dệt bo, vải Cotton Compact kháng khuẩn" },
  { id: "shirt", label: "Áo Sơ Mi & Quần Tây", desc: "Chống nhăn công sở, chuẩn form thanh lịch" },
  { id: "suit", label: "Vest Lãnh Đạo & Quản Lý", desc: "May đo bespoke đo ni từng nhân sự" },
  { id: "golf", label: "Đồng Phục Golf & Thể Thao", desc: "Sợi làm mát AeroCool, chống UV UPF 50+" },
  { id: "school", label: "Đồng Phục Trường Học", desc: "Học sinh các cấp, sinh viên, giáo viên" },
  { id: "accessories", label: "Phụ Kiện Doanh Nghiệp", desc: "Mũ nón, cặp da, cà vạt, quà tặng" },
];

const QUANTITY_PRESETS = [
  { value: 20, label: "10 - 20 áo" },
  { value: 50, label: "20 - 50 áo" },
  { value: 100, label: "50 - 100 áo" },
  { value: 300, label: "100 - 300 áo" },
  { value: 500, label: "300 - 500 áo" },
  { value: 1000, label: "Trên 500 áo" },
];

// ============================================================
// FAQ DATA FOR CONTACT
// ============================================================
const CONTACT_FAQS = [
  {
    q: "Sau khi gửi thông tin liên hệ, bao lâu tôi sẽ nhận được phản hồi và báo giá?",
    a: "Chuyên viên tư vấn của HDC Fashion sẽ liên hệ lại với quý khách qua Điện thoại hoặc Zalo chỉ trong vòng 5 - 15 phút làm việc. Bảng báo giá chi tiết kèm phối cảnh phác thảo thiết kế 3D sơ bộ sẽ được gửi hoàn tất trong vòng 2 giờ.",
  },
  {
    q: "HDC Fashion có cử nhân viên mang bảng vải mẫu và thước đo đến tận văn phòng chúng tôi không?",
    a: "Có! Đối với các doanh nghiệp, cơ quan và tổ chức, HDC hỗ trợ cử chuyên viên mang toàn bộ tập vải mẫu thật (Modal, Bamboo, Sợi Sen, Cotton Compact...) và thước dây đến tận văn phòng quý công ty để tư vấn trực tiếp và lấy số đo hoàn toàn MIỄN PHÍ.",
  },
  {
    q: "Công ty tôi có được may áo mẫu thử 0đ trước khi ký hợp đồng may hàng loạt không?",
    a: "Chắc chắn có. HDC Fashion cam kết may áo mẫu thử 0đ chuẩn chất liệu, đúng logo in thêu và chuẩn size để ban lãnh đạo cùng nhân sự duyệt form thực tế trước khi tiến hành may đồng loạt.",
  },
  {
    q: "Số lượng đặt may tối thiểu cho một đơn hàng đồng phục là bao nhiêu?",
    a: "Số lượng tối thiểu là từ 10 áo. Đối với các đơn hàng số lượng lớn từ 50 - 500+ áo, HDC áp dụng mức chiết khấu sỉ cực cao trực tiếp từ nhà máy sản xuất.",
  },
  {
    q: "HDC Fashion có xuất hóa đơn VAT và làm hợp đồng pháp nhân đầy đủ không?",
    a: "Có, 100% đơn hàng doanh nghiệp đều được ký hợp đồng kinh tế pháp nhân rõ ràng và xuất hóa đơn giá trị gia tăng (VAT) hợp lệ theo đúng quy định pháp luật.",
  },
  {
    q: "Thời gian sản xuất và giao hàng thông thường là bao lâu?",
    a: "Thời gian may mẫu từ 1 - 2 ngày. Thời gian sản xuất hàng loạt trung bình từ 5 - 7 ngày làm việc tùy theo số lượng và độ phức tạp. Trường hợp cần gấp cho sự kiện, HDC có quy trình hỏa tốc 48h - 72h.",
  },
];

export default function ContactView() {
  const { showToast, triggerConfetti } = useShop();

  // Active tab in contact form: "quote" | "onsite"
  const [formTab, setFormTab] = useState("quote");

  // Form State
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [category, setCategory] = useState("polo");
  const [quantity, setQuantity] = useState(50);
  const [appointmentLocation, setAppointmentLocation] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [urgency, setUrgency] = useState("normal");
  const [notes, setNotes] = useState("");

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Location selector state
  const [activeLocation, setActiveLocation] = useState(CONTACT_LOCATIONS[0]);
  const [copiedId, setCopiedId] = useState(null);
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  // Copy address helper
  const handleCopyAddress = (loc) => {
    navigator.clipboard.writeText(loc.addressFull);
    setCopiedId(loc.id);
    showToast("Đã sao chép địa chỉ vào bộ nhớ tạm");
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Form Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const cleanPhone = phone.replace(/[\s.\-()+]/g, "");
    if (!cleanPhone || cleanPhone.length < 10) {
      setErrorMessage("Vui lòng nhập số điện thoại hoặc Zalo hợp lệ (10-11 số).");
      showToast("Vui lòng nhập số điện thoại hợp lệ", "error");
      return;
    }

    if (!fullName.trim()) {
      setErrorMessage("Vui lòng nhập họ và tên người liên hệ.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payloadNotes = [
        formTab === "onsite" ? "[ĐẶT LỊCH ĐO TẬN NƠI & MANG MẪU VẢI]" : "[YÊU CẦU BÁO GIÁ NHANH]",
        appointmentLocation ? `Địa điểm hẹn: ${appointmentLocation}` : "",
        appointmentDate ? `Thời gian hẹn: ${appointmentDate}` : "",
        urgency !== "normal" ? `Tiến độ: ${urgency}` : "",
        notes ? `Ghi chú: ${notes}` : "",
      ]
        .filter(Boolean)
        .join(" | ");

      const response = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim(),
          phone: cleanPhone,
          email: email.trim() || undefined,
          company: company.trim() || undefined,
          category: category,
          quantity: Number(quantity) || 50,
          notes: payloadNotes,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSubmittedData({
          quoteId: result.quoteId || "HDC-" + Math.floor(100000 + Math.random() * 900000),
          fullName,
          phone: cleanPhone,
          company,
          formTab,
        });
        triggerConfetti();
        showToast("Gửi yêu cầu thành công! Chuyên viên HDC sẽ liên hệ trong 5 phút.");
      } else {
        const errorDetail = result.details?.[0]?.message || result.error || "Gửi yêu cầu thất bại. Vui lòng thử lại.";
        setErrorMessage(errorDetail);
        showToast(errorDetail, "error");
      }
    } catch (err) {
      console.error("Lỗi gửi yêu cầu liên hệ:", err);
      setErrorMessage("Không thể kết nối máy chủ. Quý khách vui lòng gọi trực tiếp hotline 0984.959.586!");
      showToast("Lỗi kết nối máy chủ", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setSubmittedData(null);
    setFullName("");
    setPhone("");
    setEmail("");
    setCompany("");
    setNotes("");
    setAppointmentLocation("");
    setAppointmentDate("");
    setErrorMessage("");
  };

  // Google Maps Embed URL
  const mapApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const mapQuery = activeLocation.query
    ? encodeURIComponent(activeLocation.query)
    : `${activeLocation.lat},${activeLocation.lng}`;
  const mapEmbedUrl = mapApiKey
    ? `https://www.google.com/maps/embed/v1/place?key=${mapApiKey}&q=${mapQuery}&zoom=16&language=vi`
    : `https://www.google.com/maps?q=${mapQuery}&z=16&hl=vi&output=embed`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${mapQuery}`;

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* ========================================================
          HERO BANNER — Thiết kế sắc sảo, không lỗi xuống dòng
          ======================================================== */}
      <section className="bg-gradient-to-br from-[#003843] via-[#004f5e] to-[#00677a] text-white py-12 sm:py-16 md:py-20 border-b border-brand-400/20 relative overflow-hidden">
        {/* Glow ambient effects */}
        <div className="absolute top-0 right-10 w-96 h-96 bg-brand-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs sm:text-sm text-brand-200/80 mb-5">
            <Link href="/" className="hover:text-white transition-colors">
              Trang Chủ
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-brand-400 shrink-0" />
            <span className="text-white font-semibold">Liên Hệ &amp; Hỗ Trợ Doanh Nghiệp</span>
          </nav>

          <div className="max-w-3xl">
            {/* Top pill badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-400/20 text-brand-300 text-xs font-bold uppercase tracking-wider mb-4 border border-brand-400/30">
              <Sparkles className="w-3.5 h-3.5 text-brand-300 shrink-0" />
              <span>Trung Tâm Hỗ Trợ Doanh Nghiệp 24/7 • Phản Hồi Trong 5 Phút</span>
            </div>

            {/* Main title without unnatural line break */}
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white leading-tight tracking-tight mb-4">
              KẾT NỐI VỚI{" "}
              <span className="text-brand-300">ĐỘI NGŨ CHUYÊN GIA HDC FASHION</span>
            </h1>

            <p className="text-slate-200 text-sm sm:text-base md:text-lg leading-relaxed mb-8">
              Hơn 50.000+ tập đoàn và doanh nghiệp đã tin chọn HDC. Chúng tôi sẵn sàng đồng hành từ khâu chọn chất liệu, phối màu nhận diện, thiết kế 3D cho đến may mẫu thử 0đ duyệt form trước khi may đồng loạt.
            </p>

            {/* Quick Action Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <a
                href={`tel:${BRAND_INFO.contact.hotlineRaw}`}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl p-3.5 border border-white/15 transition-all group block"
              >
                <Phone className="w-5 h-5 text-brand-300 mb-2 group-hover:scale-110 transition-transform" />
                <div className="text-[11px] text-slate-300 font-medium">Hotline 24/7</div>
                <div className="text-sm sm:text-base font-bold text-white truncate">{BRAND_INFO.contact.hotline}</div>
              </a>

              <a
                href={`https://zalo.me/${BRAND_INFO.contact.zalo}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl p-3.5 border border-white/15 transition-all group block"
              >
                <MessageCircle className="w-5 h-5 text-blue-300 mb-2 group-hover:scale-110 transition-transform" />
                <div className="text-[11px] text-slate-300 font-medium">Chat Zalo OA</div>
                <div className="text-sm sm:text-base font-bold text-white">Phản hồi tức thì</div>
              </a>

              <a
                href={`mailto:${BRAND_INFO.contact.email}`}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl p-3.5 border border-white/15 transition-all group block"
              >
                <Mail className="w-5 h-5 text-brand-300 mb-2 group-hover:scale-110 transition-transform" />
                <div className="text-[11px] text-slate-300 font-medium">Email Doanh Nghiệp</div>
                <div className="text-xs sm:text-sm font-bold text-white truncate">{BRAND_INFO.contact.email}</div>
              </a>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/15">
                <Clock className="w-5 h-5 text-brand-300 mb-2" />
                <div className="text-[11px] text-slate-300 font-medium">Giờ Làm Việc</div>
                <div className="text-xs sm:text-sm font-bold text-white">08:00 - 18:00 (T2-T7)</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          MAIN INTERACTION SECTION — FORM & SUPPORT INFO
          ======================================================== */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

            {/* ----------------------------------------------------
                LEFT: INTERACTIVE CONTACT FORM
                ---------------------------------------------------- */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
                {/* Form Header */}
                <div className="bg-gradient-to-r from-[#003843] to-[#004f5e] p-6 sm:p-8 text-white relative">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-400/20 text-brand-300 text-xs font-bold uppercase tracking-wider mb-2 border border-brand-400/30">
                    <Send className="w-3.5 h-3.5" />
                    Tiếp Nhận Nhanh Chóng
                  </div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white leading-tight">
                    GỬI YÊU CẦU TƯ VẤN &amp; BÁO GIÁ
                  </h2>
                  <p className="text-slate-300 text-xs sm:text-sm mt-1.5">
                    Điền thông tin bên dưới để nhận bảng báo giá chi tiết, phác thảo thiết kế 3D và may mẫu thử 0đ.
                  </p>

                  {/* Mode tabs */}
                  <div className="flex items-center gap-2 mt-5 p-1 bg-black/20 rounded-2xl border border-white/10">
                    <button
                      type="button"
                      onClick={() => setFormTab("quote")}
                      className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                        formTab === "quote"
                          ? "bg-gradient-to-r from-brand-400 to-brand-600 text-white shadow-md"
                          : "text-slate-300 hover:text-white"
                      }`}
                    >
                      <Sparkles className="w-4 h-4 shrink-0" />
                      <span>Nhận Báo Giá Sỉ &amp; Mẫu 3D</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormTab("onsite")}
                      className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                        formTab === "onsite"
                          ? "bg-gradient-to-r from-brand-400 to-brand-600 text-white shadow-md"
                          : "text-slate-300 hover:text-white"
                      }`}
                    >
                      <Scissors className="w-4 h-4 shrink-0" />
                      <span>Đo Tận Nơi &amp; Xem Bảng Vải</span>
                    </button>
                  </div>
                </div>

                {/* Form Body */}
                <div className="p-6 sm:p-8">
                  {submittedData ? (
                    /* SUCCESS STATE */
                    <div className="py-8 text-center space-y-5 animate-in fade-in zoom-in-95 duration-300">
                      <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                        <CheckCircle2 className="w-9 h-9" />
                      </div>

                      <div className="space-y-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
                          Mã yêu cầu: {submittedData.quoteId}
                        </span>
                        <h3 className="text-2xl font-black text-slate-800">
                          ĐÃ TIẾP NHẬN YÊU CẦU THÀNH CÔNG!
                        </h3>
                        <p className="text-slate-600 text-sm max-w-md mx-auto leading-relaxed">
                          Cảm ơn <strong>{submittedData.fullName}</strong> {submittedData.company ? `(${submittedData.company})` : ""}. Chuyên viên HDC Fashion sẽ liên hệ qua số điện thoại <strong>{submittedData.phone}</strong> trong vòng <strong>5 phút</strong>.
                        </p>
                      </div>

                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 max-w-md mx-auto text-left text-xs space-y-2">
                        <div className="font-bold text-[#004f5e] flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-emerald-600" />
                          <span>Quy trình xử lý tiếp theo:</span>
                        </div>
                        <p className="text-slate-600">1. Chuyên viên gọi xác nhận số lượng &amp; màu sắc nhận diện.</p>
                        <p className="text-slate-600">2. Gửi file phác thảo 3D phối logo &amp; bảng giá sỉ qua Zalo.</p>
                        <p className="text-slate-600">3. May áo mẫu thử 0đ duyệt form trước khi may đồng loạt.</p>
                      </div>

                      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                        <a
                          href={`https://zalo.me/${BRAND_INFO.contact.zalo}?text=Chào%20HDC,%20tôi%20vừa%20gửi%20yêu%20cầu%20báo%20giá%20mã%20${submittedData.quoteId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow-md transition-all"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>Mở Zalo Chat Ngay</span>
                        </a>

                        <button
                          type="button"
                          onClick={handleResetForm}
                          className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm rounded-xl transition-all"
                        >
                          Gửi Thêm Yêu Cầu Khác
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* FORM INPUTS */
                    <form onSubmit={handleSubmit} className="space-y-5">
                      {errorMessage && (
                        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs sm:text-sm flex items-start gap-2.5">
                          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                          <span>{errorMessage}</span>
                        </div>
                      )}

                      {/* Row 1: Name & Phone */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                            Họ và Tên Người Liên Hệ <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Ví dụ: Nguyễn Văn An"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/20 transition-all text-slate-800"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                            Số Điện Thoại / Zalo <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="tel"
                            required
                            placeholder="Ví dụ: 0984 959 586"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/20 transition-all text-slate-800"
                          />
                        </div>
                      </div>

                      {/* Row 2: Company & Email */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                            Tên Công Ty / Đơn Vị
                          </label>
                          <input
                            type="text"
                            placeholder="Ví dụ: Tập đoàn FPT, Ngân hàng ACB..."
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/20 transition-all text-slate-800"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                            Email Nhận Báo Giá
                          </label>
                          <input
                            type="email"
                            placeholder="doanhnghiep@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/20 transition-all text-slate-800"
                          />
                        </div>
                      </div>

                      {/* Row 3: Product Category Selection */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                          Dòng Sản Phẩm Cần Tư Vấn
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {PRODUCT_OPTIONS.map((item) => (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => setCategory(item.id)}
                              className={`p-2.5 rounded-xl border text-left transition-all ${
                                category === item.id
                                  ? "border-brand-500 bg-brand-50/70 text-[#004f5e] font-bold shadow-xs"
                                  : "border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-700"
                              }`}
                            >
                              <div className="text-xs font-bold truncate">{item.label}</div>
                              <div className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{item.desc}</div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Row 4: Quantity Selection */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                            Số Lượng Dự Kiến (Chiết khấu sỉ theo bậc)
                          </label>
                          <span className="text-xs font-extrabold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-lg border border-brand-200">
                            {quantity} áo
                          </span>
                        </div>
                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                          {QUANTITY_PRESETS.map((q) => (
                            <button
                              key={q.value}
                              type="button"
                              onClick={() => setQuantity(q.value)}
                              className={`py-2 px-1 rounded-xl text-xs font-bold text-center transition-all ${
                                quantity === q.value
                                  ? "bg-brand-500 text-white shadow-sm"
                                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                              }`}
                            >
                              {q.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Extra Onsite Fields when Tab is "onsite" */}
                      {formTab === "onsite" && (
                        <div className="p-4 bg-brand-50/80 rounded-2xl border border-brand-200 space-y-3 animate-in fade-in duration-200">
                          <div className="text-xs font-bold text-brand-800 flex items-center gap-1.5">
                            <Scissors className="w-4 h-4 text-brand-600" />
                            <span>Thông Tin Lịch Hẹn Mang Bảng Vải &amp; Đo Tận Nơi</span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                                Địa Chỉ Văn Phòng Đo Đạc
                              </label>
                              <input
                                type="text"
                                placeholder="Số nhà, tòa nhà, đường, quận/huyện..."
                                value={appointmentLocation}
                                onChange={(e) => setAppointmentLocation(e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-brand-500"
                              />
                            </div>

                            <div>
                              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                                Ngày Giờ Hẹn Dự Kiến
                              </label>
                              <input
                                type="text"
                                placeholder="Ví dụ: Sáng thứ 5 tuần này, 9h30"
                                value={appointmentDate}
                                onChange={(e) => setAppointmentDate(e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-brand-500"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Row 5: Notes */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Yêu Cầu Chi Tiết / Lời Nhắn
                        </label>
                        <textarea
                          rows={3}
                          placeholder="Mô tả ý tưởng thiết kế, màu sắc nhận diện công ty, chất liệu vải mong muốn hoặc thời gian cần nhận áo..."
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/20 transition-all text-slate-800 resize-none"
                        />
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-4 px-6 bg-gradient-to-r from-brand-400 via-brand-500 to-brand-600 hover:from-brand-300 hover:to-brand-500 text-white font-black text-sm uppercase tracking-wider rounded-2xl shadow-xl shadow-brand-500/30 flex items-center justify-center gap-2 transform hover:-translate-y-0.5 active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Đang Gửi Yêu Cầu...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            <span>
                              {formTab === "onsite"
                                ? "Đăng Ký Chuyên Viên Đến Đo & Mang Vải Mẫu 0Đ"
                                : "Nhận Báo Giá Sỉ & Phác Thảo 3D Miễn Phí"}
                            </span>
                          </>
                        )}
                      </button>

                      <div className="flex items-center justify-center gap-4 text-[11px] text-slate-500 pt-1">
                        <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Bảo mật thông tin 100%
                        </span>
                        <span>•</span>
                        <span>Phản hồi trong 5 phút</span>
                        <span>•</span>
                        <span>May mẫu thử 0đ</span>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>

            {/* ----------------------------------------------------
                RIGHT: DIRECT ASSISTANCE & WHY CONTACT HDC
                ---------------------------------------------------- */}
            <div className="lg:col-span-5 space-y-6">

              {/* Instant Call / Zalo Card */}
              <div className="bg-gradient-to-br from-[#003843] via-[#004f5e] to-[#00677a] rounded-3xl p-6 sm:p-7 text-white shadow-xl relative overflow-hidden border border-brand-400/20">
                <div className="absolute top-0 right-0 w-48 h-48 bg-brand-400/15 rounded-full blur-2xl pointer-events-none" />

                <div className="relative z-10 space-y-4">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-brand-300 text-[11px] font-bold uppercase tracking-wider border border-white/15">
                    <Sparkles className="w-3.5 h-3.5" />
                    Hỗ Trợ Trực Tuyến 24/7
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                    CẦN TƯ VẤN KHẨN CẤP HOẶC ĐẶT HÀNG GẤP?
                  </h3>

                  <p className="text-slate-200 text-xs sm:text-sm leading-relaxed">
                    Đội ngũ chuyên viên thiết kế &amp; kỹ thuật viên may mặc luôn trực tiếp lắng nghe mọi nhu cầu của doanh nghiệp bạn.
                  </p>

                  <div className="space-y-3 pt-2">
                    <a
                      href={`tel:${BRAND_INFO.contact.hotlineRaw}`}
                      className="p-3.5 bg-white rounded-2xl flex items-center justify-between text-[#004f5e] hover:bg-brand-50 transition-all shadow-md group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-brand-500 text-white flex items-center justify-center group-hover:scale-105 transition-transform">
                          <Phone className="w-5 h-5 animate-pulse" />
                        </div>
                        <div>
                          <div className="text-[10px] uppercase font-bold text-slate-500">Hotline Tư Vấn 24/7</div>
                          <div className="text-base sm:text-lg font-black text-[#004f5e]">{BRAND_INFO.contact.hotline}</div>
                        </div>
                      </div>
                      <div className="text-xs font-bold text-brand-600 flex items-center gap-1">
                        <span>Gọi ngay</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </a>

                    <a
                      href={`https://zalo.me/${BRAND_INFO.contact.zalo}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3.5 bg-blue-600 hover:bg-blue-500 rounded-2xl flex items-center justify-between text-white transition-all shadow-md group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform font-bold">
                          <MessageCircle className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-[10px] uppercase font-bold text-blue-100">Chat Zalo Chính Thức</div>
                          <div className="text-sm sm:text-base font-extrabold text-white">Zalo: {BRAND_INFO.contact.zalo}</div>
                        </div>
                      </div>
                      <div className="text-xs font-bold text-blue-100 flex items-center gap-1">
                        <span>Nhắn tin</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </a>
                  </div>
                </div>
              </div>

              {/* 4 Golden Guarantees */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-md space-y-4">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-brand-600" />
                  <h3 className="font-extrabold text-[#004f5e] text-base">
                    4 CAM KẾT VÀNG KHI LIÊN HỆ HDC
                  </h3>
                </div>

                <div className="space-y-3.5 text-xs text-slate-700">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center shrink-0 font-bold">
                      1
                    </div>
                    <div>
                      <strong className="text-slate-900 block font-bold text-sm">May mẫu thử 0đ duyệt chất liệu</strong>
                      <span>Duyệt mẫu trực tiếp trước khi sản xuất số lượng lớn, không rủi ro về kích cỡ hay form dáng.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center shrink-0 font-bold">
                      2
                    </div>
                    <div>
                      <strong className="text-slate-900 block font-bold text-sm">Thiết kế phối cảnh 3D không giới hạn</strong>
                      <span>Miễn phí 100% chi phí lên market 3D, phối màu và thêu logo theo chuẩn guideline nhận diện thương hiệu.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center shrink-0 font-bold">
                      3
                    </div>
                    <div>
                      <strong className="text-slate-900 block font-bold text-sm">Bảo hành 1 đổi 1 trong 30 ngày</strong>
                      <span>Bảo hành toàn bộ đường kim mũi chỉ, độ co giãn và độ bền màu sau 100 lần giặt.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center shrink-0 font-bold">
                      4
                    </div>
                    <div>
                      <strong className="text-slate-900 block font-bold text-sm">Xuất VAT &amp; Hợp đồng pháp nhân 100%</strong>
                      <span>Đầy đủ hóa đơn GTGT, biên bản giao nhận và hỗ trợ may bổ sung số lượng ít trọn đời khi có nhân sự mới.</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Working Hours & Bank details note */}
              <div className="bg-slate-100/80 rounded-2xl p-5 border border-slate-200 text-xs text-slate-600 space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
                  <Building2 className="w-4 h-4 text-brand-600" />
                  <span>Hồ Sơ Doanh Nghiệp HDC GROUP VN</span>
                </div>
                <p>
                  <strong>Tên đơn vị:</strong> CÔNG TY CỔ PHẦN TẬP ĐOÀN HDC GROUP VN
                </p>
                <p>
                  <strong>Tài khoản thanh toán:</strong> {BRAND_INFO.bankInfo.accountNumber} ({BRAND_INFO.bankInfo.bankName})
                </p>
                <p>
                  <strong>Chủ tài khoản:</strong> {BRAND_INFO.bankInfo.accountHolder}
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          MULTI-LOCATION DIRECTORY (TRỤ SỞ & CHI NHÁNH)
          ======================================================== */}
      <section className="py-14 sm:py-20 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-bold uppercase tracking-wider">
              <Building2 className="w-3.5 h-3.5 text-brand-600" />
              Mạng Lưới Showroom &amp; Nhà Máy
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#004f5e]">
              HỆ THỐNG TRỤ SỞ, VĂN PHÒNG &amp; XƯỞNG SẢN XUẤT
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Quý khách có thể ghé trực tiếp showroom để cảm nhận chất liệu vải thật, thử các phom áo may sẵn hoặc liên hệ để chuyên viên đến tư vấn tận nơi.
            </p>
          </div>

          {/* 3 Location Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {CONTACT_LOCATIONS.map((loc) => {
              const Icon = loc.icon;
              const isSelected = activeLocation.id === loc.id;
              const isCopied = copiedId === loc.id;

              return (
                <div
                  key={loc.id}
                  onClick={() => setActiveLocation(loc)}
                  className={`cursor-pointer rounded-3xl p-6 border-2 transition-all flex flex-col justify-between ${
                    isSelected
                      ? "border-brand-500 bg-white shadow-xl ring-2 ring-brand-500/20"
                      : "border-slate-200 bg-slate-50 hover:bg-white hover:border-brand-300 hover:shadow-md"
                  }`}
                >
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
                            isSelected
                              ? "bg-gradient-to-br from-brand-400 to-brand-600 text-white shadow-md"
                              : "bg-white text-slate-700 border border-slate-200"
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-100/70 text-brand-800">
                            {loc.type}
                          </span>
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[11px] text-emerald-700 font-bold">Đang mở cửa</span>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyAddress(loc);
                        }}
                        className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 transition-colors"
                        title="Sao chép địa chỉ"
                      >
                        {isCopied ? (
                          <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    <h3 className="font-extrabold text-[#004f5e] text-base leading-snug">
                      {loc.name}
                    </h3>

                    {/* Address details */}
                    <div className="space-y-2 text-xs text-slate-600">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                        <span className="font-medium text-slate-800">{loc.addressFull}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-brand-600 shrink-0" />
                        <a
                          href={`tel:${loc.phoneRaw}`}
                          className="font-bold text-[#004f5e] hover:underline"
                        >
                          {loc.phone}
                        </a>
                      </div>

                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-brand-600 shrink-0" />
                        <span>{loc.hours}</span>
                      </div>
                    </div>

                    {/* Features list */}
                    <div className="pt-2 border-t border-slate-200/70">
                      <div className="grid grid-cols-2 gap-1.5 text-[11px] text-slate-600">
                        {loc.features.map((feat, fIdx) => (
                          <div key={fIdx} className="flex items-center gap-1.5">
                            <span className="text-brand-500 font-bold">✓</span>
                            <span className="truncate">{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-5 mt-4 border-t border-slate-100 flex items-center gap-2">
                    <a
                      href={`tel:${loc.phoneRaw}`}
                      className="flex-1 py-2 px-3 bg-brand-50 hover:bg-brand-100 text-brand-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Gọi ngay</span>
                    </a>

                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(loc.addressFull)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2 px-3 bg-[#004f5e] hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Chỉ đường</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ====================================================
              MAP EMBED SECTION
              ==================================================== */}
          <div className="bg-slate-100 rounded-3xl overflow-hidden border-2 border-slate-200 shadow-xl">
            <div className="bg-[#004f5e] text-white p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-brand-400/20 text-brand-300 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-brand-300 font-bold uppercase tracking-wider">
                    Vị Trí Đang Xem
                  </div>
                  <div className="text-base sm:text-lg font-extrabold text-white">
                    {activeLocation.name}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => handleCopyAddress(activeLocation)}
                  className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border border-white/15"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedId === activeLocation.id ? "Đã chép!" : "Sao chép địa chỉ"}</span>
                </button>

                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-gradient-to-r from-brand-400 to-brand-600 hover:from-brand-300 hover:to-brand-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition-all shrink-0"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Mở Google Maps</span>
                </a>
              </div>
            </div>

            <div className="h-[360px] sm:h-[420px] md:h-[480px] w-full relative">
              <iframe
                key={activeLocation.id}
                src={mapEmbedUrl}
                title={`Bản đồ ${activeLocation.name}`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          FREQUENTLY ASKED QUESTIONS (FAQ)
          ======================================================== */}
      <section className="py-14 sm:py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-bold uppercase tracking-wider">
              <HelpCircle className="w-3.5 h-3.5 text-brand-600" />
              Giải Đáp Thắc Mắc
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#004f5e]">
              CÂU HỎI THƯỜNG GẶP KHI ĐẶT MAY ĐỒNG PHỤC
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm md:text-base">
              Những thông tin quan trọng giúp quý doanh nghiệp dễ dàng chuẩn bị quy trình đặt may đồng phục hiệu quả và tiết kiệm chi phí nhất.
            </p>
          </div>

          <div className="space-y-3">
            {CONTACT_FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? -1 : idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-[#004f5e] hover:text-brand-700 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-brand-500 transition-transform duration-200 shrink-0 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================
          BOTTOM CTA BAR
          ======================================================== */}
      <section className="bg-gradient-to-r from-[#003843] via-[#004f5e] to-[#003843] text-white py-12 border-t border-brand-400/20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <h2 className="text-xl sm:text-3xl font-black text-white">
            SẴN SÀNG NÂNG TẦM BẢN SẮC DOANH NGHIỆP CỦA BẠN?
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl mx-auto">
            Liên hệ ngay hôm nay để nhận ưu đãi thiết kế 3D độc quyền &amp; bộ áo mẫu thử 0đ giao tận tay văn phòng doanh nghiệp bạn.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <a
              href={`tel:${BRAND_INFO.contact.hotlineRaw}`}
              className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-brand-400 to-brand-600 hover:from-brand-300 hover:to-brand-500 text-white font-extrabold text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <Phone className="w-4 h-4 animate-pulse" />
              <span>Hotline: {BRAND_INFO.contact.hotline}</span>
            </a>

            <a
              href={`https://zalo.me/${BRAND_INFO.contact.zalo}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-7 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat Zalo Với Chuyên Viên</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
