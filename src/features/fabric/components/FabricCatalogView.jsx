"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useShop } from "@/shared/providers/ShopProvider";
import {
  Sparkles,
  Leaf,
  Search,
  LayoutGrid,
  TableProperties,
  CheckCircle2,
  MoveHorizontal,
  ShieldCheck,
  Star,
  Shirt,
  Send,
  HandHeart,
  Layers,
  Waves,
  Recycle,
  Briefcase,
  Building2,
  Trophy,
  Crown,
  ChevronRight,
  Flame,
  Droplets,
  HelpCircle,
  FileCheck,
  RefreshCw,
  Check,
  Compass,
  Eye,
  Scale,
  X,
  CheckCheck,
} from "lucide-react";

// ==================================================
// CutoutIcon — tự xóa nền TRẮNG của ảnh icon (jpg/png)
// ==================================================
function CutoutIcon({ src, className = "" }) {
  const [url, setUrl] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const img = new Image();
    img.onload = () => {
      const W = img.naturalWidth;
      const H = img.naturalHeight;
      const canvas = document.createElement("canvas");
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      ctx.drawImage(img, 0, 0);
      let frame;
      try {
        frame = ctx.getImageData(0, 0, W, H);
      } catch {
        if (!cancelled) setUrl(src);
        return;
      }
      const d = frame.data;
      const TH = 232;
      const isBg = (p) =>
        d[p * 4 + 3] < 10 || (d[p * 4] >= TH && d[p * 4 + 1] >= TH && d[p * 4 + 2] >= TH);

      const bg = new Uint8Array(W * H);
      const stack = [];
      const push = (p) => {
        if (!bg[p] && isBg(p)) {
          bg[p] = 1;
          stack.push(p);
        }
      };
      for (let x = 0; x < W; x++) {
        push(x);
        push((H - 1) * W + x);
      }
      for (let y = 0; y < H; y++) {
        push(y * W);
        push(y * W + W - 1);
      }
      while (stack.length) {
        const p = stack.pop();
        const x = p % W;
        if (x > 0) push(p - 1);
        if (x < W - 1) push(p + 1);
        if (p >= W) push(p - W);
        if (p < W * (H - 1)) push(p + W);
      }

      for (let p = 0; p < W * H; p++) {
        if (bg[p]) {
          d[p * 4 + 3] = 0;
          continue;
        }
        const x = p % W;
        const near =
          (x > 0 && bg[p - 1]) ||
          (x < W - 1 && bg[p + 1]) ||
          (p >= W && bg[p - W]) ||
          (p < W * (H - 1) && bg[p + W]);
        if (near) {
          const m = Math.min(d[p * 4], d[p * 4 + 1], d[p * 4 + 2]);
          if (m > 190) {
            d[p * 4 + 3] = Math.max(0, Math.min(255, ((TH - m) / (TH - 190)) * 255));
          }
        }
      }
      ctx.putImageData(frame, 0, 0);
      if (!cancelled) setUrl(canvas.toDataURL("image/png"));
    };
    img.onerror = () => {
      if (!cancelled) setUrl(src);
    };
    img.src = src;
    return () => {
      cancelled = true;
    };
  }, [src]);

  if (!url) return null;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={url} alt="" className={className} />;
}

// ==================================================
// DỮ LIỆU ĐẦY ĐỦ 10 DÒNG VẢI VỚI HÌNH ẢNH THỰC TẾ & THÔNG SỐ
// ==================================================
const ENRICHED_FABRICS = [
  {
    name: "Bamboo Sợi Tre Tự Nhiên",
    category: "Nhập khẩu cao cấp",
    badge: "Bán chạy nhất",
    features: "Kháng khuẩn 99.8%, mềm mướt như lụa, hạ nhiệt 3°C, chống tia UV",
    usage: "Áo sơ mi công sở cao cấp, áo thun doanh nhân",
    shrinkage: "Gần như không co rút (<0.5%)",
    durability: "★★★★★",
    breathability: "★★★★★",
    image: "/images/02_materials_03.jpg",
    gsm: "185 - 200 GSM",
    purposes: ["sơ mi", "polo", "sinh thái", "làm mát"],
    colorTheme: "from-teal-600 to-emerald-700",
    pillBg: "bg-teal-50 text-teal-700 border-teal-200",
    careInstruction: "Giặt máy chế độ nhẹ, ủi ở nhiệt độ trung bình, không dùng chất tẩy clo.",
    composition: "70% Bamboo Fiber, 26% Microfiber, 4% Spandex",
  },
  {
    name: "Cotton Compact 100%",
    category: "Nhập khẩu cao cấp",
    badge: "Chống xơ lông",
    features: "Sợi bông dài chải kỹ, không xơ lông, thấm hút mồ hôi tối đa, thoáng khí",
    usage: "Áo polo doanh nghiệp, áo đồng phục sự kiện",
    shrinkage: "Ổn định với công nghệ xử lý nhiệt",
    durability: "★★★★★",
    breathability: "★★★★★",
    image: "/images/03_fabric_tech_01.jpg",
    gsm: "220 - 240 GSM",
    purposes: ["polo", "doanh nghiệp", "làm mát"],
    colorTheme: "from-blue-600 to-indigo-700",
    pillBg: "bg-blue-50 text-blue-700 border-blue-200",
    careInstruction: "Giặt máy thoải mái, phơi trong bóng râm để giữ màu bền lâu.",
    composition: "100% Long-staple Combed Cotton",
  },
  {
    name: "Pique Mắt Chim Thể Thao",
    category: "Nhập khẩu cao cấp",
    badge: "Thể thao & Golf",
    features: "Cấu trúc dệt tổ ong 3D tạo rãnh thoát khí, co giãn 4 chiều, khô siêu tốc",
    usage: "Đồng phục Golf, Pickleball, Áo thể thao",
    shrinkage: "Không nhăn, không bai dão",
    durability: "★★★★★",
    breathability: "★★★★★",
    image: "/images/03_fabric_tech_03.jpg",
    gsm: "210 - 230 GSM",
    purposes: ["golf", "thể thao", "polo", "làm mát"],
    colorTheme: "from-amber-500 to-orange-600",
    pillBg: "bg-orange-50 text-orange-700 border-orange-200",
    careInstruction: "Khô cực nhanh trong 20 phút, không cần là ủi sau khi giặt.",
    composition: "92% Poly-dry, 8% Spandex Coolmax",
  },
  {
    name: "Kate Ý & Kate Mỹ",
    category: "Nhập khẩu cao cấp",
    badge: "Chuẩn form sơ mi",
    features: "Bề mặt phẳng mịn sang trọng, không xù lông, giữ ve áo và cổ đứng phom",
    usage: "Áo sơ mi văn phòng, đồng phục ngân hàng",
    shrinkage: "Chuẩn form sau nhiều lần giặt",
    durability: "★★★★☆",
    breathability: "★★★★☆",
    image: "/images/03_fabric_tech_05.jpg",
    gsm: "155 - 170 GSM",
    purposes: ["sơ mi", "doanh nhân", "văn phòng"],
    colorTheme: "from-sky-600 to-blue-700",
    pillBg: "bg-sky-50 text-sky-700 border-sky-200",
    careInstruction: "Dễ ủi phẳng phiu, giặt máy chế độ thường, giữ màu qua 100 lần giặt.",
    composition: "65% Modal/Cotton, 35% Silk-touch Poly",
  },
  {
    name: "Cashmere Wool Nhập Khẩu",
    category: "Nhập khẩu cao cấp",
    badge: "Vest sang trọng",
    features: "Chất len mịn ấm mùa đông, thoáng mùa hè, giữ phom ve áo đứng chuẩn quý tộc",
    usage: "Bộ Vest doanh nhân, quần âu, chân váy cao cấp",
    shrinkage: "Chống nhăn tuyệt đối",
    durability: "★★★★★",
    breathability: "★★★★☆",
    image: "/images/uniform_corporate_suits.jpg",
    gsm: "290 - 330 GSM",
    purposes: ["vest", "doanh nhân", "cao cấp"],
    colorTheme: "from-slate-800 to-zinc-900",
    pillBg: "bg-slate-100 text-slate-800 border-slate-300",
    careInstruction: "Khuyến nghị giặt khô hoặc giặt hấp để bảo vệ cấu trúc sợi len nguyên bản.",
    composition: "70% Cashmere Wool, 28% Viscose, 2% Elastane",
  },
  {
    name: "Modal Sợi Gỗ Tái Sinh",
    category: "Chất liệu xanh",
    badge: "Sinh thái tự nhiên",
    features: "Sợi cellulose từ gỗ sồi tự nhiên, siêu mềm mượt, giữ màu cực tốt sau nhiều lần giặt",
    usage: "Áo sơ mi xanh, áo thun cao cấp, đồ lót thân thiện da",
    shrinkage: "Ổn định, hạn chế co rút khi giặt đúng cách",
    durability: "★★★★☆",
    breathability: "★★★★★",
    image: "/images/02_materials_02.jpg",
    gsm: "180 - 200 GSM",
    purposes: ["sơ mi", "polo", "sinh thái", "làm mát"],
    colorTheme: "from-emerald-600 to-teal-700",
    pillBg: "bg-emerald-50 text-emerald-700 border-emerald-200",
    careInstruction: "Giặt nước lạnh hoặc ấm nhẹ, tránh vắt xoắn mạnh, không dùng chất tẩy.",
    composition: "95% Beechwood Modal, 5% Spandex",
  },
  {
    name: "Sợi Bạc Hà Kháng Khuẩn",
    category: "Chất liệu xanh",
    badge: "Mát lạnh tự nhiên",
    features: "Chiết xuất từ lá bạc hà hữu cơ, tạo cảm giác mát lạnh tức thì, khử mùi mồ hôi cả ngày",
    usage: "Áo thun mùa hè, đồng phục thể thao, áo sơ mi mát lạnh",
    shrinkage: "Giữ form tốt, không bai dão",
    durability: "★★★★☆",
    breathability: "★★★★★",
    image: "/images/02_materials_05.jpg",
    gsm: "195 - 215 GSM",
    purposes: ["polo", "thể thao", "sinh thái", "làm mát"],
    colorTheme: "from-cyan-600 to-teal-700",
    pillBg: "bg-cyan-50 text-cyan-700 border-cyan-200",
    careInstruction: "Giặt máy chế độ êm dịu, phơi nơi thoáng gió tự nhiên.",
    composition: "65% Peppermint Cellulose, 30% Cotton, 5% Spandex",
  },
  {
    name: "Sợi Sen Việt Nam",
    category: "Chất liệu xanh",
    badge: "Bản sắc Việt",
    features: "Dệt từ cuống cây sen, mềm nhẹ tựa mây trời, thoáng khí tối đa, xua tan nồm ẩm",
    usage: "Áo sơ mi cao cấp, quà tặng đối tác ngoại giao, áo dài",
    shrinkage: "Co rút tự nhiên lần đầu nhẹ, ổn định về sau",
    durability: "★★★★☆",
    breathability: "★★★★★",
    image: "/images/02_materials_07.jpg",
    gsm: "160 - 180 GSM",
    purposes: ["sơ mi", "sinh thái", "doanh nhân"],
    colorTheme: "from-rose-500 to-pink-600",
    pillBg: "bg-rose-50 text-rose-700 border-rose-200",
    careInstruction: "Nên giặt tay hoặc giặt máy với túi giặt, ủi ở nhiệt độ lụa.",
    composition: "80% Lotus Flower Stem Fiber, 20% Fine Silk",
  },
  {
    name: "Sợi Chuối Tự Nhiên",
    category: "Chất liệu xanh",
    badge: "Bền vững 100%",
    features: "Tận dụng thân chuối nông nghiệp, sợi dai chắc chịu lực, hút ẩm tự nhiên nhanh chóng",
    usage: "Áo sơ mi xanh, phụ kiện thời trang bền vững",
    shrinkage: "Ổn định sau lần giặt đầu",
    durability: "★★★★☆",
    breathability: "★★★★☆",
    image: "/images/02_materials_09.jpg",
    gsm: "210 - 235 GSM",
    purposes: ["sơ mi", "sinh thái", "bền vững"],
    colorTheme: "from-amber-600 to-yellow-700",
    pillBg: "bg-amber-50 text-amber-700 border-amber-200",
    careInstruction: "Vải có độ dai cơ học cao, chịu ma sát tốt, 100% tự phân hủy sinh học.",
    composition: "85% Banana Stem Fiber, 15% Organic Cotton",
  },
  {
    name: "Seamless Không Đường May",
    category: "Công nghệ Seamless",
    badge: "Đột phá công nghệ",
    features: "Công nghệ liền mạch ép seam nhiệt không viền chỉ tại tay áo, nẹp áo và vai. Co giãn 4 chiều, siêu nhẹ",
    usage: "Sơ mi cao cấp, áo công sở doanh nhân, vest nội địa",
    shrinkage: "Không co rút, giữ form tuyệt đối",
    durability: "★★★★★",
    breathability: "★★★★★",
    image: "/images/05_bestseller_shirts_01.jpg",
    gsm: "165 - 180 GSM",
    purposes: ["sơ mi", "doanh nhân", "cao cấp"],
    colorTheme: "from-indigo-600 to-teal-700",
    pillBg: "bg-indigo-50 text-indigo-700 border-indigo-200",
    careInstruction: "Không ủi trực tiếp lên mối ép seam ở nhiệt độ quá cao, giặt máy chế độ nhẹ.",
    composition: "Bonded Tech Micro-Poly, 4-Way Spandex Core",
  },
];

// DỮ LIỆU 5 SỢI XANH CHO SPOTLIGHT SECTION
const NATURAL_MATERIALS = [
  {
    id: "modal",
    name: "Modal Sợi Gỗ Sồi",
    shortName: "Modal Gỗ Sồi",
    tagline: "Mềm mát gấp 2 lần cotton — Sang trọng tựa lụa tơ tằm",
    origin: "Vỏ cây sồi tự nhiên Bắc Âu (chứng nhận rừng bền vững FSC)",
    badge: "Mềm mát gấp 2 lần cotton",
    cert: "FSC Certified • OEKO-TEX Standard 100",
    image: "/images/02_materials_02.jpg",
    iconImage: "/images/modal_tree_icon.png",
    iconPos: { x: 95, y: 80, size: 40 },
    theme: {
      accent: "text-emerald-700",
      bgLight: "bg-emerald-50/70",
      border: "border-emerald-200",
      borderActive: "border-emerald-500",
      badgeBg: "bg-emerald-100 text-emerald-800",
      glow: "from-emerald-500/10 via-teal-500/5 to-transparent",
      pillActive: "bg-emerald-700 text-white shadow-emerald-700/20",
      ringColor: "ring-emerald-300",
    },
    tactileFeel: "Bề mặt phẳng mịn, rũ tự nhiên, trơn mát tức thì khi tiếp xúc với da.",
    metrics: [
      { label: "Độ mềm mượt", score: "98/100", bar: 98 },
      { label: "Độ thoáng khí", score: "95/100", bar: 95 },
      { label: "Độ bền màu sau giặt", score: "99/100", bar: 99 },
    ],
    highlights: [
      "Chiết xuất 100% từ cellulose vỏ cây sồi tự nhiên",
      "Khả năng co giãn và phục hồi form áo vượt trội",
      "Không bao giờ đổ lông hay bai dão sợi sau 100 lần giặt",
    ],
    recommendedFor: "Sơ mi công sở cao cấp, Polo lụa doanh nhân, Váy đầm nữ",
  },
  {
    id: "bamboo",
    name: "Bamboo Sợi Tre Tự Nhiên",
    shortName: "Bamboo Sợi Tre",
    tagline: "Kháng khuẩn tự nhiên 99.8% — Hạ nhiệt thân nhiệt 3°C",
    origin: "Tre tự nhiên sinh thái, tự tái sinh không phân bón hóa học",
    badge: "Kháng khuẩn tự nhiên 99.8%",
    cert: "Eco-Harvest • Tự nhiên 100%",
    image: "/images/02_materials_03.jpg",
    iconImage: "/images/02_materials_04.jpg",
    iconPos: { x: 84, y: 78, size: 32 },
    theme: {
      accent: "text-teal-700",
      bgLight: "bg-teal-50/70",
      border: "border-teal-200",
      borderActive: "border-teal-500",
      badgeBg: "bg-teal-100 text-teal-800",
      glow: "from-teal-500/10 via-emerald-500/5 to-transparent",
      pillActive: "bg-teal-700 text-white shadow-teal-700/20",
      ringColor: "ring-teal-300",
    },
    tactileFeel: "Mát mịn, cấu trúc xốp nhẹ, khử mùi hôi cơ thể tự nhiên suốt 24 tiếng.",
    metrics: [
      { label: "Kháng khuẩn tự nhiên", score: "99.8%", bar: 99 },
      { label: "Chống tia cực tím UV", score: "UPF 50+", bar: 96 },
      { label: "Khả năng hạ nhiệt", score: "-3°C", bar: 94 },
    ],
    highlights: [
      "Chứa hoạt chất Bamboo Kun tự nhiên ngăn ngừa vi khuẩn sinh mùi",
      "Bảo vệ da dưới ánh nắng mặt trời gắt gao",
      "Hút ẩm nhanh gấp 3 lần cotton thông thường",
    ],
    recommendedFor: "Sơ mi văn phòng ngân hàng, Đồng phục Polo cao cấp, Thể thao Golf",
  },
  {
    id: "mint",
    name: "Sợi Bạc Hà Cool-Touch",
    shortName: "Sợi Bạc Hà",
    tagline: "Mát lạnh sảng khoái 24/7 — Tinh chất bạc hà tự nhiên",
    origin: "Chiết xuất tinh dầu bạc hà hữu cơ kết hợp cellulose dệt may",
    badge: "Hạ nhiệt sảng khoái 2-3°C",
    cert: "Cool-Tech Hybrid • Không hóa chất nhân tạo",
    image: "/images/02_materials_05.jpg",
    iconImage: "/images/02_materials_06.jpg",
    iconPos: { x: 78, y: 104, size: 106 },
    theme: {
      accent: "text-cyan-700",
      bgLight: "bg-cyan-50/70",
      border: "border-cyan-200",
      borderActive: "border-cyan-500",
      badgeBg: "bg-cyan-100 text-cyan-800",
      glow: "from-cyan-500/10 via-blue-500/5 to-transparent",
      pillActive: "bg-cyan-700 text-white shadow-cyan-700/20",
      ringColor: "ring-cyan-300",
    },
    tactileFeel: "Chạm là mát lạnh ngay lập tức, sợi dẫn nhiệt siêu vi xua tan cảm giác bức bối.",
    metrics: [
      { label: "Chỉ số cảm ứng nhiệt Q-max", score: "0.29 W/cm²", bar: 97 },
      { label: "Tốc độ khô thoáng", score: "Nhanh x2.5", bar: 95 },
      { label: "Khử mùi hôi", score: "96/100", bar: 96 },
    ],
    highlights: [
      "Kích hoạt cảm giác mát lạnh tức thì khi cơ thể tỏa nhiệt",
      "Rãnh thoát khí nano dẫn độ ẩm ra ngoài nhanh chóng",
      "Thích hợp tuyệt đối cho môi trường nhiệt đới nóng ẩm",
    ],
    recommendedFor: "Đồng phục sự kiện mùa hè, Polo thể thao ngoài trời, Áo thun kỹ thuật",
  },
  {
    id: "lotus",
    name: "Sợi Sen Tự Nhiên Việt Nam",
    shortName: "Sợi Sen Sinh Thái",
    tagline: "Tinh hoa bản sắc Việt — Nhẹ tựa mây trời, êm ái thuần khiết",
    origin: "Tận dụng cuống cây sen thiên nhiên tại các đầm sen Việt Nam",
    badge: "Bản sắc Việt & Siêu nhẹ",
    cert: "Di Sản Sinh Thái • 100% Tự Nhiên",
    image: "/images/02_materials_07.jpg",
    iconImage: "/images/02_materials_08.jpg",
    iconPos: { x: 82, y: 102, size: 73 },
    theme: {
      accent: "text-rose-700",
      bgLight: "bg-rose-50/70",
      border: "border-rose-200",
      borderActive: "border-rose-500",
      badgeBg: "bg-rose-100 text-rose-800",
      glow: "from-rose-500/10 via-pink-500/5 to-transparent",
      pillActive: "bg-rose-700 text-white shadow-rose-700/20",
      ringColor: "ring-rose-300",
    },
    tactileFeel: "Cấu trúc xốp êm ái, nhẹ tênh như không mặc gì, thơm mát hương sen mộc mạc.",
    metrics: [
      { label: "Độ nhẹ & Thoáng", score: "99/100", bar: 99 },
      { label: "Khả năng hút ẩm", score: "96/100", bar: 96 },
      { label: "Tính bền vững", score: "100%", bar: 100 },
    ],
    highlights: [
      "Dệt từ sợi cuống sen sau thu hoạch, không lãng phí phụ phẩm nông nghiệp",
      "Tự nhiên kháng khuẩn và chống nấm mốc trong môi trường nồm ẩm",
      "Thể hiện tinh thần tự hào thương hiệu Việt Nam",
    ],
    recommendedFor: "Sơ mi doanh nhân cấp cao, Áo quà tặng đối tác ngoại giao, Áo dài đồng phục",
  },
  {
    id: "banana",
    name: "Sợi Chuối Sinh Thái 100%",
    shortName: "Sợi Chuối Tự Nhiên",
    tagline: "Sợi sinh thái bền chắc — Giải pháp xanh tuần hoàn 100%",
    origin: "Thân cây chuối nông nghiệp sau thu hoạch trái, dệt thủ công công nghiệp",
    badge: "Phân hủy sinh học tự nhiên",
    cert: "Zero-Waste Fabric • Phân hủy 100%",
    image: "/images/02_materials_09.jpg",
    iconImage: "/images/banana_leaf_icon.png",
    iconPos: { x: 82, y: 78, size: 49, flip: true },
    theme: {
      accent: "text-amber-700",
      bgLight: "bg-amber-50/70",
      border: "border-amber-200",
      borderActive: "border-amber-500",
      badgeBg: "bg-amber-100 text-amber-800",
      glow: "from-amber-500/10 via-yellow-500/5 to-transparent",
      pillActive: "bg-amber-700 text-white shadow-amber-700/20",
      ringColor: "ring-amber-300",
    },
    tactileFeel: "Thớ sợi đanh chắc, phong cách mộc mạc tự nhiên, siêu bền dai và thoáng mát.",
    metrics: [
      { label: "Độ bền cơ học", score: "98/100", bar: 98 },
      { label: "Thân thiện môi trường", score: "100%", bar: 100 },
      { label: "Hút ẩm & Giữ dáng", score: "93/100", bar: 93 },
    ],
    highlights: [
      "Tận dụng 100% phụ phẩm cây chuối không tốn tài nguyên đất mới",
      "Sợi tự nhiên có độ dai chắc chịu lực lớn, chịu ma sát tốt",
      "Tự phân hủy sinh học hoàn toàn ra môi trường tự nhiên",
    ],
    recommendedFor: "Áo sơ mi eco cao cấp, Phụ kiện túi vải canvas, Đồng phục bền vững",
  },
];

// 5 ĐẶC TÍNH CỐT LÕI
const GREEN_FEATURES = [
  { icon: HandHeart, title: "Siêu Mềm Mượt", desc: "Mịn màng, không gây cọ xát hay kích ứng da" },
  { icon: Layers, title: "Bền Đẹp Giữ Màu", desc: "Sợi dai chắc, chống bai dão qua 100+ lần giặt" },
  { icon: Waves, title: "Kháng Khuẩn Thoáng Khí", desc: "Cấu trúc vi mô khử mùi hôi cơ thể suốt 24h" },
  { icon: Shirt, title: "Chống Nhăn Tự Nhiên", desc: "Hạn chế tối đa việc là ủi, luôn phẳng phiu" },
  { icon: Recycle, title: "Thân Thiện Môi Trường", desc: "100% Nguồn gốc sinh học, phân hủy tự nhiên" },
];

// TABS NHÓM VẢI
const CATEGORIES = [
  { id: "all", label: "Tất cả chất liệu" },
  { id: "Nhập khẩu cao cấp", label: "Vải nhập khẩu" },
  { id: "Chất liệu xanh", label: "Chất liệu xanh" },
  { id: "Công nghệ Seamless", label: "Seamless không may" },
];

// CHIPS LỌC THEO NHU CẦU THỰC TẾ
const PURPOSE_FILTERS = [
  { id: "all", label: "Tất cả nhu cầu" },
  { id: "sơ mi", label: "👔 Sơ Mi Công Sở" },
  { id: "polo", label: "👕 Polo Doanh Nghiệp" },
  { id: "golf", label: "⛳ Golf & Thể Thao" },
  { id: "vest", label: "👑 Vest & Doanh Nhân" },
  { id: "sinh thái", label: "🌱 Vải Xanh Sinh Thái" },
  { id: "làm mát", label: "❄️ Mát Lạnh Mùa Hè" },
];

// GỢI Ý CHỌN VẢI THEO NGÀNH NGHỀ
const INDUSTRY_SUGGESTIONS = [
  {
    icon: Building2,
    industry: "Khối Văn Phòng, Tài Chính & Ngân Hàng",
    fabrics: ["Bamboo Sợi Tre", "Kate Ý & Kate Mỹ", "Modal Gỗ Sồi"],
    badge: "Lịch thiệp & Đứng Form",
    color: "from-blue-600 to-indigo-700",
    reason:
      "Bề mặt vải phẳng mịn sang trọng, không xù lông, cổ áo và ve áo luôn đứng chuẩn form suốt ngày dài làm việc máy lạnh.",
  },
  {
    icon: Briefcase,
    industry: "Doanh Nghiệp Trẻ, Sự Kiện & Polo Công Sở",
    fabrics: ["Cotton Compact 100%", "Pique Mắt Chim", "CVC 65/35"],
    badge: "Năng động & Thoáng mát",
    color: "from-teal-600 to-emerald-700",
    reason:
      "Sợi chải kỹ không xơ lông, thấm hút mồ hôi tối đa, co giãn 4 chiều êm ái giúp nhân sự luôn tự tin và tràn đầy năng lượng.",
  },
  {
    icon: Trophy,
    industry: "Sự Kiện Thể Thao, Golf, Pickleball & Ngoài Trời",
    fabrics: ["Pique Mắt Chim 3D", "Dry-fit Thể Thao", "Sợi Bạc Hà"],
    badge: "Thoát nhiệt & Kháng tia UV",
    color: "from-amber-500 to-orange-600",
    reason:
      "Cấu trúc dệt tổ ong 3D tạo rãnh thoát khí tức thì, khô nhanh gấp 3 lần, làm mát da và chống tia cực tím hiệu quả ngoài trời.",
  },
  {
    icon: Crown,
    industry: "Ban Lãnh Đạo, Quản Lý Cấp Cao & Khách Hàng VIP",
    fabrics: ["Sơ Mi Seamless Không May", "Cashmere Wool Nhập Khẩu"],
    badge: "Đẳng cấp độc bản",
    color: "from-slate-800 to-zinc-900",
    reason:
      "Ứng dụng công nghệ ép dán nhiệt liền mạch không đường viền chỉ, tôn vinh vị thế dẫn đầu và phong thái chuyên nghiệp đỉnh cao.",
  },
];

// TIÊU CHUẨN KIỂM ĐỊNH & CAM KẾT VÀNG HDC
const QUALITY_STANDARDS = [
  {
    icon: FileCheck,
    title: "100% Vải Nhập Chính Ngạch",
    desc: "Đầy đủ chứng nhận kiểm định an toàn dệt may Quốc tế, không tồn dư hóa chất Formaldehyde gây hại da.",
  },
  {
    icon: Flame,
    title: "Bền Màu Cấp Độ 4-5",
    desc: "Công nghệ nhuộm Reactive hoạt tính cao cấp, chịu được hơn 100 chu kỳ giặt máy mà không phai hay loang màu.",
  },
  {
    icon: RefreshCw,
    title: "Bảo Hành 1 Đổi 1 Trong 30 Ngày",
    desc: "Cam kết đổi mới miễn phí 100% nếu vải bị co rút vượt chuẩn (>1%) hoặc xơ lông, bai dão trong quá trình sử dụng.",
  },
  {
    icon: Send,
    title: "Gửi Mẫu Vải 0đ Tận Văn Phòng",
    desc: "Chuyên viên HDC mang catalog vải thực tế đến tận nơi hoặc chuyển phát hỏa tốc hoàn toàn miễn phí trong 24h.",
  },
];

export default function FabricCatalogView() {
  const { setIsQuickQuoteOpen } = useShop();

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPurpose, setSelectedPurpose] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("auto"); // "auto", "card", "table"

  // Spotlight active material in Section 2
  const [activeMaterialId, setActiveMaterialId] = useState("modal");
  const activeMaterial =
    NATURAL_MATERIALS.find((m) => m.id === activeMaterialId) || NATURAL_MATERIALS[0];

  // Compare Dock state (max 3 fabrics)
  const [compareList, setCompareList] = useState([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  // Quick View Modal
  const [quickViewFabric, setQuickViewFabric] = useState(null);

  // Toggle compare fabric
  const toggleCompare = (fabric) => {
    if (compareList.some((f) => f.name === fabric.name)) {
      setCompareList(compareList.filter((f) => f.name !== fabric.name));
    } else {
      if (compareList.length >= 3) {
        alert("Bạn có thể đối soát tối đa 3 loại vải cùng lúc.");
        return;
      }
      setCompareList([...compareList, fabric]);
    }
  };

  // Filter fabrics based on category, purpose, and search
  const filteredFabrics = useMemo(() => {
    return ENRICHED_FABRICS.filter((fabric) => {
      // Category filter
      const matchesCategory =
        selectedCategory === "all" || fabric.category === selectedCategory;

      // Purpose filter
      const matchesPurpose =
        selectedPurpose === "all" ||
        fabric.purposes.includes(selectedPurpose) ||
        fabric.usage.toLowerCase().includes(selectedPurpose);

      // Search filter
      const query = searchQuery.trim().toLowerCase();
      if (!query) return matchesCategory && matchesPurpose;

      const matchesSearch =
        fabric.name.toLowerCase().includes(query) ||
        fabric.features.toLowerCase().includes(query) ||
        fabric.usage.toLowerCase().includes(query) ||
        (fabric.badge && fabric.badge.toLowerCase().includes(query)) ||
        (fabric.category && fabric.category.toLowerCase().includes(query)) ||
        (fabric.composition && fabric.composition.toLowerCase().includes(query));

      return matchesCategory && matchesPurpose && matchesSearch;
    });
  }, [selectedCategory, selectedPurpose, searchQuery]);

  return (
    <div className="bg-[#f6f8ff] text-slate-800">
      {/* =========================================================
          SECTION 1: HERO BANNER (Đồng bộ, Tinh tế, Sang trọng)
          ========================================================= */}
      <section className="bg-gradient-to-br from-[#003843] via-[#004f5e] to-[#00677a] text-white py-12 sm:py-16 md:py-20 border-b border-brand-400/20 relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-400/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <nav className="flex items-center gap-2 text-xs sm:text-sm text-brand-200/80 mb-5">
            <Link href="/" className="hover:text-white transition-colors">
              Trang Chủ
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-brand-400" />
            <span className="text-white font-semibold">Bảng Vải Đồng Phục</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-400/20 text-brand-300 text-xs font-bold uppercase tracking-wider mb-4 border border-brand-400/30 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-brand-300" />
                Tiêu chuẩn nguyên vật liệu dệt may 2026
              </div>

              <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white leading-tight tracking-tight mb-4">
                BẢNG TRA CỨU &amp; SO SÁNH <br />
                <span className="text-brand-300">CHẤT LIỆU VẢI MAY ĐỒNG PHỤC</span>
              </h1>

              <p className="text-slate-200 text-sm sm:text-base md:text-lg leading-relaxed mb-6">
                HDC Uniform tuyển chọn hơn 10+ dòng vải chuyên dụng cao cấp từ tự nhiên và công nghệ mới.
                100% dòng vải đều qua kiểm định an toàn, kháng khuẩn, chống xù lông và giữ phom dáng
                bền đẹp suốt hàng năm sử dụng.
              </p>

              {/* 4 Trụ cột chất lượng */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1 mb-6">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15">
                  <Droplets className="w-4 h-4 text-brand-300 mb-1" />
                  <div className="text-xs sm:text-sm font-bold text-white">Thấm Hút Cực Nhanh</div>
                  <div className="text-[10px] text-slate-300">Dry-fit &amp; Compact</div>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15">
                  <Layers className="w-4 h-4 text-brand-300 mb-1" />
                  <div className="text-xs sm:text-sm font-bold text-white">Co Giãn 4 Chiều</div>
                  <div className="text-[10px] text-slate-300">Đàn hồi êm ái 24/7</div>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15">
                  <ShieldCheck className="w-4 h-4 text-brand-300 mb-1" />
                  <div className="text-xs sm:text-sm font-bold text-white">Kháng Khuẩn Ion Bạc</div>
                  <div className="text-[10px] text-slate-300">Khử mùi hôi &amp; nấm mốc</div>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15">
                  <Flame className="w-4 h-4 text-brand-300 mb-1" />
                  <div className="text-xs sm:text-sm font-bold text-white">Bền Màu 100+ Lần</div>
                  <div className="text-[10px] text-slate-300">Nhuộm Reactive Châu Âu</div>
                </div>
              </div>

              {/* Fast Anchor Navigation */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="text-brand-200/90 font-medium mr-1 hidden sm:inline">Xem nhanh:</span>
                <a
                  href="#chat-lieu-xanh"
                  className="px-3 py-1.5 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 font-semibold transition-all border border-emerald-400/30 flex items-center gap-1.5"
                >
                  <Leaf className="w-3.5 h-3.5 text-emerald-300" />
                  <span>5 Sợi xanh tự nhiên</span>
                </a>
                <a
                  href="#so-sanh-vai"
                  className="px-3 py-1.5 rounded-full bg-white/15 hover:bg-white/25 text-white font-semibold transition-all border border-white/20"
                >
                  📊 Bảng so sánh vải
                </a>
                <a
                  href="#seamless-tech-section"
                  className="px-3 py-1.5 rounded-full bg-white/15 hover:bg-white/25 text-white font-semibold transition-all border border-white/20"
                >
                  ⚡ Sơ mi Seamless
                </a>
                <a
                  href="#goi-y-nganh-nghe"
                  className="px-3 py-1.5 rounded-full bg-white/15 hover:bg-white/25 text-white font-semibold transition-all border border-white/20"
                >
                  👔 Gợi ý theo ngành
                </a>
              </div>
            </div>

            {/* Specimen Preview Card */}
            <div className="lg:col-span-5 hidden lg:block">
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl relative">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/15">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                      Catalog Mẫu Vải 2026
                    </span>
                  </div>
                  <span className="text-[11px] text-brand-200 bg-white/10 px-2 py-0.5 rounded-full">
                    10+ Dòng Vải Tuyển Chọn
                  </span>
                </div>

                <div className="grid grid-cols-5 gap-2 mb-4">
                  {NATURAL_MATERIALS.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => {
                        setActiveMaterialId(m.id);
                        document.getElementById("chat-lieu-xanh")?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="group flex flex-col items-center text-center p-2 rounded-xl hover:bg-white/10 transition-all cursor-pointer"
                    >
                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/30 group-hover:border-emerald-400 group-hover:scale-105 transition-all shadow-sm mb-1 bg-white">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={m.image}
                          alt={m.name}
                          className="w-full h-full object-cover"
                          style={{ transform: "scale(1.6)", transformOrigin: "center top" }}
                        />
                      </div>
                      <span className="text-[10px] text-white/90 group-hover:text-emerald-300 font-semibold truncate w-full">
                        {m.shortName}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="bg-white/10 rounded-2xl p-4 border border-white/15 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Đăng ký xem mẫu thực tế:</span>
                    <span className="text-emerald-300 font-bold">Hoàn toàn 0đ</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Chuyên viên HDC chuyển phát tập vải mẫu có kèm swatch test co giãn đến văn phòng bạn trong 24h.
                  </p>
                  <button
                    onClick={() => setIsQuickQuoteOpen(true)}
                    className="w-full py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold rounded-xl shadow-md transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Đăng Ký Nhận Ngay</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          SECTION 2: BỘ SƯU TẬP 5 CHẤT LIỆU XANH TỰ NHIÊN (ASIMMETRIC STUDIO)
          ========================================================= */}
      <section
        id="chat-lieu-xanh"
        className="py-14 sm:py-20 bg-gradient-to-b from-white via-emerald-50/25 to-slate-50 border-b border-slate-200 scroll-mt-14 overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Cột trái: Văn bản & Bộ chọn 5 sợi */}
            <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold uppercase tracking-wider mb-3 border border-emerald-300/50">
                  <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                  Xu Hướng Bền Vững Eco-Fashion 2026
                </div>

                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#004f5e] tracking-tight leading-tight mb-3">
                  5 CHẤT LIỆU XANH <br />
                  <span className="text-emerald-600">TỰ NHIÊN ĐỘT PHÁ</span>
                </h2>

                <p className="text-slate-600 text-xs sm:text-sm md:text-base leading-relaxed">
                  HDC tiên phong đưa các dòng sợi dệt tái sinh từ thực vật thiên nhiên vào đồng phục doanh nghiệp.
                  Không chỉ bảo vệ môi trường, mỗi thớ vải còn mang đến cảm giác mát lạnh như lụa,
                  khử mùi tự nhiên 24/7 và độ bền vượt trội qua năm tháng.
                </p>
              </div>

              {/* Bộ điều hướng chọn 5 chất liệu */}
              <div className="space-y-2 pt-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Chọn chất liệu để xem chi tiết &amp; thông số:
                </span>

                <div className="space-y-2">
                  {NATURAL_MATERIALS.map((mat) => {
                    const isSelected = mat.id === activeMaterialId;
                    return (
                      <button
                        key={mat.id}
                        onClick={() => setActiveMaterialId(mat.id)}
                        className={`w-full p-3 rounded-2xl border transition-all text-left flex items-center justify-between gap-3 group cursor-pointer ${
                          isSelected
                            ? `${mat.theme.borderActive} ${mat.theme.bgLight} shadow-md`
                            : "border-slate-200/90 bg-white hover:border-slate-300 hover:bg-slate-50/80"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`w-10 h-10 rounded-full overflow-hidden shrink-0 border-2 transition-all ${
                              isSelected ? `${mat.theme.ringColor} ring-2 scale-105` : "border-slate-200"
                            }`}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={mat.image}
                              alt={mat.name}
                              className="w-full h-full object-cover"
                              style={{ transform: "scale(1.6)", transformOrigin: "center top" }}
                            />
                          </div>

                          <div className="min-w-0">
                            <h4
                              className={`text-sm font-extrabold truncate ${
                                isSelected ? mat.theme.accent : "text-slate-800 group-hover:text-slate-900"
                              }`}
                            >
                              {mat.name}
                            </h4>
                            <p className="text-[11px] text-slate-500 truncate">{mat.badge}</p>
                          </div>
                        </div>

                        <div className="shrink-0 flex items-center gap-1.5">
                          <span
                            className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                              isSelected
                                ? "bg-emerald-600 text-white"
                                : "text-slate-400 group-hover:text-slate-600 bg-slate-100"
                            }`}
                          >
                            <ChevronRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/80 flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={() => setIsQuickQuoteOpen(true)}
                  className="w-full sm:w-auto px-5 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Nhận Trọn Bộ Mẫu Vải Xanh (0đ)</span>
                </button>

                <a
                  href="#so-sanh-vai"
                  className="w-full sm:w-auto px-4 py-3 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs sm:text-sm rounded-xl border border-slate-200 transition-all text-center"
                >
                  So sánh với vải khác
                </a>
              </div>
            </div>

            {/* Cột phải: Studio Trình Diễn Đột Phá */}
            <div className="lg:col-span-7 space-y-6">
              <div
                className={`bg-white rounded-3xl border-2 ${activeMaterial.theme.borderActive} p-6 sm:p-8 shadow-xl relative overflow-hidden transition-all duration-500`}
              >
                <div
                  className={`absolute -top-20 -right-20 w-80 h-80 rounded-full blur-3xl pointer-events-none bg-gradient-to-br ${activeMaterial.theme.glow}`}
                />

                <div className="flex flex-wrap items-center justify-between gap-3 mb-6 relative z-10">
                  <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${activeMaterial.theme.badgeBg}`}>
                    {activeMaterial.badge}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    {activeMaterial.cert}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center mb-6 relative z-10">
                  <div className="sm:col-span-5 flex justify-center">
                    <div className="relative w-40 h-40 sm:w-44 sm:h-44">
                      <div className="w-full h-full rounded-full overflow-hidden bg-white ring-4 ring-slate-100 shadow-xl relative group">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={activeMaterial.image}
                          alt={activeMaterial.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-125"
                          style={{ transform: "scale(1.65)", transformOrigin: "center top" }}
                        />
                      </div>

                      <div
                        className="absolute z-20 pointer-events-none drop-shadow-xl"
                        style={{
                          left: `${activeMaterial.iconPos.x}%`,
                          top: `${activeMaterial.iconPos.y}%`,
                          width: `${activeMaterial.iconPos.size}%`,
                          aspectRatio: "1 / 1",
                          transform: `translate(-50%, -50%)${activeMaterial.iconPos.flip ? " scaleX(-1)" : ""}`,
                        }}
                      >
                        <CutoutIcon src={activeMaterial.iconImage} className="w-full h-full object-contain" />
                      </div>

                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-white/95 border border-slate-200 text-[10px] font-bold text-slate-700 shadow-xs flex items-center gap-1 whitespace-nowrap">
                        <Sparkles className="w-3 h-3 text-emerald-500" />
                        <span>Mẫu vải thực tế</span>
                      </div>
                    </div>
                  </div>

                  <div className="sm:col-span-7 space-y-3">
                    <div>
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                        Dòng sợi tự nhiên
                      </span>
                      <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                        {activeMaterial.name}
                      </h3>
                      <p className="text-xs sm:text-sm font-semibold text-emerald-700 mt-0.5">
                        {activeMaterial.tagline}
                      </p>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <strong>Cảm giác xúc giác khi chạm:</strong> {activeMaterial.tactileFeel}
                    </p>

                    <div className="text-[11px] text-slate-500 flex items-start gap-1.5">
                      <span className="font-bold text-slate-700 shrink-0">Nguồn gốc:</span>
                      <span>{activeMaterial.origin}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 p-4 rounded-2xl bg-[#f6f8ff] border border-slate-200/80 relative z-10">
                  {activeMaterial.metrics.map((m, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-600 font-medium">{m.label}:</span>
                        <span className="font-black text-emerald-700">{m.score}</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-700"
                          style={{ width: `${m.bar}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 mb-6 relative z-10">
                  <span className="text-xs font-bold text-slate-800 block">Ưu điểm nổi trội:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {activeMaterial.highlights.map((h, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2 bg-white p-2.5 rounded-xl border border-slate-100 text-xs text-slate-700"
                      >
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="leading-snug text-[11px]">{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 relative z-10">
                  <div className="text-xs text-slate-600 w-full sm:w-auto">
                    <span className="font-bold text-slate-800">Phù hợp hoàn hảo cho: </span>
                    <span className="text-slate-700 font-medium">{activeMaterial.recommendedFor}</span>
                  </div>

                  <button
                    onClick={() => setIsQuickQuoteOpen(true)}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Yêu Cầu Mẫu Vải {activeMaterial.shortName}</span>
                  </button>
                </div>
              </div>

              {/* 5 Tiêu chuẩn vàng */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>5 Tiêu Chuẩn Vàng Của Dòng Vải Xanh HDC</span>
                  </h4>
                  <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                    Đã kiểm định dệt may
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 justify-items-center">
                  {GREEN_FEATURES.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <div key={idx} className="flex flex-col items-center text-center p-2 rounded-xl">
                        <div className="w-10 h-10 flex items-center justify-center text-emerald-600 bg-emerald-50 rounded-xl mb-2">
                          <Icon className="w-5 h-5" strokeWidth={1.75} />
                        </div>
                        <h5 className="font-bold text-slate-800 text-[11px] leading-tight mb-0.5">
                          {item.title}
                        </h5>
                        <p className="text-[10px] text-slate-400 leading-tight hidden sm:block">
                          {item.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          SECTION 3: BẢNG SO SÁNH & TRA CỨU ĐA CHIỀU (SÁNG TẠO ĐỘT PHÁ)
          ========================================================= */}
      <section id="so-sanh-vai" className="py-14 sm:py-20 md:py-24 scroll-mt-14 bg-[#f8faff]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          
          {/* Header Section */}
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-extrabold uppercase tracking-wider shadow-2xs">
              <Compass className="w-3.5 h-3.5 text-brand-600" />
              Tra Cứu &amp; Đối Soát Tính Năng Vải Thông Minh
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#004f5e] tracking-tight">
              BẢNG SO SÁNH CHI TIẾT 10+ DÒNG VẢI DOANH NGHIỆP
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm md:text-base leading-relaxed">
              Trực quan hóa cấu trúc dệt, bề mặt swatch thực tế, khả năng giữ form và tính năng kháng khuẩn.
              Bạn có thể chọn 2-3 loại vải để <strong className="text-brand-700 font-bold">đối soát ngang</strong> trực tiếp!
            </p>
          </div>

          {/* CONTROLS ĐA CHIỀU: SEARCH + NHÓM + NHU CẦU + VIEW MODE */}
          <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-sm mb-8 space-y-4">
            
            {/* Hàng 1: Search Box & View Mode Toggle */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-lg">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm theo tên vải, đặc tính (Bamboo, Polo, Sơ mi, Golf, Mát lạnh, Không nhăn...)"
                  className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 focus:border-brand-500 focus:bg-white rounded-2xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 outline-none transition-all shadow-2xs"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold p-1 cursor-pointer"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* View Switch Buttons & Compare Indicator */}
              <div className="flex items-center justify-between sm:justify-end gap-2.5">
                {compareList.length > 0 && (
                  <button
                    onClick={() => setIsCompareModalOpen(true)}
                    className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all animate-bounce cursor-pointer"
                  >
                    <Scale className="w-3.5 h-3.5" />
                    <span>So Sánh ({compareList.length})</span>
                  </button>
                )}

                <div className="inline-flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200">
                  <button
                    onClick={() => setViewMode("card")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      viewMode === "card" || viewMode === "auto"
                        ? "bg-white text-[#004f5e] shadow-xs font-bold"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                    title="Xem dạng thẻ hình ảnh trực quan"
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                    <span>Dạng Thẻ Đồ Họa</span>
                  </button>

                  <button
                    onClick={() => setViewMode("table")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      viewMode === "table"
                        ? "bg-white text-[#004f5e] shadow-xs font-bold"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                    title="Xem dạng bảng đối soát kỹ thuật"
                  >
                    <TableProperties className="w-3.5 h-3.5" />
                    <span>Bảng Kỹ Thuật</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Hàng 2: Category Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1 hidden sm:inline">
                Nhóm vải:
              </span>
              {CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat.id;
                const count =
                  cat.id === "all"
                    ? ENRICHED_FABRICS.length
                    : ENRICHED_FABRICS.filter((f) => f.category === cat.id).length;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                      isActive
                        ? "bg-[#004f5e] text-white shadow-xs font-bold"
                        : "bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200/80"
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        isActive ? "bg-white/20 text-white" : "bg-white text-slate-500"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Hàng 3: Chips Lọc Nhanh Theo Nhu Cầu May Thực Tế */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pt-2 border-t border-slate-100">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1 hidden sm:inline">
                Nhu cầu:
              </span>
              {PURPOSE_FILTERS.map((p) => {
                const isSelected = selectedPurpose === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPurpose(p.id)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                      isSelected
                        ? "bg-brand-500 text-white shadow-2xs font-bold"
                        : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/80"
                    }`}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Khi không tìm thấy kết quả */}
          {filteredFabrics.length === 0 && (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
              <div className="w-12 h-12 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center mx-auto">
                <HelpCircle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">Không tìm thấy chất liệu vải phù hợp</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Không có loại vải nào khớp với bộ lọc hoặc từ khóa &ldquo;{searchQuery}&rdquo;. Hãy thử xóa bộ lọc để xem toàn bộ danh mục.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                  setSelectedPurpose("all");
                }}
                className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Đặt lại toàn bộ bộ lọc
              </button>
            </div>
          )}

          {/* =========================================================
              VIEW 1: CREATIVE VISUAL SPECIMEN BENTO CARDS
              (Mỗi thẻ có ảnh macro texture vải + badges + tính năng tương tác)
              ========================================================= */}
          {filteredFabrics.length > 0 && (
            <div
              className={`${
                viewMode === "table"
                  ? "hidden"
                  : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              }`}
            >
              {filteredFabrics.map((fabric, idx) => {
                const isCompared = compareList.some((f) => f.name === fabric.name);

                return (
                  <div
                    key={idx}
                    className={`bg-white rounded-3xl border transition-all duration-300 flex flex-col justify-between overflow-hidden group shadow-xs hover:shadow-xl relative ${
                      isCompared
                        ? "border-amber-400 ring-2 ring-amber-300"
                        : "border-slate-200/90 hover:border-brand-400"
                    }`}
                  >
                    {/* KHỐI ẢNH SWATCH TRỰC QUAN TRÊN CÙNG CỦA THẺ */}
                    <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={fabric.image}
                        alt={fabric.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />

                      {/* Gradient bóng mờ viền dưới ảnh */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/30" />

                      {/* Badge danh mục (góc trên bên trái) */}
                      <div className="absolute top-3 left-3 z-10">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/95 text-slate-800 backdrop-blur-md shadow-xs">
                          {fabric.category}
                        </span>
                      </div>

                      {/* Badge nổi bật (góc trên bên phải) */}
                      {fabric.badge && (
                        <div className="absolute top-3 right-3 z-10">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-amber-400 text-slate-900 shadow-sm flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            <span>{fabric.badge}</span>
                          </span>
                        </div>
                      )}

                      {/* Nút SO SÁNH (+) ngay trên ảnh */}
                      <div className="absolute bottom-3 right-3 z-10">
                        <button
                          onClick={() => toggleCompare(fabric)}
                          className={`px-2.5 py-1 rounded-xl text-[11px] font-bold backdrop-blur-md transition-all flex items-center gap-1 cursor-pointer ${
                            isCompared
                              ? "bg-amber-500 text-white shadow-sm ring-1 ring-white"
                              : "bg-black/60 hover:bg-black/80 text-white border border-white/30"
                          }`}
                          title="Thêm vào danh sách so sánh ngang"
                        >
                          {isCompared ? (
                            <>
                              <CheckCheck className="w-3 h-3 text-white" />
                              <span>Đã chọn đối soát</span>
                            </>
                          ) : (
                            <>
                              <Scale className="w-3 h-3 text-amber-300" />
                              <span>+ So Sánh</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* GSM Định lượng vải trên ảnh */}
                      <div className="absolute bottom-3 left-3 z-10 text-white">
                        <span className="text-[10px] font-medium text-slate-200 bg-white/15 px-2 py-0.5 rounded-md backdrop-blur-xs">
                          {fabric.gsm}
                        </span>
                      </div>
                    </div>

                    {/* NỘI DUNG THẺ */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        {/* Tiêu đề dòng vải & Star rating */}
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="font-extrabold text-[#004f5e] text-base sm:text-lg leading-snug group-hover:text-brand-600 transition-colors">
                            {fabric.name}
                          </h3>
                        </div>

                        {/* Điểm số trực quan */}
                        <div className="flex items-center gap-3 text-xs mb-3 text-slate-500 bg-slate-50 p-2 rounded-xl border border-slate-100">
                          <div className="flex items-center gap-1">
                            <span className="text-[11px] font-semibold text-slate-600">Thoáng mát:</span>
                            <span className="font-bold text-amber-500">{fabric.breathability}</span>
                          </div>
                          <span className="text-slate-300">•</span>
                          <div className="flex items-center gap-1">
                            <span className="text-[11px] font-semibold text-slate-600">Độ bền:</span>
                            <span className="font-bold text-amber-500">{fabric.durability}</span>
                          </div>
                        </div>

                        {/* Đặc tính kỹ thuật */}
                        <p className="text-xs text-slate-600 leading-relaxed mb-3">
                          {fabric.features}
                        </p>

                        {/* Thông số ứng dụng & độ co rút */}
                        <div className="space-y-1.5 text-xs">
                          <div className="flex items-start gap-2 bg-brand-50/50 p-2.5 rounded-xl border border-brand-100/60">
                            <Shirt className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                            <div>
                              <span className="text-slate-500 block text-[10px]">Phù hợp may mặc:</span>
                              <span className="font-semibold text-slate-800 text-[11px]">{fabric.usage}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-[11px] px-1 text-slate-500 pt-1">
                            <span>Độ co rút:</span>
                            <span className="font-semibold text-slate-700">{fabric.shrinkage}</span>
                          </div>
                        </div>
                      </div>

                      {/* CÁC NÚT HÀNH ĐỘNG TƯƠNG TÁC */}
                      <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setQuickViewFabric(fabric)}
                          className="py-2.5 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-500" />
                          <span>Chi Tiết</span>
                        </button>

                        <button
                          onClick={() => setIsQuickQuoteOpen(true)}
                          className="py-2.5 px-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Nhận Mẫu</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* =========================================================
              VIEW 2: TABLE VIEW MATRIX
              ========================================================= */}
          {filteredFabrics.length > 0 && (
            <div
              className={`${
                viewMode === "card" ? "hidden" : viewMode === "table" ? "block" : "hidden"
              } bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden`}
            >
              <div className="lg:hidden bg-brand-50 px-4 py-2 text-xs font-semibold text-brand-800 flex items-center justify-between border-b border-brand-200/50">
                <span className="flex items-center gap-1.5">
                  <MoveHorizontal className="w-4 h-4 text-brand-600 animate-pulse" />
                  <span>Vuốt ngang bảng để xem toàn bộ thông số</span>
                </span>
                <span className="text-[10px] text-brand-600 bg-white px-2 py-0.5 rounded-full border border-brand-200">
                  Cố định cột tên vải
                </span>
              </div>

              <div className="overflow-x-auto touch-pan-x">
                <table className="w-full text-left text-xs sm:text-sm min-w-[850px] border-collapse">
                  <thead className="bg-[#004f5e] text-white uppercase text-xs font-extrabold tracking-wider border-b border-brand-500/30">
                    <tr>
                      <th className="py-4 px-5 sticky left-0 z-30 bg-[#004f5e] shadow-[3px_0_6px_rgba(0,0,0,0.15)] min-w-[220px]">
                        Loại Vải &amp; Định Lượng
                      </th>
                      <th className="py-4 px-5 min-w-[270px]">Đặc Tính Kỹ Thuật</th>
                      <th className="py-4 px-5 min-w-[200px]">Phù Hợp Cho</th>
                      <th className="py-4 px-5 min-w-[140px]">Độ Co Rút</th>
                      <th className="py-4 px-5 text-center min-w-[110px]">Độ Thoáng</th>
                      <th className="py-4 px-5 text-center min-w-[150px]">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {filteredFabrics.map((fabric, idx) => (
                      <tr key={idx} className="hover:bg-brand-50/40 transition-colors group">
                        <td className="py-4 px-5 font-bold text-[#004f5e] sticky left-0 z-20 bg-white group-hover:bg-brand-50/90 transition-colors shadow-[3px_0_6px_rgba(0,0,0,0.06)]">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-slate-200">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={fabric.image}
                                alt={fabric.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-extrabold text-sm text-[#004f5e]">{fabric.name}</span>
                                {fabric.badge && (
                                  <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded font-semibold border border-amber-200/50">
                                    {fabric.badge}
                                  </span>
                                )}
                              </div>
                              <span className="text-[11px] text-slate-400 block font-normal">
                                {fabric.gsm} • {fabric.category}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-5 leading-relaxed text-slate-700">{fabric.features}</td>
                        <td className="py-4 px-5 font-semibold text-slate-800">{fabric.usage}</td>
                        <td className="py-4 px-5 text-brand-700 font-semibold">{fabric.shrinkage}</td>
                        <td className="py-4 px-5 text-center text-amber-500 font-bold whitespace-nowrap">
                          {fabric.breathability}
                        </td>
                        <td className="py-4 px-5 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => toggleCompare(fabric)}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all cursor-pointer"
                              title="Đối soát so sánh"
                            >
                              <Scale className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setQuickViewFabric(fabric)}
                              className="px-2.5 py-1.5 rounded-lg bg-brand-50 hover:bg-brand-500 text-brand-700 hover:text-white font-bold text-xs transition-all whitespace-nowrap cursor-pointer"
                            >
                              Xem mẫu
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* BANNER NHẬN TẬP BẢNG VẢI THẬT 0Đ */}
          <div className="mt-10 bg-gradient-to-r from-brand-50 via-brand-100/60 to-brand-50 p-6 sm:p-8 rounded-3xl border border-brand-300/40 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-5">
            <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 text-white flex items-center justify-center font-bold shadow-md shrink-0">
                <Sparkles className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <div>
                <h4 className="font-extrabold text-[#004f5e] text-base sm:text-lg leading-snug">
                  Quý Doanh Nghiệp Cần Trực Tiếp Cảm Nhận Vải Thật?
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                  HDC chuyển phát hỏa tốc tập catalog vải mẫu thực tế hoàn toàn <strong className="text-brand-700">MIỄN PHÍ 0Đ</strong> tận tay quý công ty trong 24h.
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsQuickQuoteOpen(true)}
              className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-brand-500 via-brand-600 to-brand-700 hover:from-brand-600 hover:to-brand-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-brand-600/20 active:scale-98 transition-all shrink-0 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Đăng Ký Nhận Bảng Vải 0đ</span>
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================
          SECTION 4: GỢI Ý CHỌN VẢI THEO NGÀNH NGHỀ & MỤC ĐÍCH
          ========================================================= */}
      <section id="goi-y-nganh-nghe" className="py-14 sm:py-20 scroll-mt-14 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-2.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-bold uppercase tracking-wider">
              <Briefcase className="w-3.5 h-3.5 text-brand-600" />
              Tư Vấn Chuyên Gia HDC
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#004f5e] tracking-tight">
              GỢI Ý CHỌN VẢI THEO TỪNG LĨNH VỰC DOANH NGHIỆP
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm md:text-base leading-relaxed">
              Mỗi ngành nghề có đặc thù môi trường và tính chất công việc riêng biệt. Hãy tham khảo
              bảng gợi ý từ chuyên viên dệt may HDC để chọn đúng chất liệu tối ưu nhất.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {INDUSTRY_SUGGESTIONS.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="bg-[#f8faff] rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs hover:shadow-xl hover:border-brand-400 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white flex items-center justify-center shadow-md">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-50 text-brand-700 border border-brand-200">
                        {item.badge}
                      </span>
                    </div>

                    <h3 className="font-black text-slate-800 text-base sm:text-lg mb-2">
                      {item.industry}
                    </h3>

                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4">
                      {item.reason}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-200/80">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                      Các dòng vải khuyến nghị:
                    </span>
                    <div className="flex flex-wrap items-center gap-2">
                      {item.fabrics.map((fName, fIdx) => (
                        <span
                          key={fIdx}
                          className="px-3 py-1 rounded-xl bg-white text-slate-800 font-semibold text-xs border border-slate-200 shadow-2xs"
                        >
                          ✓ {fName}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================
          SECTION 5: TIÊU CHUẨN KIỂM ĐỊNH & 4 CAM KẾT VÀNG HDC
          ========================================================= */}
      <section id="cam-ket-chat-luong" className="py-14 sm:py-20 bg-slate-50 border-t border-slate-200 scroll-mt-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-2.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
              Bảo Chứng Chất Lượng HDC Uniform
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#004f5e] tracking-tight">
              TIÊU CHUẨN KIỂM ĐỊNH &amp; 4 CAM KẾT VÀNG
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm md:text-base leading-relaxed">
              HDC chịu trách nhiệm cao nhất về chất lượng từng mét vải được đưa vào sản xuất đồng phục.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {QUALITY_STANDARDS.map((std, idx) => {
              const Icon = std.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 hover:border-brand-400 transition-all flex flex-col items-start shadow-xs hover:shadow-md"
                >
                  <div className="w-11 h-11 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shadow-xs border border-brand-100 mb-4">
                    <Icon className="w-5 h-5 text-brand-600" />
                  </div>
                  <h3 className="font-extrabold text-slate-800 text-sm sm:text-base mb-2">
                    {std.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {std.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================
          FLOATING COMPARE DOCK (THANH DOCK ĐỐI SOÁT NỔI Ở DƯỚI MÀN HÌNH)
          ========================================================= */}
      {compareList.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="bg-[#003843]/95 backdrop-blur-xl border border-brand-400/40 text-white rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-2xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <span className="w-8 h-8 rounded-xl bg-amber-500 text-slate-900 font-black text-xs flex items-center justify-center shrink-0">
                {compareList.length}/3
              </span>
              <div className="min-w-0">
                <span className="text-xs font-bold block truncate text-brand-200">
                  Đang chọn đối soát ({compareList.length} loại vải):
                </span>
                <div className="flex items-center gap-1.5 mt-0.5 overflow-x-auto scrollbar-none">
                  {compareList.map((f, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/15 text-[10px] text-white whitespace-nowrap"
                    >
                      <span>{f.name}</span>
                      <button
                        onClick={() => toggleCompare(f)}
                        className="hover:text-red-400 font-bold ml-0.5 cursor-pointer"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setCompareList([])}
                className="px-2.5 py-2 text-xs text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                Xóa
              </button>

              <button
                onClick={() => setIsCompareModalOpen(true)}
                className="px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Scale className="w-3.5 h-3.5" />
                <span>So Sánh Ngay</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL 1: SO SÁNH ĐỐI SOÁT NGANG (SIDE-BY-SIDE COMPARE MODAL)
          ========================================================= */}
      {isCompareModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-200 border border-slate-200">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 bg-[#004f5e] text-white flex items-center justify-between border-b border-brand-500/30 shrink-0">
              <div className="flex items-center gap-2.5">
                <Scale className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="font-extrabold text-base sm:text-lg leading-tight">
                    Bảng Đối Soát Trực Tiếp {compareList.length} Dòng Vải
                  </h3>
                  <p className="text-[11px] text-brand-200">
                    So sánh các tiêu chí kỹ thuật để tìm ra chất liệu phù hợp nhất
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCompareModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body: Bảng so sánh ngang */}
            <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {compareList.map((fabric, idx) => (
                  <div
                    key={idx}
                    className="bg-[#f8faff] rounded-2xl p-4 border border-slate-200 flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="relative h-28 rounded-xl overflow-hidden mb-3 border border-slate-200">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={fabric.image}
                          alt={fabric.name}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/95 text-slate-800">
                          {fabric.category}
                        </span>
                      </div>

                      <h4 className="font-black text-[#004f5e] text-base mb-1">
                        {fabric.name}
                      </h4>
                      <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 inline-block mb-3">
                        {fabric.badge}
                      </span>

                      <div className="space-y-2.5 text-xs">
                        <div className="border-t border-slate-200 pt-2">
                          <span className="text-slate-400 font-semibold block text-[10px] uppercase">
                            Thành phần sợi:
                          </span>
                          <span className="font-medium text-slate-800">{fabric.composition}</span>
                        </div>

                        <div className="border-t border-slate-200 pt-2">
                          <span className="text-slate-400 font-semibold block text-[10px] uppercase">
                            Định lượng:
                          </span>
                          <span className="font-bold text-brand-700">{fabric.gsm}</span>
                        </div>

                        <div className="border-t border-slate-200 pt-2">
                          <span className="text-slate-400 font-semibold block text-[10px] uppercase">
                            Đặc tính nổi bật:
                          </span>
                          <span className="text-slate-700">{fabric.features}</span>
                        </div>

                        <div className="border-t border-slate-200 pt-2">
                          <span className="text-slate-400 font-semibold block text-[10px] uppercase">
                            Ứng dụng may:
                          </span>
                          <span className="font-semibold text-slate-800">{fabric.usage}</span>
                        </div>

                        <div className="border-t border-slate-200 pt-2">
                          <span className="text-slate-400 font-semibold block text-[10px] uppercase">
                            Độ co rút:
                          </span>
                          <span className="font-medium text-emerald-700">{fabric.shrinkage}</span>
                        </div>

                        <div className="border-t border-slate-200 pt-2 flex items-center justify-between">
                          <span className="text-slate-500">Độ thoáng mát:</span>
                          <span className="font-bold text-amber-500">{fabric.breathability}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setIsCompareModalOpen(false);
                        setIsQuickQuoteOpen(true);
                      }}
                      className="w-full py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Nhận Mẫu Vải Này</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              <span className="text-xs text-slate-500">
                HDC có thể gửi cùng lúc cả {compareList.length} tập mẫu vải để quý doanh nghiệp cầm trực tiếp.
              </span>
              <button
                onClick={() => {
                  setIsCompareModalOpen(false);
                  setIsQuickQuoteOpen(true);
                }}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Đăng Ký Nhận Cả {compareList.length} Mẫu Vải (0đ)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL 2: XEM CHI TIẾT PHÓNG TO MẪU VẢI (QUICK VIEW MODAL)
          ========================================================= */}
      {quickViewFabric && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-200 border border-slate-200">
            {/* Modal Header */}
            <div className="relative h-56 sm:h-64 w-full overflow-hidden bg-slate-900 shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={quickViewFabric.image}
                alt={quickViewFabric.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

              <button
                onClick={() => setQuickViewFabric(null)}
                className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="absolute bottom-4 left-5 right-5 text-white z-10">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950 inline-block mb-1">
                  {quickViewFabric.badge}
                </span>
                <h3 className="text-xl sm:text-2xl font-black">{quickViewFabric.name}</h3>
                <p className="text-xs text-brand-200">{quickViewFabric.category} • {quickViewFabric.gsm}</p>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs sm:text-sm">
              <div className="bg-brand-50/60 p-4 rounded-2xl border border-brand-100">
                <span className="font-bold text-[#004f5e] block mb-1">Đặc tính kỹ thuật chính:</span>
                <p className="text-slate-700 leading-relaxed">{quickViewFabric.features}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-slate-400 font-semibold block text-[10px] uppercase">Thành phần:</span>
                  <span className="font-bold text-slate-800">{quickViewFabric.composition}</span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-slate-400 font-semibold block text-[10px] uppercase">Độ co rút:</span>
                  <span className="font-bold text-emerald-700">{quickViewFabric.shrinkage}</span>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-slate-400 font-semibold block text-[10px] uppercase mb-1">Hướng dẫn bảo quản &amp; giặt ủi:</span>
                <p className="text-slate-600 text-xs leading-relaxed">{quickViewFabric.careInstruction}</p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
              <button
                onClick={() => {
                  toggleCompare(quickViewFabric);
                }}
                className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Scale className="w-3.5 h-3.5" />
                <span>{compareList.some(f => f.name === quickViewFabric.name) ? "Bỏ đối soát" : "Thêm vào so sánh"}</span>
              </button>

              <button
                onClick={() => {
                  setQuickViewFabric(null);
                  setIsQuickQuoteOpen(true);
                }}
                className="px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Yêu Cầu Mẫu Thử Vải Này</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
