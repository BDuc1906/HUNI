<div align="center">

<img src="./public/images/logo.png" alt="HUNI UNIFORM Logo" width="120" height="120" />

# 🎨 HUNI UNIFORM

### Đồng Phục Doanh Nghiệp Cao Cấp — Nâng Tầm Thương Hiệu Việt

[![Next.js](https://img.shields.io/badge/Next.js-16.3.6-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19.2.8-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Prisma](https://img.shields.io/badge/Prisma-6.19-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://prisma.io)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://supabase.com)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)

[![License](https://img.shields.io/badge/License-Private-red?style=flat-square)](./LICENSE)
[![Status](https://img.shields.io/badge/Status-Production-success?style=flat-square)](https://huniuniform.vn)
[![Website](https://img.shields.io/badge/Website-huniuniform.vn-gold?style=flat-square&logo=googlechrome&logoColor=white)](https://huniuniform.vn)

---

**Website thương mại điện tử chuyên nghiệp cho thương hiệu đồng phục doanh nghiệp HUNI UNIFORM — thuộc HDC GROUP VN.**

[Tính Năng](#-tính-năng-chính) •
[Công Nghệ](#-công-nghệ-sử-dụng) •
[Cài Đặt](#-cài-đặt--chạy-local) •
[Deploy](#-deploy-lên-vercel) •
[Cấu Trúc](#-cấu-trúc-thư-mục) •
[Liên Hệ](#-liên-hệ)

</div>

---

## 🌟 Giới Thiệu

**HUNI UNIFORM** là nền tảng thương mại điện tử chuyên nghiệp được phát triển bởi **HDC GROUP VN** — đơn vị tiên phong trong lĩnh vực thiết kế và sản xuất đồng phục doanh nghiệp cao cấp tại Việt Nam. Với gần 10 năm kinh nghiệm, chúng tôi tự hào đồng hành cùng hàng ngàn doanh nghiệp, tổ chức và trường học trên khắp cả nước.

> 💡 **Sứ mệnh:** "Nâng tầm thương hiệu Việt qua từng bộ đồng phục — không chỉ là trang phục, mà là niềm tự hào và bản sắc của doanh nghiệp."

### 🏆 Điểm Nổi Bật

- 🎨 **Thiết kế độc quyền 3D** — Miễn phí 100% theo bộ nhận diện thương hiệu
- 👔 **Xưởng sản xuất 2.500m²** — Công suất 50.000 sản phẩm/tháng
- ✨ **Công nghệ Seamless** — Sơ mi không đường may độc quyền
- 🌿 **Chất liệu xanh bền vững** — Bạc hà, sen, chuối, tre, modal
- 🎁 **May mẫu thử 0đ** — Duyệt form trước khi sản xuất hàng loạt
- 🚚 **Miễn phí giao hàng toàn quốc** — Với mọi đơn hàng
- 🛡️ **Bảo hành 1 đổi 1** trong 30 ngày
- 📞 **Hotline 24/7:** [0984.959.586](tel:0984959586)

---

## ✨ Tính Năng Chính

### 🛒 Trải Nghiệm Mua Sắm

- [x] **Catalog sản phẩm thông minh** — Lọc theo 6 danh mục, giá, chất liệu, đánh giá
- [x] **Xem chi tiết sản phẩm** — Modal quick-view với bảng giá sỉ theo mốc số lượng
- [x] **Giỏ hàng Drawer** — Thêm/sửa/xóa sản phẩm tức thì, lưu localStorage
- [x] **Voucher & Khuyến mãi** — Hỗ trợ mã giảm giá `HUNI2026`, `DOANHNGHIEP`
- [x] **Checkout đa bước** — Thông tin doanh nghiệp, VAT, VietQR, đặt cọc 30%
- [x] **Tra cứu đơn hàng** — Theo mã đơn hoặc số điện thoại

### 🤖 Trợ Lý AI Thông Minh

- [x] **Chatbot Gemini AI** — Tư vấn sản phẩm tự động 24/7
- [x] **Fallback đa model** — Tự động chuyển Gemini 3.8 → 2.5 → Lite khi quá tải
- [x] **Context từ data thật** — Bot đọc toàn bộ catalog, bảng giá, chính sách

### 🎨 Công Cụ Tùy Biến

- [x] **Mô phỏng logo** — Upload logo công ty, xem trước vị trí in/thêu (ngực, lưng, tay)
- [x] **Chọn công nghệ in/thêu** — Tajima Nhật Bản hoặc In PET 4K
- [x] **Tư vấn chất liệu** — Bảng so sánh 9 loại vải chi tiết

### 👤 Tài Khoản Người Dùng

- [x] **Đăng ký / Đăng nhập** — NextAuth v5 với Credentials Provider
- [x] **Phân quyền** — Customer & Admin, bảo vệ route bằng middleware
- [x] **Quản lý đơn hàng** — Xem lịch sử đơn, trạng thái sản xuất
- [x] **Wishlist** — Lưu sản phẩm yêu thích

### 📧 Hệ Thống Email Tự Động

- [x] **Email thông báo đơn mới** — Gửi cho Admin với template HTML đẹp
- [x] **Email xác nhận cho khách** — Template branded navy & gold
- [x] **Gửi bất đồng bộ** — Không block response API

### 📱 Responsive & SEO

- [x] **Mobile-first design** — Hoạt động hoàn hảo trên mọi thiết bị
- [x] **Sticky header thông minh** — Menu categories dropdown trên desktop, drawer trên mobile
- [x] **SEO tối ưu** — Metadata động, sitemap.xml, robots.txt, JSON-LD schema
- [x] **Open Graph & Twitter Cards** — Chia sẻ mạng xã hội đẹp mắt
- [x] **Sitemap tự động** — Tích hợp Google Search Console

---

## 🚀 Công Nghệ Sử Dụng

### 🎯 Core Stack

<div align="center">

| Công nghệ | Phiên bản | Mục đích |
|:---:|:---:|:---|
| ![Next.js](https://img.shields.io/badge/Next.js-16.3.6-000000?logo=nextdotjs) | `16.3.6` | Framework chính (App Router, Turbopack) |
| ![React](https://img.shields.io/badge/React-19.2.8-61DAFB?logo=react&logoColor=black) | `19.2.8` | UI Library |
| ![TypeScript](https://img.shields.io/badge/JavaScript-ES2024-F7DF1E?logo=javascript&logoColor=black) | `ES2024` | Ngôn ngữ chính |
| ![TailwindCSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss) | `v4` | CSS Framework |

</div>

### 💾 Database & ORM

<div align="center">

| Công nghệ | Phiên bản | Mục đích |
|:---:|:---:|:---|
| ![Prisma](https://img.shields.io/badge/Prisma-6.19-2D3748?logo=prisma) | `6.19.3` | ORM hiện đại, type-safe |
| ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-4169E1?logo=postgresql) | `15+` | Database chính |
| ![Supabase](https://img.shields.io/badge/Supabase-Cloud-3ECF8E?logo=supabase) | Cloud | Hosting database |

</div>

### 🔐 Authentication & Security

<div align="center">

| Công nghệ | Phiên bản | Mục đích |
|:---:|:---:|:---|
| ![NextAuth](https://img.shields.io/badge/NextAuth-v5_beta-000000?logo=auth0) | `5.0.0-beta.32` | Authentication |
| ![bcryptjs](https://img.shields.io/badge/bcryptjs-3.0-338033) | `3.0.3` | Hash password |
| ![Zod](https://img.shields.io/badge/Zod-4.6-3E67B1?logo=zod) | `4.6.5` | Schema validation |

</div>

### 🤖 AI & Services

<div align="center">

| Công nghệ | Mục đích |
|:---:|:---|
| ![Google Gemini](https://img.shields.io/badge/Gemini_AI-3.8_Flash-4285F4?logo=google) | Chatbot tư vấn tự động |
| ![Resend](https://img.shields.io/badge/Resend-Email_API-000000) | Gửi email transactional |
| ![VietQR](https://img.shields.io/badge/VietQR-Payment-005BAA) | Thanh toán chuyển khoản |

</div>

### 🎨 UI & Icons

<div align="center">

| Công nghệ | Mục đích |
|:---:|:---|
| ![Lucide](https://img.shields.io/badge/Lucide_Icons-1.48-F56565?logo=lucide) | Bộ icon SVG hiện đại |
| ![Confetti](https://img.shields.io/badge/canvas--confetti-1.9-FF6B6B) | Hiệu ứng celebration |
| ![Next Font](https://img.shields.io/badge/Plus_Jakarta_Sans-Google_Fonts-4285F4?logo=googlefonts) | Typography chính |

</div>

### 🛠️ Development Tools

<div align="center">

| Công nghệ | Mục đích |
|:---:|:---|
| ![ESLint](https://img.shields.io/badge/ESLint-9-4B32C3?logo=eslint) | Linting code |
| ![PostCSS](https://img.shields.io/badge/PostCSS-8-DD3A0A?logo=postcss) | CSS processing |
| ![Git](https://img.shields.io/badge/Git-Version_Control-F05032?logo=git) | Quản lý phiên bản |

</div>

---

## 📦 Cài Đặt & Chạy Local

### 📋 Yêu Cầu Hệ Thống

- ![Node.js](https://img.shields.io/badge/Node.js-20+-339933?logo=nodedotjs) **Node.js** ≥ 20.x
- ![npm](https://img.shields.io/badge/npm-10+-CB3837?logo=npm) **npm** ≥ 10.x
- ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-4169E1?logo=postgresql) **PostgreSQL** ≥ 15 (hoặc Supabase account)

### 🚀 Các Bước Cài Đặt

#### 1️⃣ Clone repository

```bash
git clone https://github.com/your-username/huni-uniform.git
cd huni-uniform