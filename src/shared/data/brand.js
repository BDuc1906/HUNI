// ==================================================
// src/shared/data/brand.js
// HUNI = Công ty | HDC FASHION = Thương hiệu
// Địa chỉ cập nhật theo địa giới mới (2025)
// ==================================================

export const BRAND_INFO = {
  // ============================================
  // THƯƠNG HIỆU (hiển thị chính trên web)
  // ============================================
  brandName: "HDC FASHION",
  brandSubtitle: "Đồng Phục Doanh Nghiệp & May Đo Cao Cấp",
  slogan: "Phong cách tạo thành công",

  // ============================================
  // CÔNG TY & TẬP ĐOÀN
  // ============================================
  companyName: "HUNI UNIFORM",
  companyFullName: "CÔNG TY HUNI UNIFORM",
  parentCompany: "HDC GROUP VN",
  brandRelationship:
    "HDC FASHION là thương hiệu đồng phục cao cấp thuộc HUNI UNIFORM",

  // ============================================
  // CEO
  // ============================================
  ceo: {
    name: "Bà Nguyễn Thị Thương",
    title: "Founder & CEO HUNI UNIFORM",
    image: "/images/CEO.jpg",
    banner: "/images/tmht.jpg",
    experience:
      "Gần 10 năm kinh nghiệm trong ngành dệt may & thiết kế đồng phục",
    bio: "Với gần 10 năm kinh nghiệm, HUNI UNIFORM là đơn vị chuyên thiết kế và sản xuất đồng phục theo yêu cầu cho doanh nghiệp, tổ chức và trường học. Sở hữu đội ngũ tay nghề cao cùng hệ thống sản xuất hiện đại, HDC FASHION (thương hiệu thuộc HUNI UNIFORM) đáp ứng linh hoạt từ đơn hàng nhỏ đến số lượng lớn, đồng hành cùng khách hàng từ tư vấn, thiết kế đến sản xuất và giao hàng.",
  },

  // ============================================
  // LIÊN HỆ
  // ============================================
  contact: {
    hotline: "0984.959.586",
    hotlineDisplay: "0984.959.586",
    hotlineRaw: "0984959586",
    website: "hdcfashion.vn",
    zalo: "0984959586",
    email: "dongphuchuni@gmail.com",
    headquarters:
      "LK - 17 Dự án Dạ Hợp 6 tầng, Phường Hòa Bình, Tỉnh Phú Thọ",
    branchHanoi: "Khu đô thị An Khánh, TP Hà Nội",
    factory:
      "Xưởng may HDC Fashion 2.500m², KCN Thụy Vân, TP. Việt Trì, Phú Thọ",
  },

  // ============================================
  // NGÂN HÀNG
  // ============================================
  bankInfo: {
    bankName: "MB Bank (Ngân hàng Quân Đội)",
    accountNumber: "0984959586",
    accountHolder: "NGUYEN THI THUONG - HDC GROUP VN",
    branch: "Chi nhánh Hà Nội / Phú Thọ",
  },

  // ============================================
  // CAM KẾT — 4 lợi ích chính theo banner chính thức
  // ============================================
  commitments: [
    {
      id: "quality",
      title: "Chất Lượng Vượt Trội",
      desc: "Chất liệu vải cao cấp nhập khẩu, sợi kháng khuẩn, bền màu sau 100 lần giặt, co giãn 4 chiều.",
      icon: "ShieldCheck",
    },
    {
      id: "design",
      title: "Thiết Kế Độc Quyền",
      desc: "Miễn phí thiết kế 2D/3D theo bộ nhận diện thương hiệu, may mẫu thử duyệt form trước khi may đồng loạt.",
      icon: "Sparkles",
    },
    {
      id: "price",
      title: "Giá Cả Cạnh Tranh",
      desc: "Sản xuất trực tiếp tại xưởng không qua trung gian, chiết khấu sỉ cực cao cho đơn hàng doanh nghiệp.",
      icon: "BadgePercent",
    },
    {
      id: "service",
      title: "Dịch Vụ Tận Tâm",
      desc: "Hỗ trợ chuyên viên đến tận văn phòng đo đạc, tư vấn chất liệu, may bổ sung trọn đời khi có nhân sự mới.",
      icon: "HeartHandshake",
    },
    // ===== Cam kết bổ sung (giữ lại từ bản cũ) =====
    {
      id: "revision",
      title: "Sửa Mẫu Không Giới Hạn",
      desc: "Không giới hạn số lần sửa chữa mẫu thiết kế cho đến khi quý doanh nghiệp hoàn toàn hài lòng.",
      icon: "RefreshCw",
    },
    {
      id: "delivery",
      title: "Giao Hàng Miễn Phí",
      desc: "Miễn phí giao hàng toàn quốc cho mọi đơn hàng, đúng tiến độ cam kết.",
      icon: "Truck",
    },
    {
      id: "partner",
      title: "Đồng Hành Lâu Dài",
      desc: "Hợp tác với nhiều đơn vị, doanh nghiệp lớn. Bảo hành 1 đổi 1 trong 30 ngày, hỗ trợ may bổ sung trọn đời.",
      icon: "HeartHandshake",
    },
  ],

  // ============================================
  // STATS — Bỏ số liệu không có bằng chứng
  // ============================================
  stats: [
    {
      value: "Gần 10",
      label: "Năm Kinh Nghiệm",
      sub: "Đồng hành cùng doanh nghiệp",
    },
    {
      value: "2.500m²",
      label: "Xưởng Sản Xuất",
      sub: "KCN Thụy Vân, Phú Thọ",
    },
    {
      value: "Nhiều",
      label: "Doanh Nghiệp Đối Tác",
      sub: "Trên toàn quốc",
    },
    {
      value: "Toàn quốc",
      label: "Phạm Vi Giao Hàng",
      sub: "Miễn phí vận chuyển",
    },
  ],
};