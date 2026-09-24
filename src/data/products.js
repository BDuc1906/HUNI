// Dữ liệu sản phẩm, thông tin thương hiệu HUNI UNIFORM - HDC GROUP VN

export const BRAND_INFO = {
  brandName: "HUNI UNIFORM",
  parentCompany: "HDC GROUP VN",
  brandSubtitle: "Đồng Phục Doanh Nghiệp & May Đo Cao Cấp",
  slogan: "HUNI - Đồng hành cùng doanh nghiệp, nâng tầm thương hiệu qua từng bộ đồng phục!",
  ceo: {
    name: "Bà Nguyễn Thị Thương",
    title: "Founder & CEO HDC GROUP VN / HUNI UNIFORM",
    image: "/images/ceo_portrait.jpg",
    experience: "Gần 10 năm kinh nghiệm trong ngành dệt may & thiết kế đồng phục",
    bio: "Với gần 10 năm kinh nghiệm, HUNI là đơn vị chuyên thiết kế và sản xuất đồng phục theo yêu cầu cho doanh nghiệp, tổ chức và trường học. Sở hữu đội ngũ tay nghề cao cùng hệ thống sản xuất hiện đại, HUNI đáp ứng linh hoạt từ đơn hàng nhỏ đến số lượng lớn, đồng hành cùng khách hàng từ tư vấn, thiết kế đến sản xuất và giao hàng."
  },
  contact: {
    hotline: "0984.959.586",
    hotlineDisplay: "0984.959.586",
    hotlineRaw: "0984959586",
    zalo: "0984959586",
    email: "dongphuchuni@gmail.com",
    headquarters: "LK - 17 Dự án Dạ Hợp 6 tầng, Phường Hòa Bình, Tỉnh Phú Thọ",
    branchHanoi: "Khu đô thị An Khánh, TP. Hà Nội",
    factory: "Xưởng may HUNI Uniform 2.500m², KCN Thụy Vân, TP. Việt Trì, Phú Thọ"
  },
  bankInfo: {
    bankName: "MB Bank (Ngân hàng Quân Đội)",
    accountNumber: "0984959586",
    accountHolder: "NGUYEN THI THUONG - HDC GROUP VN",
    branch: "Chi nhánh Hà Nội / Phú Thọ"
  },
  commitments: [
    {
      id: "quality",
      title: "Chất Lượng Vượt Trội",
      desc: "Chất liệu vải cao cấp nhập khẩu, sợi kháng khuẩn, bền màu sau 100 lần giặt, co giãn 4 chiều.",
      icon: "ShieldCheck"
    },
    {
      id: "design",
      title: "Thiết Kế Độc Quyền",
      desc: "Miễn phí thiết kế 2D/3D theo bộ nhận diện thương hiệu, may mẫu thử duyệt form trước khi may đồng loạt.",
      icon: "Sparkles"
    },
    {
      id: "tailoring",
      title: "May Đo Chuyên Nghiệp",
      desc: "Đội ngũ thợ may hơn 15 năm kinh nghiệm, hỗ trợ chuyên viên đến tận văn phòng đo đạc từng nhân sự.",
      icon: "Scissors"
    },
    {
      id: "price",
      title: "Giá Cả Cạnh Tranh",
      desc: "Sản xuất trực tiếp tại xưởng không qua trung gian, chiết khấu sỉ cực cao cho đơn hàng doanh nghiệp.",
      icon: "BadgePercent"
    },
    {
      id: "delivery",
      title: "Giao Hàng Đúng Hẹn",
      desc: "Hệ thống sản xuất 50.000 sản phẩm/tháng, cam kết đúng tiến độ giao hàng trên toàn quốc.",
      icon: "Truck"
    },
    {
      id: "warranty",
      title: "Đồng Hành Lâu Dài",
      desc: "Bảo hành 1 đổi 1 trong 30 ngày cho các lỗi đường kim, mũi chỉ, hình in thêu. Hỗ trợ may bổ sung trọn đời.",
      icon: "HeartHandshake"
    }
  ],
  stats: [
    { value: "10+", label: "Năm Kinh Nghiệm", sub: "Khẳng định vị thế dẫn đầu" },
    { value: "50,000+", label: "Doanh Nghiệp Tin Tưởng", sub: "Trên khắp 63 tỉnh thành" },
    { value: "500,000+", label: "Bộ Đồng Phục / Năm", sub: "Công suất xưởng hiện đại" },
    { value: "99.8%", label: "Khách Hàng Hài Lòng", sub: "Tỷ lệ tái đặt hàng trên 85%" }
  ]
};

export const CATEGORIES = [
  {
    id: "all",
    name: "Tất Cả Sản Phẩm",
    slug: "all",
    count: 12
  },
  {
    id: "corporate",
    name: "Đồng Phục Doanh Nghiệp",
    slug: "dong-phuc-doanh-nghiep",
    icon: "Briefcase",
    desc: "Áo polo cao cấp, sơ mi công sở chuẩn form, nâng tầm uy tín doanh nghiệp",
    image: "/images/uniform_polo_corporate.jpg",
    count: 4
  },
  {
    id: "bespoke_suit",
    name: "Đồng Phục May Đo & Vest Lãnh Đạo",
    slug: "dong-phuc-may-do",
    icon: "Crown",
    desc: "Bespoke Vest cao cấp, đầm công sở, đo ni đóng giày từng nhân sự",
    image: "/images/uniform_corporate_suits.jpg",
    count: 3
  },
  {
    id: "sport_golf",
    name: "Đồng Phục Thể Thao & Golf",
    slug: "dong-phuc-the-thao",
    icon: "Activity",
    desc: "Giải Golf, Pickleball, Marathon, Teambuilding năng động, vải Dry-fit thoáng mát",
    image: "/images/uniform_sport_golf.jpg",
    count: 3
  },
  {
    id: "school",
    name: "Đồng Phục Trường Học",
    slug: "dong-phuc-truong-hoc",
    icon: "GraduationCap",
    desc: "Học sinh các cấp, sinh viên, giáo viên, chuẩn nề nếp thanh lịch",
    image: "/images/uniform_school_students.jpg",
    count: 2
  },
  {
    id: "accessories",
    name: "Phụ Kiện Doanh Nghiệp",
    slug: "phu-kien-doanh-nghiep",
    icon: "PackageCheck",
    desc: "Mũ nón thêu 3D, cặp da, túi quà tặng thương hiệu, cà vạt lụa",
    image: "/images/uniform_accessories.jpg",
    count: 2
  }
];

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
    gallery: [
      "/images/uniform_polo_corporate.jpg",
      "/images/uniform_corporate_suits.jpg",
      "/images/uniform_accessories.jpg"
    ],
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
    description: "Dòng áo polo đồng phục doanh nghiệp cao cấp được HUNI thiết kế riêng cho các công ty, tập đoàn muốn xây dựng hình ảnh chuyên nghiệp, năng động và chỉn chu. Đường may giấu chỉ 5 kim chuẩn xuất khẩu mang lại độ bền vượt trội."
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
    gallery: [
      "/images/uniform_corporate_suits.jpg",
      "/images/ceo_portrait.jpg",
      "/images/uniform_accessories.jpg"
    ],
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
    description: "Bộ vest đồng phục công sở cao cấp dành cho ban lãnh đạo, cấp quản lý và nhân sự ngoại giao. Sản phẩm thể hiện đẳng cấp thương hiệu và sự trân trọng đối với đối tác."
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
    gallery: [
      "/images/uniform_sport_golf.jpg",
      "/images/uniform_polo_corporate.jpg"
    ],
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
    description: "Dòng sản phẩm chuyên biệt cho các giải đấu Golf doanh nghiệp, câu lạc bộ Pickleball, giải chạy Marathon và các sự kiện team-building đẳng cấp của công ty."
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
    gallery: [
      "/images/uniform_school_students.jpg",
      "/images/uniform_corporate_suits.jpg"
    ],
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
    description: "Bộ đồng phục học sinh và giáo viên liên cấp chuẩn phom dáng quốc tế. Thiết kế mang lại vẻ đẹp tri thức, thanh lịch và niềm tự hào về ngôi trường cho các em học sinh."
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
    gallery: [
      "/images/uniform_accessories.jpg",
      "/images/uniform_corporate_suits.jpg"
    ],
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
    description: "Giải pháp quà tặng doanh nghiệp và phụ kiện đồng bộ nhận diện thương hiệu. Hoàn hảo cho các dịp kỷ niệm thành lập, tri ân khách hàng và sự kiện cổ đông."
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
    gallery: [
      "/images/uniform_corporate_suits.jpg",
      "/images/uniform_polo_corporate.jpg"
    ],
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
    description: "Chiếc áo sơ mi đồng phục công sở không thể thiếu cho dân văn phòng và nhân viên kinh doanh. Giúp cả đội ngũ luôn giữ được sự tươi mới, lịch lãm trong suốt 8 tiếng làm việc."
  }
];

export const FABRIC_COMPARISONS = [
  {
    name: "Bamboo Sợi Tre Tự Nhiên",
    features: "Kháng khuẩn 99.8%, mềm mướt như lụa, hạ nhiệt 3°C, chống tia UV",
    usage: "Áo sơ mi công sở cao cấp, áo thun doanh nhân",
    shrinkage: "Gần như không co rút (<0.5%)",
    durability: "★★★★★",
    breathability: "★★★★★"
  },
  {
    name: "Cotton Compact 100%",
    features: "Sợi bông dài chải kỹ, không xơ lông, thấm hút mồ hôi tối đa",
    usage: "Áo polo doanh nghiệp, áo đồng phục sự kiện",
    shrinkage: "Ổn định với công nghệ xử lý nhiệt",
    durability: "★★★★★",
    breathability: "★★★★★"
  },
  {
    name: "Pique Mắt Chim Thể Thao",
    features: "Cấu trúc dệt tổ ong 3D tạo rãnh thoát khí, co giãn 4 chiều",
    usage: "Đồng phục Golf, Pickleball, Áo thể thao",
    shrinkage: "Không nhăn, không bai dão",
    durability: "★★★★★",
    breathability: "★★★★★"
  },
  {
    name: "Kate Ý & Kate Mỹ",
    features: "Bề mặt phẳng mịn sang trọng, không xù lông, đứng form áo",
    usage: "Áo sơ mi văn phòng, đồng phục ngân hàng",
    shrinkage: "Chuẩn form sau nhiều lần giặt",
    durability: "★★★★☆",
    breathability: "★★★★☆"
  },
  {
    name: "Cashmere Wool Nhập Khẩu",
    features: "Chất len mịn ấm mùa đông, thoáng mùa hè, giữ phom ve áo đứng",
    usage: "Bộ Vest doanh nhân, quần âu, chân váy cao cấp",
    shrinkage: "Chống nhăn tuyệt đối",
    durability: "★★★★★",
    breathability: "★★★★☆"
  }
];

export const PROCESS_STEPS = [
  {
    step: "01",
    title: "Tiếp Nhận & Tư Vấn Mẫu",
    desc: "Chuyên viên HUNI lắng nghe nhu cầu, định vị phong cách và tư vấn chất liệu vải phù hợp với ngân sách.",
    icon: "PhoneCall"
  },
  {
    step: "02",
    title: "Thiết Kế 3D & May Mẫu Thử 0đ",
    desc: "Lên bản vẽ phối màu 3D chuẩn nhận diện. May 01 bộ áo mẫu thực tế gửi tận tay khách duyệt form và chất vải.",
    icon: "Palette"
  },
  {
    step: "03",
    title: "Đo Ni Hoặc Chọn Size Chuẩn",
    desc: "Chuyên viên mang bộ size hoặc đến tận nơi lấy số đo cho từng nhân viên, đảm bảo vừa vặn 100%.",
    icon: "Ruler"
  },
  {
    step: "04",
    title: "Sản Xuất Chuyền May Hiện Đại",
    desc: "Cắt laser tự động, in pet kỹ thuật số hoặc thêu vi tính Tajima Nhật Bản trên dây chuyền 50.000 sp/tháng.",
    icon: "Factory"
  },
  {
    step: "05",
    title: "KCS Kiểm Định & Giao Tận Nơi",
    desc: "Kiểm tra từng đường may, ủi hơi nước, đóng gói hộp VIP và giao hàng tận nơi. Bảo hành 1 đổi 1 trong 30 ngày.",
    icon: "CheckCircle2"
  }
];

export const TESTIMONIALS = [
  {
    name: "Ông Trần Mạnh Hùng",
    role: "Giám Đốc Nhân Sự - Tập Đoàn Bất Động Sản CenGroup",
    content: "Chúng tôi đã hợp tác cùng HUNI Uniform hơn 4 năm cho hơn 1.200 nhân sự. Chất vải polo Pique rất mát, đường may chuẩn chỉ và logo thêu sắc nét từng chi tiết. Dịch vụ chăm sóc của chị Thương và đội ngũ rất tận tâm!",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    rating: 5,
    location: "Hà Nội"
  },
  {
    name: "Bà Lê Hoàng Yến",
    role: "Phó Hiệu Trưởng - Hệ Thống Trường Song Ngữ Quốc Tế",
    content: "Đồng phục học sinh của HUNI rất được phụ huynh và các em học sinh khen ngợi. Vải mềm, an toàn, váy có may lớp quần bảo hộ kín đáo. Xưởng giao hàng trước ngày khai giảng 1 tuần rất đúng hẹn.",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    rating: 5,
    location: "Phú Thọ"
  },
  {
    name: "Anh Vũ Đình Tuấn",
    role: "Chủ Tịch CLB Golf Doanh Nhân Hà Nội",
    content: "Áo thể thao Golf của HUNI mặc đánh giải 18 hố dưới trời nắng vẫn cực kỳ thoáng mát và dễ chịu. Logo thêu nổi 3D nhìn cực sang trọng. Giá cả tận xưởng rất tốt so với chất lượng nhận được.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    rating: 5,
    location: "Hà Nội"
  }
];

export const FAQS = [
  {
    q: "HUNI có nhận may số lượng ít cho doanh nghiệp nhỏ không?",
    a: "Có! HUNI nhận may linh hoạt từ số lượng nhỏ chỉ từ 10 - 20 áo cho các công ty khởi nghiệp, văn phòng nhỏ, đồng thời đáp ứng các đơn hàng quy mô lớn từ hàng nghìn đến hàng chục nghìn áo cho các tập đoàn."
  },
  {
    q: "Tôi có được thiết kế mẫu và may áo mẫu thử trước khi đặt hàng không?",
    a: "Chắc chắn có! HUNI hỗ trợ 100% chi phí thiết kế mẫu 2D/3D theo nhận diện thương hiệu của quý khách và may 01 áo mẫu thực tế để quý công ty duyệt trực tiếp chất vải, form áo và màu sắc trước khi sản xuất hàng loạt."
  },
  {
    q: "Thời gian may và giao hàng mất bao lâu?",
    a: "Thời gian may mẫu từ 1 - 2 ngày làm việc. Thời gian sản xuất hàng loạt từ 3 - 7 ngày tùy theo số lượng và yêu cầu in/thêu. Trong trường hợp cần gấp cho sự kiện, khai trương, HUNI có gói hỗ trợ hỏa tốc trong 48 - 72 giờ."
  },
  {
    q: "Công ty có cử người đến lấy số đo trực tiếp tại văn phòng không?",
    a: "Đối với dòng sản phẩm may đo cao cấp (như Vest lãnh đạo, Sơ mi bespoke, Quần âu/chân váy), HUNI có đội ngũ chuyên viên đo đạc mang thước và bảng vải mẫu đến tận văn phòng quý công ty để lấy số đo chuẩn xác cho từng nhân sự."
  },
  {
    q: "Chính sách bảo hành và đổi trả của HUNI như thế nào?",
    a: "HUNI cam kết bảo hành 1 đổi 1 miễn phí trong vòng 30 ngày nếu sản phẩm có bất kỳ lỗi nào về đường may, rách sợi, sai màu sắc hoặc bong tróc hình in/thêu so với mẫu đã duyệt. Hỗ trợ may bổ sung số lượng ít trọn đời khi quý công ty có nhân viên mới."
  }
];
