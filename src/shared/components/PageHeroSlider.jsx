"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { BRAND_INFO } from "@/shared/data";
import { useShop } from "@/shared/providers/ShopProvider";
import {
  Sparkles,
  PhoneCall,
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Layers,
  ShieldCheck,
  Building2,
  Scissors
} from "lucide-react";

// ============================================================
// CATEGORY & PAGE SLIDES CONFIGURATION
// Sử dụng toàn bộ ảnh chất lượng cao có sẵn trong public/images
// ============================================================
const SLIDES_BY_CATEGORY = {
  corporate: [
    {
      image: "/images/06_polo_01.jpg",
      eyebrow: "Bán Chạy Nhất 2026",
      title: "ÁO POLO DOANH NGHIỆP",
      titleHighlight: "HDC CLASSIC",
      subtitle: "Vải cá sấu Cotton Compact 4 chiều kháng khuẩn",
      description:
        "Dòng áo Polo đồng phục chủ lực được hơn 50.000+ doanh nghiệp tin dùng. Bo dệt vi tính sắc sảo, chống xù lông, bền màu sau 100 lần giặt.",
      ctaPrimary: "Báo Giá Polo",
      ctaSecondary: "Xem Bảng Màu",
      badge: "May mẫu 0đ"
    },
    {
      image: "/images/05_bestseller_shirts_01.jpg",
      eyebrow: "Thanh Lịch Công Sở",
      title: "SƠ MI DOANH NGHIỆP",
      titleHighlight: "CHỐNG NHĂN TỰ NHIÊN",
      subtitle: "Dệt từ sợi Bamboo & Modal thoáng mát cả ngày",
      description:
        "Chuẩn form dáng châu Âu, ve cổ đứng form thanh lịch. Nâng tầm hình ảnh chuyên nghiệp và gắn kết đội ngũ doanh nghiệp của bạn.",
      ctaPrimary: "Đặt Sơ Mi Ngay",
      ctaSecondary: "Tư Vấn Mẫu",
      badge: "Form chuẩn Ý"
    },
    {
      image: "/images/uniform_polo_corporate.jpg",
      eyebrow: "Thiết Kế Độc Quyền",
      title: "ĐỒNG PHỤC TEAM BUILDING",
      titleHighlight: "BỨT PHÁ BẢN SẮC",
      subtitle: "Thiết kế 3D miễn phí 100% theo nhận diện thương hiệu",
      description:
        "Hỗ trợ may mẫu thử 0đ duyệt form trước khi may đồng loạt. Bảo hành 1 đổi 1 trong 30 ngày và giao hàng toàn quốc.",
      ctaPrimary: "Nhận Báo Giá 0đ",
      ctaSecondary: "Xem Catalogue",
      badge: "Thiết kế 3D Free"
    }
  ],

  bespoke_suit: [
    {
      image: "/images/uniform_corporate_suits.jpg",
      eyebrow: "Đẳng Cấp Lãnh Đạo",
      title: "VEST DOANH NHÂN",
      titleHighlight: "BESPOKE CHUẨN Ý",
      subtitle: "Dành riêng cho Ban lãnh đạo & Cấp quản lý doanh nghiệp",
      description:
        "Đo ni tận nơi bởi đội ngũ thợ may 15+ năm kinh nghiệm. Phom dáng quyền lực, sắc sảo từng đường kim mũi chỉ và ve áo thủ công.",
      ctaPrimary: "Đăng Ký Đo Tận Nơi",
      ctaSecondary: "Xem Mẫu Vest",
      badge: "Đo ni tận nơi"
    },
    {
      image: "/images/01_portraits_01.jpg",
      eyebrow: "Cắt May Tỉ Mỉ",
      title: "QUẦN TÂY & VEST NỮ",
      titleHighlight: "TÔN DÁNG THANH LỊCH",
      subtitle: "Chất liệu Wool cao cấp nhập khẩu co giãn nhẹ",
      description:
        "Đo ni theo kích thước cá nhân từng nhân sự, chỉnh sửa đến khi vừa vặn 100%. Bảo hành đường may trọn đời cho doanh nghiệp.",
      ctaPrimary: "Báo Giá May Đo",
      ctaSecondary: "Xem Bảng Vải",
      badge: "Bảo hành trọn đời"
    },
    {
      image: "/images/01_portraits_02.jpg",
      eyebrow: "Hoàn Hảo Từng Chi Tiết",
      title: "SƠ MI MAY ĐO CAO CẤP",
      titleHighlight: "TINH HOA NGHỀ MAY",
      subtitle: "Nút xà cừ khắc logo riêng, ve cổ chống gãy dập",
      description:
        "Hỗ trợ may bổ sung số lượng ít trọn đời với đơn giá ưu đãi khi doanh nghiệp tuyển dụng thêm nhân sự mới.",
      ctaPrimary: "Tư Vấn May Đo",
      ctaSecondary: "Hotline 24/7",
      badge: "Bổ sung trọn đời"
    }
  ],

  sport_golf: [
    {
      image: "/images/uniform_sport_golf.jpg",
      eyebrow: "Công Nghệ AeroCool Mới",
      title: "ĐỒNG PHỤC THỂ THAO",
      titleHighlight: "GOLF & PICKLEBALL",
      subtitle: "Hạ nhiệt cơ thể 3°C, chống tia cực tím UPF 50+",
      description:
        "Co giãn 4 chiều linh hoạt cho cú swing uy lực. Đồng hành cùng hàng trăm giải đấu Golf, Pickleball và Marathon doanh nghiệp.",
      ctaPrimary: "Báo Giá Áo Golf",
      ctaSecondary: "Xem Ảnh Giải Đấu",
      badge: "AeroCool -3°C"
    },
    {
      image: "/images/08_golf_event_01.jpg",
      eyebrow: "Hình Ảnh Giải Đấu Đẳng Cấp",
      title: "ÁO GIẢI ĐẤU & MARATHON",
      titleHighlight: "IN PET 4K SIÊU BỀN",
      subtitle: "Công nghệ in nhiệt Tajima không bong tróc bay màu",
      description:
        "Sản xuất siêu tốc cho giải chạy và sự kiện thể thao doanh nghiệp. May mẫu thử duyệt form trước khi may đồng loạt.",
      ctaPrimary: "Đặt Áo Giải Đấu",
      ctaSecondary: "Tư Vấn Thiết Kế",
      badge: "In PET 4K"
    },
    {
      image: "/images/07_corporate_golf_01.jpg",
      eyebrow: "Bứt Phá Phong Độ",
      title: "BỘ SƯU TẬP SPORT ACTIVE",
      titleHighlight: "NĂNG ĐỘNG BỀN BỈ",
      subtitle: "Dệt cấu trúc tổ ong thông hơi, nhanh khô gấp 3 lần",
      description:
        "Chất vải siêu nhẹ thoát ẩm cực nhanh, kháng khuẩn ion bạc ngăn mùi ẩm mốc khi hoạt động ngoài trời cường độ cao.",
      ctaPrimary: "Nhận Báo Giá 0đ",
      ctaSecondary: "Xem Thêm Mẫu",
      badge: "Nhanh khô x3"
    }
  ],

  school: [
    {
      image: "/images/uniform_school_students.jpg",
      eyebrow: "Chuẩn Quốc Tế",
      title: "ĐỒNG PHỤC TRƯỜNG HỌC",
      titleHighlight: "HIỆN ĐẠI & AN TOÀN",
      subtitle: "Học sinh các cấp, sinh viên & đội ngũ giáo viên",
      description:
        "Chuẩn phom dáng học đường thanh lịch, vải mềm mại lành tính cho làn da học sinh. Huy hiệu trường thêu Tajima sắc sảo.",
      ctaPrimary: "Báo Giá Nhà Trường",
      ctaSecondary: "Xem Mẫu Áo",
      badge: "An toàn lành tính"
    },
    {
      image: "/images/09_kids_school_01.jpg",
      eyebrow: "Thoải Mái Vui Chơi",
      title: "ĐỒNG PHỤC MẦM NON & TIỂU HỌC",
      titleHighlight: "100% SỢI THIÊN NHIÊN",
      subtitle: "Thấm hút mồ hôi tối đa, co giãn dễ vận động",
      description:
        "Chất vải cotton tự nhiên dễ giặt sạch mọi vết bẩn, bền màu sau nhiều lần giặt máy. Váy xếp ly có quần lót an toàn bên trong.",
      ctaPrimary: "Đăng Ký May Mẫu",
      ctaSecondary: "Xem Bảng Size",
      badge: "Cotton tự nhiên"
    },
    {
      image: "/images/12_kids_bestseller_01.jpg",
      eyebrow: "Đồng Đều & Năng Động",
      title: "ÁO THỂ DỤC & HỘI THAO",
      titleHighlight: "GIÁ XƯỞNG TRỰC TIẾP",
      subtitle: "Cung cấp cho hơn 200+ trường học trên toàn quốc",
      description:
        "Giá sỉ trực tiếp tận xưởng sản xuất không qua trung gian. Hỗ trợ may bổ sung lẻ từng học sinh trong suốt năm học.",
      ctaPrimary: "Liên Hệ Nhà Trường",
      ctaSecondary: "Hotline Tư Vấn",
      badge: "Giá xưởng tận gốc"
    }
  ],

  accessories: [
    {
      image: "/images/uniform_accessories.jpg",
      eyebrow: "Đồng Bộ Nhận Diện",
      title: "PHỤ KIỆN DOANH NGHIỆP",
      titleHighlight: "TINH TẾ & ĐẲNG CẤP",
      subtitle: "Mũ nón, cà vạt, nơ, cặp da, tạp dề & quà tặng",
      description:
        "Điểm nhấn tinh tế hoàn thiện diện mạo nhận diện thương hiệu chuyên nghiệp cho tổ chức, ngân hàng và tập đoàn.",
      ctaPrimary: "Báo Giá Phụ Kiện",
      ctaSecondary: "Xem Mẫu Quà Tặng",
      badge: "Đồng bộ nhận diện"
    },
    {
      image: "/images/04_culture_accessories_01.jpg",
      eyebrow: "Quà Tặng Doanh Nghiệp",
      title: "CÀ VẠT & KHĂN LỤA",
      titleHighlight: "DỆT LOGO ĐỘC QUYỀN",
      subtitle: "Lụa tơ tằm & gấm hoa văn sang trọng",
      description:
        "Món quà tri ân ý nghĩa dành tặng đối tác, khách hàng VIP và trang phục nghi thức của ban lãnh đạo cấp cao.",
      ctaPrimary: "Đặt Dệt Logo",
      ctaSecondary: "Tư Vấn Market 3D",
      badge: "Dệt logo riêng"
    },
    {
      image: "/images/04_culture_accessories_03.jpg",
      eyebrow: "Sự Kiện Ngoài Trời",
      title: "MŨ LƯỠI TRAI & NÓN BUCKET",
      titleHighlight: "THÊU 3D NỔI BẬT",
      subtitle: "Vải Kaki Cotton chống bám bụi, đứng phom",
      description:
        "Lựa chọn hoàn hảo cho sự kiện team building, giải chạy, hội thao và chiến dịch quảng bá thương hiệu ngoài trời.",
      ctaPrimary: "Báo Giá Nón Mũ",
      ctaSecondary: "Xem Thêm Mẫu",
      badge: "Thêu 3D Tajima"
    }
  ],

  fabrics: [
    {
      image: "/images/catalogue-2026-hero.jpg",
      eyebrow: "Tiêu Chuẩn Nguyên Liệu 2026",
      title: "BẢNG CHẤT LIỆU VẢI CAO CẤP",
      titleHighlight: "XANH & BỀN VỮNG",
      subtitle: "Modal, Bamboo, Sợi Bạc Hà, Sợi Sen & Sợi Chuối",
      description:
        "100% dòng vải được kiểm định an toàn dệt may, xử lý kháng khuẩn, chống xù lông và giữ phom dáng bền đẹp suốt nhiều năm.",
      ctaPrimary: "Gửi Tập Vải Mẫu 0đ",
      ctaSecondary: "Xem Chi Tiết Vải",
      badge: "Vải xanh sinh học"
    },
    {
      image: "/images/02_materials_01.jpg",
      eyebrow: "Công Nghệ Độc Quyền",
      title: "CÔNG NGHỆ DỆT KHÁNG KHUẨN",
      titleHighlight: "BỀN MÀU 100 LẦN GIẶT",
      subtitle: "Khử mùi hiệu quả, co giãn 4 chiều thoáng khí",
      description:
        "Sợi dệt Compact mật độ cao cho bề mặt đanh mịn, không bai dão và mềm mượt tự nhiên suốt ngày dài làm việc năng động.",
      ctaPrimary: "Tư Vấn Chọn Vải",
      ctaSecondary: "Hotline 24/7",
      badge: "Kháng khuẩn Ion Bạc"
    },
    {
      image: "/images/03_fabric_tech_01.jpg",
      eyebrow: "Đột Phá Kỹ Thuật",
      title: "CÔNG NGHỆ SEAMLESS",
      titleHighlight: "KHÔNG ĐƯỜNG MAY",
      subtitle: "Sơ mi & polo không đường may độc quyền tại HDC",
      description:
        "Ép nhiệt cao tần gia cường mối nối, phẳng mịn hoàn hảo, giảm ma sát tối đa mang lại cảm giác nhẹ tênh như làn da thứ hai.",
      ctaPrimary: "Nhận Báo Giá 0đ",
      ctaSecondary: "May Mẫu Thử",
      badge: "Seamless Tech"
    }
  ],

  process: [
    {
      image: "/images/catalogue-2026-hero.jpg",
      eyebrow: "Tiêu Chuẩn Sản Xuất Khép Kín",
      title: "QUY TRÌNH MAY 6 BƯỚC",
      titleHighlight: "CHUẨN QUỐC TẾ",
      subtitle: "Từ phác thảo ý tưởng 3D đến bàn giao tận nơi",
      description:
        "Khách hàng được may mẫu thử 0đ duyệt form trước khi may đồng loạt. Kiểm định chất lượng KCS 3 vòng nghiêm ngặt.",
      ctaPrimary: "Đặt May Mẫu Thử",
      ctaSecondary: "Tham Quan Xưởng",
      badge: "May mẫu thử 0đ"
    },
    {
      image: "/images/uniform_corporate_suits.jpg",
      eyebrow: "Quy Mô & Năng Lực",
      title: "XƯỞNG SẢN XUẤT 2.500M²",
      titleHighlight: "CÔNG SUẤT 50.000 SP/THÁNG",
      subtitle: "KCN Thụy Vân, TP. Việt Trì, Tỉnh Phú Thọ",
      description:
        "Hệ thống dàn máy may Juki Nhật Bản, máy thêu vi tính Tajima 20 đầu và chuyền in PET 4K đáp ứng mọi tiến độ gấp của doanh nghiệp.",
      ctaPrimary: "Báo Giá Nhanh 5 Phút",
      ctaSecondary: "Hotline: 0984 95 95 86",
      badge: "50.000 SP/tháng"
    }
  ],

  about: [
    {
      image: "/images/tmht.jpg",
      eyebrow: "Về HDC Fashion — HDC GROUP VN",
      title: "HÀNH TRÌNH GẦN 10 NĂM",
      titleHighlight: "NÂNG TẦM THƯƠNG HIỆU VIỆT",
      subtitle: "Phong cách tạo thành công — Đồng hành cùng 50.000+ doanh nghiệp",
      description:
        "Khởi nguồn từ Đất Tổ Hùng Vương, HDC Fashion tự hào là đơn vị tiên phong trong tư vấn, thiết kế độc quyền và sản xuất đồng phục cao cấp.",
      ctaPrimary: "Khám Phá Dịch Vụ",
      ctaSecondary: "Xem Hồ Sơ Năng Lực",
      badge: "Gần 10 năm kinh nghiệm"
    },
    {
      image: "/images/CEO.jpg",
      eyebrow: "Tâm Huyết Người Sáng Lập",
      title: "CHẤT LƯỢNG LÀ DANH DỰ",
      titleHighlight: "CAM KẾT TỪ TRÁI TIM",
      subtitle: "Founder & CEO HDC GROUP VN — Bà Nguyễn Thị Thương",
      description:
        "Chúng tôi không chỉ may trang phục, mà kiến tạo niềm tự hào và diện mạo chuyên nghiệp xứng tầm vị thế doanh nghiệp Việt.",
      ctaPrimary: "Liên Hệ Hợp Tác",
      ctaSecondary: "Tư Vấn Tận Nơi",
      badge: "Cam kết danh dự"
    }
  ],

  contact: [
    {
      image: "/images/catalogue-2026-hero.jpg",
      eyebrow: "Trung Tâm Hỗ Trợ Khách Hàng 24/7",
      title: "KẾT NỐI VỚI CHUYÊN GIA",
      titleHighlight: "HDC FASHION",
      subtitle: "Tư vấn tận tâm, may mẫu thử 0đ & đo ni tận nơi miễn phí",
      description:
        "Hơn 50.000+ đối tác tin chọn HDC Fashion. Đội ngũ chuyên viên sẵn sàng tư vấn chất liệu, gửi tập vải mẫu và báo giá trong 5 phút.",
      ctaPrimary: "Yêu Cầu Báo Giá",
      ctaSecondary: "Gọi Hotline 24/7",
      badge: "Phản hồi trong 5 phút"
    },
    {
      image: "/images/uniform_corporate_suits.jpg",
      eyebrow: "Hệ Thống Trụ Sở & Showroom",
      title: "MẠNG LƯỚI TOÀN QUỐC",
      titleHighlight: "HÒA BÌNH • HÀ NỘI • PHÚ THỌ",
      subtitle: "Xưởng sản xuất 2.500m² tại KCN Thụy Vân, Việt Trì",
      description:
        "Ghé trực tiếp showroom để xem mẫu vải thật, thử các phom áo may sẵn hoặc liên hệ để chuyên viên đến đo đạc tận văn phòng.",
      ctaPrimary: "Xem Bản Đồ Cơ Sở",
      ctaSecondary: "Đặt Lịch Khảo Sát",
      badge: "Hotline: 0984 95 95 86"
    }
  ],

  blog: [
    {
      image: "/images/03_fabric_tech_01.jpg",
      eyebrow: "HDC Knowledge Hub 2026",
      title: "CẨM NANG & KIẾN THỨC",
      titleHighlight: "MAY ĐO ĐỒNG PHỤC",
      subtitle: "Bí quyết chọn vải, tối ưu chi phí & chuẩn hóa nhận diện thương hiệu",
      description:
        "Tổng hợp cẩm nang chuyên sâu từ các chuyên gia may mặc HDC Fashion: bảng size chuẩn châu Á, phân loại chất liệu dệt may và xu hướng thời trang công sở mới nhất.",
      ctaPrimary: "Xem Bài Nổi Bật",
      ctaSecondary: "Bảng So Sánh Vải",
      badge: "Kiến thức chuyên sâu"
    },
    {
      image: "/images/catalogue-2026-hero.jpg",
      eyebrow: "Dự Toán & Tối Ưu Chi Phí",
      title: "KINH NGHIỆM ĐẶT MAY",
      titleHighlight: "TIẾT KIỆM 20% NGÂN SÁCH",
      subtitle: "Giải pháp may đo trực tiếp tại xưởng không qua trung gian",
      description:
        "Cẩm nang hướng dẫn cách tính số lượng đặt may tối ưu, thời điểm vàng đặt hàng và những lưu ý tránh lãng phí khi đặt may đồng phục cho công ty.",
      ctaPrimary: "Xem Báo Giá Chuẩn",
      ctaSecondary: "Tư Vấn Miễn Phí",
      badge: "Báo giá sỉ tại xưởng"
    },
    {
      image: "/images/02_materials_01.jpg",
      eyebrow: "Chất Liệu & Kỹ Thuật Dệt",
      title: "BÍ QUYẾT CHỌN CHẤT LIỆU",
      titleHighlight: "COTTON • BAMBOO • MODAL",
      subtitle: "Thoáng mát, kháng khuẩn tự nhiên & giữ form bền bỉ",
      description:
        "Tìm hiểu sự khác biệt giữa các dòng sợi sinh học cao cấp, độ co giãn, độ bền màu sau 100 lần giặt và phương pháp giặt là bảo quản chuẩn nhất.",
      ctaPrimary: "Khám Phá Bảng Vải",
      ctaSecondary: "Nhận Mẫu Thử 0Đ",
      badge: "Chất liệu cao cấp"
    }
  ],

  knowledge: [
    {
      image: "/images/03_fabric_tech_01.jpg",
      eyebrow: "HDC Knowledge Hub 2026",
      title: "CẨM NANG & KIẾN THỨC",
      titleHighlight: "MAY ĐO ĐỒNG PHỤC",
      subtitle: "Bí quyết chọn vải, tối ưu chi phí & chuẩn hóa nhận diện thương hiệu",
      description:
        "Tổng hợp cẩm nang chuyên sâu từ các chuyên gia may mặc HDC Fashion: bảng size chuẩn châu Á, phân loại chất liệu dệt may và xu hướng thời trang công sở mới nhất.",
      ctaPrimary: "Xem Bài Nổi Bật",
      ctaSecondary: "Bảng So Sánh Vải",
      badge: "Kiến thức chuyên sâu"
    },
    {
      image: "/images/catalogue-2026-hero.jpg",
      eyebrow: "Dự Toán & Tối Ưu Chi Phí",
      title: "KINH NGHIỆM ĐẶT MAY",
      titleHighlight: "TIẾT KIỆM 20% NGÂN SÁCH",
      subtitle: "Giải pháp may đo trực tiếp tại xưởng không qua trung gian",
      description:
        "Cẩm nang hướng dẫn cách tính số lượng đặt may tối ưu, thời điểm vàng đặt hàng và những lưu ý tránh lãng phí khi đặt may đồng phục cho công ty.",
      ctaPrimary: "Xem Báo Giá Chuẩn",
      ctaSecondary: "Tư Vấn Miễn Phí",
      badge: "Báo giá sỉ tại xưởng"
    },
    {
      image: "/images/02_materials_01.jpg",
      eyebrow: "Chất Liệu & Kỹ Thuật Dệt",
      title: "BÍ QUYẾT CHỌN CHẤT LIỆU",
      titleHighlight: "COTTON • BAMBOO • MODAL",
      subtitle: "Thoáng mát, kháng khuẩn tự nhiên & giữ form bền bỉ",
      description:
        "Tìm hiểu sự khác biệt giữa các dòng sợi sinh học cao cấp, độ co giãn, độ bền màu sau 100 lần giặt và phương pháp giặt là bảo quản chuẩn nhất.",
      ctaPrimary: "Khám Phá Bảng Vải",
      ctaSecondary: "Nhận Mẫu Thử 0Đ",
      badge: "Chất liệu cao cấp"
    }
  ]
};

// Fallback slides nếu không tìm thấy danh mục
const DEFAULT_SLIDES = SLIDES_BY_CATEGORY.corporate;

const SLIDE_DURATION = 5500;
const TRANSITION_DURATION = 600;

export default function PageHeroSlider({
  category = "corporate",
  breadcrumb = "Đồng Phục",
  customSlides = null
}) {
  const { setIsQuickQuoteOpen } = useShop();

  const slides = customSlides || SLIDES_BY_CATEGORY[category] || DEFAULT_SLIDES;

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  const touchStartXRef = useRef(0);
  const touchEndXRef = useRef(0);

  const goToSlide = useCallback((index) => {
    const total = slides.length;
    setCurrentSlide(((index % total) + total) % total);
    setProgress(0);
  }, [slides.length]);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setProgress(0);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setProgress(0);
  }, [slides.length]);

  // Autoplay + progress bar
  useEffect(() => {
    if (isPaused || slides.length <= 1) return;

    const startTime = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const percent = Math.min((elapsed / SLIDE_DURATION) * 100, 100);
      setProgress(percent);

      if (elapsed >= SLIDE_DURATION) {
        nextSlide();
      }
    }, 50);

    return () => clearInterval(timer);
  }, [currentSlide, isPaused, nextSlide, slides.length]);

  // Keyboard controls
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "ArrowRight") nextSlide();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [nextSlide, prevSlide]);

  // Mobile Touch Gestures
  const handleTouchStart = (e) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchEndXRef.current = e.touches[0].clientX;
    setIsPaused(true);
  };

  const handleTouchMove = (e) => {
    touchEndXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartXRef.current - touchEndXRef.current;
    if (Math.abs(diff) > 40) {
      if (diff > 0) nextSlide();
      else prevSlide();
    }
    setTimeout(() => setIsPaused(false), 2500);
  };

  const slide = slides[currentSlide] || slides[0];

  return (
    <section className="relative w-full h-[52svh] min-h-[460px] max-h-[640px] overflow-hidden bg-slate-900 border-b border-brand-400/20 select-none">
      {/* ============================================
          SLIDES WRAPPER — TRƯỢT NGANG TỰ ĐỘNG
          ============================================ */}
      <div
        className="absolute inset-0 flex transition-transform ease-out"
        style={{
          transform: `translateX(-${currentSlide * 100}%)`,
          transitionDuration: `${TRANSITION_DURATION}ms`,
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {slides.map((s, idx) => (
          <div
            key={idx}
            className="relative w-full h-full flex-shrink-0"
            aria-hidden={idx !== currentSlide}
          >
            <Image
              src={s.image}
              alt={s.title + " " + s.titleHighlight}
              fill
              sizes="100vw"
              quality={92}
              priority={idx === 0}
              className="object-cover object-center"
            />

            {/* Gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#00222a]/95 via-[#00222a]/75 to-[#00222a]/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#00222a]/90 via-transparent to-[#00222a]/40" />
          </div>
        ))}
      </div>

      {/* ============================================
          CONTENT OVERLAY
          ============================================ */}
      <div className="relative z-10 h-full flex flex-col justify-center pointer-events-none">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pointer-events-auto">
          <div className="max-w-3xl">
            {/* Eyebrow badge */}
            <div
              key={`eyebrow-${currentSlide}`}
              className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-3 sm:mb-4 animate-in fade-in slide-in-from-left-4 duration-500 whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-400 shrink-0" />
              <span>{slide.eyebrow}</span>
              {slide.badge && (
                <span className="bg-brand-500 text-white px-2 py-0.5 rounded-full text-[10px] font-black ml-1">
                  {slide.badge}
                </span>
              )}
            </div>

            {/* Title with Gradient highlight */}
            <div
              key={`title-${currentSlide}`}
              className="mb-2 sm:mb-3 animate-in fade-in slide-in-from-left-4 duration-500 delay-75"
            >
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                {slide.title}{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 via-amber-300 to-brand-400 inline">
                  {slide.titleHighlight}
                </span>
              </h1>
            </div>

            {/* Subtitle */}
            <p
              key={`sub-${currentSlide}`}
              className="text-brand-200 font-semibold text-xs sm:text-sm md:text-base italic mb-3 animate-in fade-in slide-in-from-left-4 duration-500 delay-100"
            >
              &ldquo;{slide.subtitle}&rdquo;
            </p>

            {/* Description */}
            <p
              key={`desc-${currentSlide}`}
              className="text-slate-200 text-xs sm:text-sm md:text-base leading-relaxed mb-5 max-w-2xl animate-in fade-in slide-in-from-left-4 duration-500 delay-150 line-clamp-2 sm:line-clamp-3"
            >
              {slide.description}
            </p>

            {/* CTAs & Hotline */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => setIsQuickQuoteOpen(true)}
                className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-brand-400 to-brand-600 hover:from-brand-300 hover:to-brand-500 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-brand-500/25 active:scale-95 transition-all group"
              >
                <span>{slide.ctaPrimary || "Nhận Báo Giá 0đ"}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                href={`tel:${BRAND_INFO.contact.hotlineRaw}`}
                className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm backdrop-blur-md border border-white/20 active:scale-95 transition-all"
              >
                <PhoneCall className="w-4 h-4 text-brand-300" />
                <span>Hotline: {BRAND_INFO.contact.hotline}</span>
              </a>
            </div>

            {/* Trust Checklist mini */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] sm:text-xs text-brand-200/90 pt-4 border-t border-white/10 mt-5">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-400" />
                <span>May mẫu thử 0đ</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-400" />
                <span>Thiết kế 3D free</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-400" />
                <span>Bảo hành 30 ngày</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Scissors className="w-3.5 h-3.5 text-brand-400" />
                <span>Đo ni tận nơi</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================
          CONTROLS — ARROWS & THUMBNAILS
          ============================================ */}
      {slides.length > 1 && (
        <>
          {/* Prev / Next Arrows */}
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Slide trước"
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/30 hover:bg-black/60 text-white backdrop-blur-md flex items-center justify-center border border-white/15 transition-all hover:scale-105 active:scale-95 z-20"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          <button
            type="button"
            onClick={nextSlide}
            aria-label="Slide tiếp theo"
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/30 hover:bg-black/60 text-white backdrop-blur-md flex items-center justify-center border border-white/15 transition-all hover:scale-105 active:scale-95 z-20"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Bottom Bar: Indicators + Play/Pause + Progress */}
          <div className="absolute bottom-3 left-4 right-4 sm:left-8 sm:right-8 z-20 flex items-center justify-between gap-3">
            {/* Slide dots */}
            <div className="flex items-center gap-2">
              {slides.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => goToSlide(idx)}
                  className={`h-2 transition-all rounded-full ${
                    idx === currentSlide
                      ? "w-8 bg-brand-400 shadow-md shadow-brand-400/50"
                      : "w-2 bg-white/40 hover:bg-white/70"
                  }`}
                  aria-label={`Chuyển đến slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Play/Pause Toggle */}
            <button
              type="button"
              onClick={() => setIsPaused((prev) => !prev)}
              className="p-1.5 rounded-lg bg-black/30 hover:bg-black/50 text-white/80 hover:text-white backdrop-blur-md transition-colors"
              title={isPaused ? "Bật tự động chuyển slide" : "Tạm dừng"}
            >
              {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Progress bar line */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-20">
            <div
              className="h-full bg-gradient-to-r from-brand-400 to-amber-300 transition-all duration-75"
              style={{ width: `${progress}%` }}
            />
          </div>
        </>
      )}
    </section>
  );
}
