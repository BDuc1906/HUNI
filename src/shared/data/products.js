export const PRODUCTS = [
  {
    id: "huni-polo-pro",
    title: "Áo Polo Doanh Nghiệp HUNI Classic Gold",
    sku: "HN-POLO-01",
    category: "corporate",
    badge: "Bán Chạy Nhất",
    rating: 5.0,
    reviewsCount: 148,
    soldCount: "12,400+",
    image: "/images/uniform_polo_corporate.jpg",
    gallery: ["/images/uniform_polo_corporate.jpg", "/images/uniform_corporate_suits.jpg", "/images/uniform_accessories.jpg"],
    price: 185000,
    originalPrice: 245000,
    unit: "chiếc",
    wholesaleTiers: [
      { min: 10, max: 49, price: 185000, label: "10 - 49 áo" },
      { min: 50, max: 99, price: 155000, label: "50 - 99 áo" },
      { min: 100, max: 299, price: 135000, label: "100 - 299 áo" },
      { min: 300, max: 9999, price: 115000, label: "Từ 300 áo trở lên" }
    ],
    material: "Pique Cá Sấu Cotton Compact 4 Chiều",
    colors: [
      { name: "Xanh Navy Hoàng Gia", code: "#0B2042" },
      { name: "Trắng Ngọc Trai", code: "#FFFFFF" },
      { name: "Xanh Sky Blue", code: "#78A6C8" },
      { name: "Đen Doanh Nhân", code: "#18181B" }
    ],
    sizes: ["S", "M", "L", "XL", "2XL", "3XL", "May đo theo số đo"],
    features: [
      "Vải Pique dệt mắt chim tổ ong thông thoáng khí",
      "Sợi Cotton Compact dệt kéo dài chống bai xù lông tuyệt đối",
      "Bo cổ và bo tay dệt jacquard viền đôi vàng kim sắc nét",
      "Kháng khuẩn ion bạc, chống mùi mồ hôi cả ngày làm việc",
      "Miễn phí in/thêu logo công ty 1 vị trí từ 30 áo"
    ],
    description: "Dòng áo polo đồng phục doanh nghiệp cao cấp được HUNI thiết kế riêng cho các công ty, tập đoàn muốn xây dựng hình ảnh chuyên nghiệp, năng động và chỉn chu."
  },
  {
    id: "huni-suit-bespoke",
    title: "Bộ Vest Doanh Nhân & Lãnh Đạo HUNI Royal Bespoke",
    sku: "HN-SUIT-01",
    category: "bespoke_suit",
    badge: "May Đo Cao Cấp",
    rating: 4.9,
    reviewsCount: 96,
    soldCount: "2,800+",
    image: "/images/uniform_corporate_suits.jpg",
    gallery: ["/images/uniform_corporate_suits.jpg", "/images/ceo_portrait.jpg", "/images/uniform_accessories.jpg"],
    price: 1850000,
    originalPrice: 2400000,
    unit: "bộ (Áo vest + Quần âu / Chân váy)",
    wholesaleTiers: [
      { min: 5, max: 19, price: 1850000, label: "5 - 19 bộ" },
      { min: 20, max: 49, price: 1650000, label: "20 - 49 bộ" },
      { min: 50, max: 99, price: 1450000, label: "50 - 99 bộ" },
      { min: 100, max: 9999, price: 1250000, label: "Từ 100 bộ trở lên" }
    ],
    material: "Wool Len Pha Cashmere Nhập Khẩu Form Ý",
    colors: [
      { name: "Navy Hoàng Gia", code: "#0A192F" },
      { name: "Xám Than Chì", code: "#334155" },
      { name: "Đen Quyền Lực", code: "#0F172A" }
    ],
    sizes: ["S", "M", "L", "XL", "2XL", "Đo ni tận nơi"],
    features: [
      "Kỹ thuật dựng form Canvassing chuẩn phong cách Ý",
      "Đệm vai tự nhiên, ve áo vuốt nhọn tôn vóc dáng quyền uy",
      "Lớp lót lụa habutai mỏng nhẹ, thoáng khí, không bí bách",
      "Có hỗ trợ chuyên viên mang thước đến tận văn phòng lấy số đo",
      "Tặng kèm nơ cài hoặc cà vạt lụa thêu logo doanh nghiệp"
    ],
    description: "Bộ vest đồng phục công sở cao cấp dành cho ban lãnh đạo, cấp quản lý và nhân sự ngoại giao."
  },
  {
    id: "huni-golf-dryfit",
    title: "Set Đồng Phục Golf & Pickleball HUNI AeroCool Pro",
    sku: "HN-GOLF-01",
    category: "sport_golf",
    badge: "Xu Hướng 2026",
    rating: 5.0,
    reviewsCount: 112,
    soldCount: "6,500+",
    image: "/images/uniform_sport_golf.jpg",
    gallery: ["/images/uniform_sport_golf.jpg", "/images/uniform_polo_corporate.jpg"],
    price: 295000,
    originalPrice: 380000,
    unit: "chiếc / set",
    wholesaleTiers: [
      { min: 10, max: 30, price: 295000, label: "10 - 30 áo" },
      { min: 31, max: 70, price: 255000, label: "31 - 70 áo" },
      { min: 71, max: 150, price: 225000, label: "71 - 150 áo" },
      { min: 151, max: 9999, price: 195000, label: "Từ 151 áo trở lên" }
    ],
    material: "Poly Spandex Dệt Lỗ Thông Hơi Chống Tia UV UPF 50+",
    colors: [
      { name: "Xanh Emerald & Navy", code: "#15803D" },
      { name: "Navy Phối Trắng", code: "#1E3A8A" },
      { name: "Trắng Phối Xanh Mint", code: "#10B981" }
    ],
    sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
    features: [
      "Công nghệ làm mát AeroCool hạ nhiệt cơ thể 3°C ngay lập tức",
      "Độ đàn hồi co giãn 4 chiều siêu linh hoạt cho cú swing chuẩn xác",
      "Chống nắng tia cực tím UPF 50+ bảo vệ làn da ngoài trời",
      "Khô nhanh chỉ sau 15 phút, không đọng bệt mồ hôi",
      "Công nghệ in chuyển nhiệt 4K sắc nét không bao giờ bong tróc"
    ],
    description: "Dòng sản phẩm chuyên biệt cho các giải đấu Golf doanh nghiệp, câu lạc bộ Pickleball, giải chạy Marathon."
  },
  {
    id: "huni-school-elite",
    title: "Bộ Đồng Phục Học Sinh & Giáo Viên HUNI Elite School",
    sku: "HN-SCH-01",
    category: "school",
    badge: "Chuẩn Quốc Tế",
    rating: 4.9,
    reviewsCount: 84,
    soldCount: "18,900+",
    image: "/images/uniform_school_students.jpg",
    gallery: ["/images/uniform_school_students.jpg", "/images/uniform_corporate_suits.jpg"],
    price: 320000,
    originalPrice: 420000,
    unit: "bộ (Áo + Váy / Quần tây)",
    wholesaleTiers: [
      { min: 30, max: 99, price: 320000, label: "30 - 99 bộ" },
      { min: 100, max: 299, price: 275000, label: "100 - 299 bộ" },
      { min: 300, max: 999, price: 235000, label: "300 - 999 bộ" },
      { min: 1000, max: 9999, price: 195000, label: "Từ 1,000 bộ trở lên" }
    ],
    material: "Kate Nhật Kháng Khuẩn & Kaki Tuyết Mưa Chống Nhăn",
    colors: [
      { name: "Navy & Xám Ghi Thanh Lịch", code: "#1E293B" },
      { name: "Xanh Coban & Trắng Sữa", code: "#2563EB" }
    ],
    sizes: ["Số 1", "Số 2", "Số 3", "Số 4", "Số 5", "S", "M", "L", "XL", "May đo"],
    features: [
      "Vải mềm mại êm dịu cho làn da học sinh, thấm mồ hôi cực tốt",
      "Váy xếp ly có quần lót an toàn bên trong cho nữ sinh",
      "Quần tây nam có tăng đơ chun co giãn thông minh ở cạp quần",
      "Huy hiệu logo trường thêu vi tính Tajima sắc sảo từng chi tiết",
      "Chống sờn rách, độ bền chịu được cả năm học vận động mạnh"
    ],
    description: "Bộ đồng phục học sinh và giáo viên liên cấp chuẩn phom dáng quốc tế."
  },
  {
    id: "huni-accessories-pack",
    title: "Bộ Phụ Kiện Doanh Nghiệp HUNI Branding VIP Pack",
    sku: "HN-ACC-01",
    category: "accessories",
    badge: "Quà Tặng Đối Tác",
    rating: 5.0,
    reviewsCount: 78,
    soldCount: "4,200+",
    image: "/images/uniform_accessories.jpg",
    gallery: ["/images/uniform_accessories.jpg", "/images/uniform_corporate_suits.jpg"],
    price: 145000,
    originalPrice: 195000,
    unit: "chiếc / món",
    wholesaleTiers: [
      { min: 20, max: 49, price: 145000, label: "20 - 49 món" },
      { min: 50, max: 99, price: 120000, label: "50 - 99 món" },
      { min: 100, max: 299, price: 95000, label: "100 - 299 món" },
      { min: 300, max: 9999, price: 79000, label: "Từ 300 món trở lên" }
    ],
    material: "Vải Kaki Cotton Nhung & Da PU Cao Cấp Khóa Vàng Kim",
    colors: [
      { name: "Navy Hoàng Gia", code: "#0B2042" },
      { name: "Đen Doanh Nhân", code: "#18181B" },
      { name: "Trắng Sứ", code: "#F8FAFC" }
    ],
    sizes: ["Free Size Tùy Chỉnh Khóa Đồng"],
    features: [
      "Mũ lưỡi trai thêu nổi 3D thương hiệu HUNI / Doanh nghiệp",
      "Cặp táp doanh nhân đựng laptop 14-15.6 inch chống sốc",
      "Túi giấy cao cấp ép kim nhũ vàng trao tặng sự kiện",
      "Cà vạt dệt thoi gân chìm sang trọng kèm hộp quà nắp nam châm",
      "Nhận khắc tên cá nhân và logo công ty theo yêu cầu"
    ],
    description: "Giải pháp quà tặng doanh nghiệp và phụ kiện đồng bộ nhận diện thương hiệu."
  },
  {
    id: "huni-shirt-bamboo",
    title: "Áo Sơ Mi Công Sở Sợi Tre Bamboo Kháng Khuẩn HUNI Executive",
    sku: "HN-SHIRT-02",
    category: "corporate",
    badge: "Chống Nhăn Tự Nhiên",
    rating: 4.9,
    reviewsCount: 132,
    soldCount: "9,800+",
    image: "/images/uniform_corporate_suits.jpg",
    gallery: ["/images/uniform_corporate_suits.jpg", "/images/uniform_polo_corporate.jpg"],
    price: 245000,
    originalPrice: 320000,
    unit: "chiếc",
    wholesaleTiers: [
      { min: 10, max: 49, price: 245000, label: "10 - 49 áo" },
      { min: 50, max: 99, price: 215000, label: "50 - 99 áo" },
      { min: 100, max: 299, price: 185000, label: "100 - 299 áo" },
      { min: 300, max: 9999, price: 160000, label: "Từ 300 áo trở lên" }
    ],
    material: "Vải Sợi Tre Bamboo Sinh Thái 65% Bamboo + 35% Cotton Kháng Khuẩn",
    colors: [
      { name: "Trắng Sơ Mi Chuẩn", code: "#FFFFFF" },
      { name: "Xanh Da Trời Nhạt", code: "#BAE6FD" },
      { name: "Xanh Kẻ Tăm Navy", code: "#1E3A8A" }
    ],
    sizes: ["38", "39", "40", "41", "42", "43", "May đo"],
    features: [
      "Công nghệ dệt chống nhăn Non-Iron, giặt xong phơi khô mặc ngay",
      "Sợi tre có tính năng tự kháng khuẩn và khử mùi mồ hôi",
      "Khuy áo ngọc trai cao cấp dập chìm thương hiệu",
      "Form slimfit và regular fit cho cả nam và nữ",
      "Thêu logo nhỏ tinh tế ở măng sét cổ tay hoặc ngực áo"
    ],
    description: "Chiếc áo sơ mi đồng phục công sở không thể thiếu cho dân văn phòng và nhân viên kinh doanh."
  }
];