"use client";

import React, { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import {
  Loader2,
  Mail,
  Lock,
  User,
  Phone,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Star,
  Headphones,
  Shirt,
  Clock,
} from "lucide-react";

export default function AuthSlidingDualPanel({ defaultMode = "login" }) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-900 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
        </div>
      }
    >
      <AuthSlidingDualPanelInner defaultMode={defaultMode} />
    </Suspense>
  );
}

function AuthSlidingDualPanelInner({ defaultMode = "login" }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  const registeredParam = searchParams.get("registered") === "1";

  // Mode: "login" hoặc "register"
  const [mode, setMode] = useState(defaultMode);

  // Sync mode khi defaultMode thay đổi
  useEffect(() => {
    if (defaultMode) setMode(defaultMode);
  }, [defaultMode]);

  const switchMode = (newMode) => {
    if (newMode === mode) return;
    setMode(newMode);
    const newUrl = newMode === "register" ? "/register" : "/login";
    window.history.replaceState(null, "", newUrl);
  };

  // ==========================================
  // STATE: FORM ĐĂNG NHẬP
  // ==========================================
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(registeredParam);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);

    try {
      const result = await signIn("credentials", {
        email: loginEmail,
        password: loginPassword,
        redirect: false,
      });

      if (result?.error) {
        setLoginError("Email hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại.");
      } else {
        router.push(redirect);
        router.refresh();
      }
    } catch (err) {
      setLoginError("Có lỗi kết nối xảy ra. Vui lòng thử lại sau.");
    } finally {
      setLoginLoading(false);
    }
  };

  // ==========================================
  // STATE: FORM ĐĂNG KÝ
  // ==========================================
  const [regFullName, setRegFullName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState("");

  const getPasswordStrength = () => {
    if (!regPassword) return { level: 0, label: "", color: "bg-slate-200", textColor: "text-slate-400" };
    if (regPassword.length < 6) {
      return { level: 1, label: "Tối thiểu 6 ký tự", color: "bg-rose-500", textColor: "text-rose-500" };
    }
    const hasNum = /\d/.test(regPassword);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(regPassword);
    if (regPassword.length >= 8 && (hasNum || hasSpecial)) {
      return { level: 3, label: "Bảo mật rất cao", color: "bg-emerald-500", textColor: "text-emerald-600" };
    }
    return { level: 2, label: "Trung bình", color: "bg-amber-500", textColor: "text-amber-500" };
  };

  const strength = getPasswordStrength();

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setRegError("");

    if (regPassword.length < 6) {
      setRegError("Mật khẩu phải có tối thiểu 6 ký tự.");
      return;
    }
    if (!agreeTerms) {
      setRegError("Vui lòng đồng ý với Điều khoản dịch vụ và Chính sách bảo mật.");
      return;
    }

    setRegLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          fullName: regFullName,
          email: regEmail,
          phone: regPhone,
          password: regPassword,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        const details = data.details?.map((d) => d.message).join(" | ");
        setRegError(details ? `${data.error} — ${details}` : data.error);
        return;
      }

      setLoginEmail(regEmail);
      setLoginSuccess(true);
      switchMode("login");
    } catch (err) {
      setRegError("Không thể đăng ký lúc này. Vui lòng thử lại sau.");
    } finally {
      setRegLoading(false);
    }
  };

  return (
    <div className="min-h-screen sm:h-screen w-full bg-gradient-to-br from-slate-100 via-[#eef5f8] to-slate-200 flex flex-col justify-between p-3 sm:p-5 selection:bg-brand-500 selection:text-white relative overflow-x-hidden sm:overflow-hidden">
      {/* Ambient Glows */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-brand-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-400/10 rounded-full blur-[140px] pointer-events-none" />

      {/* =========================================================
          TOP ACTION BAR (Compact)
          ========================================================= */}
      <header className="w-full max-w-[1040px] mx-auto flex items-center justify-between py-1 relative z-30 shrink-0">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 hover:bg-white border border-slate-200 hover:border-brand-400 text-xs font-bold text-slate-700 hover:text-brand-800 shadow-xs transition-all duration-300 hover:scale-105 group backdrop-blur-md"
        >
          <div className="w-5 h-5 rounded-full bg-slate-100 group-hover:bg-brand-50 flex items-center justify-center transition-colors">
            <ArrowLeft className="w-3 h-3 text-brand-600 group-hover:-translate-x-0.5 transition-transform" />
          </div>
          <span>Về trang chủ</span>
        </Link>

        {/* Mobile Tab Switcher Toggle */}
        <div className="lg:hidden flex p-1 bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200 shadow-xs">
          <button
            type="button"
            onClick={() => switchMode("login")}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
              mode === "login"
                ? "bg-brand-600 text-white shadow-xs"
                : "text-slate-600 hover:text-brand-600"
            }`}
          >
            Đăng nhập
          </button>
          <button
            type="button"
            onClick={() => switchMode("register")}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
              mode === "register"
                ? "bg-brand-600 text-white shadow-xs"
                : "text-slate-600 hover:text-brand-600"
            }`}
          >
            Đăng ký
          </button>
        </div>

        {/* Hotline Contact */}
        <a
          href="tel:0984959586"
          className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 hover:bg-white border border-slate-200 hover:border-brand-400 text-xs font-semibold text-slate-700 hover:text-brand-700 shadow-xs transition-all duration-300 hover:scale-105 backdrop-blur-md"
        >
          <Headphones className="w-3.5 h-3.5 text-brand-600" />
          <span>Hotline: <strong className="text-brand-800 font-extrabold">0984.959.586</strong></span>
        </a>
      </header>

      {/* =========================================================
          MAIN SLIDING DUAL PANEL CONTAINER
          Chiều cao cố định 580px chuẩn mực, form căn giữa hoàn hảo
          ========================================================= */}
      <main className="w-full max-w-[1040px] mx-auto my-auto relative z-20 flex-1 flex items-center justify-center py-2">
        <div className="relative w-full h-[580px] lg:h-[600px] max-h-[calc(100vh-100px)] bg-white rounded-[32px] shadow-2xl shadow-slate-900/12 border border-white/80 overflow-hidden">
          
          {/* =========================================================
              PANEL 1: FORM ĐĂNG NHẬP (BÊN TRÁI 0 -> 50%)
              ========================================================= */}
          <div
            className={`absolute top-0 left-0 w-full lg:w-1/2 h-full p-8 lg:p-12 flex flex-col justify-center z-10 transition-all duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] ${
              mode === "login"
                ? "opacity-100 translate-x-0 pointer-events-auto"
                : "lg:opacity-0 lg:-translate-x-12 lg:pointer-events-none hidden lg:flex"
            }`}
          >
            <div className="max-w-[390px] mx-auto w-full">
              {/* Header Badge & Title */}
              <div className="mb-5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-800 text-[11px] font-bold mb-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
                  <span>Hệ Thống Quản Lý HDC Fashion</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Đăng Nhập Tài Khoản
                </h2>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Theo dõi đơn may mẫu, duyệt thiết kế &amp; nhận báo giá sỉ độc quyền.
                </p>
              </div>

              {/* Form Content */}
              <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                {loginSuccess && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-emerald-800 text-xs shadow-2xs animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-semibold text-xs">Đăng ký thành công! Hãy đăng nhập ngay.</span>
                  </div>
                )}

                {loginError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2.5 text-rose-800 text-xs shadow-2xs animate-in shake">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span className="font-semibold text-xs">{loginError}</span>
                  </div>
                )}

                {/* Email Field */}
                <div className="group">
                  <label className="text-xs font-bold text-slate-700 block mb-1.5 group-focus-within:text-brand-600 transition-colors">
                    Email Doanh Nghiệp / Cá Nhân
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      autoComplete="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="name@company.com"
                      disabled={loginLoading}
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50/70 hover:bg-white focus:bg-white border border-slate-200/90 hover:border-brand-400 focus:border-brand-600 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-brand-500/10 transition-all duration-200 disabled:opacity-60 placeholder:text-slate-400 shadow-2xs"
                    />
                    <Mail className="w-4 h-4 text-slate-400 group-hover:text-brand-500 group-focus-within:text-brand-600 absolute left-3 top-1/2 -translate-y-1/2 transition-colors pointer-events-none" />
                  </div>
                </div>

                {/* Password Field */}
                <div className="group">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-700 group-focus-within:text-brand-600 transition-colors">
                      Mật Khẩu
                    </label>
                    <a
                      href="tel:0984959586"
                      title="Hỗ trợ lấy lại mật khẩu"
                      className="text-[11px] font-semibold text-brand-600 hover:text-brand-800 hover:underline transition-colors"
                    >
                      Quên mật khẩu?
                    </a>
                  </div>
                  <div className="relative">
                    <input
                      type={showLoginPassword ? "text" : "password"}
                      required
                      autoComplete="current-password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      disabled={loginLoading}
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-50/70 hover:bg-white focus:bg-white border border-slate-200/90 hover:border-brand-400 focus:border-brand-600 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-brand-500/10 transition-all duration-200 disabled:opacity-60 placeholder:text-slate-400 shadow-2xs"
                    />
                    <Lock className="w-4 h-4 text-slate-400 group-hover:text-brand-500 group-focus-within:text-brand-600 absolute left-3 top-1/2 -translate-y-1/2 transition-colors pointer-events-none" />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-slate-100 transition-colors"
                      title={showLoginPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    >
                      {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600 hover:text-slate-900 group">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500 transition-colors cursor-pointer accent-brand-600"
                    />
                    <span className="text-xs font-medium group-hover:text-slate-900 transition-colors">
                      Ghi nhớ đăng nhập
                    </span>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loginLoading}
                  className="relative group overflow-hidden w-full py-3 px-5 rounded-xl font-extrabold text-xs sm:text-sm text-white bg-gradient-to-r from-[#003843] via-[#004f5e] to-[#007b8f] hover:from-[#00222a] hover:via-[#003843] hover:to-[#00677a] shadow-lg shadow-brand-900/15 hover:shadow-xl hover:shadow-brand-700/25 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer mt-2"
                >
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
                  {loginLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Đang xác thực thông tin...</span>
                    </>
                  ) : (
                    <>
                      <span>Đăng Nhập Vào Hệ Thống</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-200" />
                    </>
                  )}
                </button>
              </form>

              {/* Mobile Switch Link to Register */}
              <div className="pt-4 lg:hidden text-center text-xs text-slate-500 border-t border-slate-100 mt-4">
                Chưa có tài khoản?{" "}
                <button
                  type="button"
                  onClick={() => switchMode("register")}
                  className="text-brand-600 font-extrabold hover:underline"
                >
                  Đăng ký ngay
                </button>
              </div>

              {/* Badges Footnote */}
              <div className="hidden lg:grid grid-cols-3 gap-2 text-center text-[10px] text-slate-500 pt-5 mt-4 border-t border-slate-100">
                <div className="p-2 rounded-xl bg-slate-50/80 flex items-center justify-center gap-1.5 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                  <span>Bảo mật 100%</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-50/80 flex items-center justify-center gap-1.5 font-medium">
                  <Shirt className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                  <span>May mẫu 0đ</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-50/80 flex items-center justify-center gap-1.5 font-medium">
                  <Clock className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                  <span>Báo giá 15p</span>
                </div>
              </div>
            </div>
          </div>

          {/* =========================================================
              PANEL 2: FORM ĐĂNG KÝ (BÊN PHẢI 50% -> 100%)
              - Cân đối tuyệt đối, không tràn, không thô
              - Form căn giữa trục dọc hoàn hảo
              ========================================================= */}
          <div
            className={`absolute top-0 right-0 w-full lg:w-1/2 h-full p-8 lg:p-12 flex flex-col justify-center z-10 transition-all duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] ${
              mode === "register"
                ? "opacity-100 translate-x-0 pointer-events-auto"
                : "lg:opacity-0 lg:translate-x-12 lg:pointer-events-none hidden lg:flex"
            }`}
          >
            <div className="max-w-[400px] mx-auto w-full">
              {/* Header Badge & Title */}
              <div className="mb-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-800 text-[11px] font-bold mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Đặc Quyền Thành Viên Doanh Nghiệp 2026</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Tạo Tài Khoản Doanh Nghiệp
                </h2>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Đăng ký nhanh nhận may mẫu thử 0đ &amp; chiết khấu sỉ tận xưởng.
                </p>
              </div>

              {/* Form Content - Thiết kế 2 cột tinh tế, thanh thoát */}
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                {regError && (
                  <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2 text-rose-800 text-xs shadow-2xs animate-in shake">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span className="font-semibold text-xs">{regError}</span>
                  </div>
                )}

                {/* Hàng 1: Họ tên + Số điện thoại (2 Cột cân đối, thanh lịch) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="group">
                    <label className="text-xs font-bold text-slate-700 block mb-1.5 group-focus-within:text-brand-600 transition-colors">
                      Họ và Tên Quản Lý
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={regFullName}
                        onChange={(e) => setRegFullName(e.target.value)}
                        placeholder="Nguyễn Văn An"
                        disabled={regLoading}
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50/70 hover:bg-white focus:bg-white border border-slate-200/90 hover:border-brand-400 focus:border-brand-600 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-brand-500/10 transition-all duration-200 disabled:opacity-60 placeholder:text-slate-400 shadow-2xs"
                      />
                      <User className="w-3.5 h-3.5 text-slate-400 group-hover:text-brand-500 group-focus-within:text-brand-600 absolute left-3 top-1/2 -translate-y-1/2 transition-colors pointer-events-none" />
                    </div>
                  </div>

                  <div className="group">
                    <label className="text-xs font-bold text-slate-700 block mb-1.5 group-focus-within:text-brand-600 transition-colors">
                      Số Điện Thoại / Zalo
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        required
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        placeholder="0984.xxx.xxx"
                        disabled={regLoading}
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50/70 hover:bg-white focus:bg-white border border-slate-200/90 hover:border-brand-400 focus:border-brand-600 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-brand-500/10 transition-all duration-200 disabled:opacity-60 placeholder:text-slate-400 shadow-2xs"
                      />
                      <Phone className="w-3.5 h-3.5 text-slate-400 group-hover:text-brand-500 group-focus-within:text-brand-600 absolute left-3 top-1/2 -translate-y-1/2 transition-colors pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Hàng 2: Email Doanh Nghiệp */}
                <div className="group">
                  <label className="text-xs font-bold text-slate-700 block mb-1.5 group-focus-within:text-brand-600 transition-colors">
                    Email Doanh Nghiệp / Cá Nhân
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="email@company.com"
                      disabled={regLoading}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50/70 hover:bg-white focus:bg-white border border-slate-200/90 hover:border-brand-400 focus:border-brand-600 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-brand-500/10 transition-all duration-200 disabled:opacity-60 placeholder:text-slate-400 shadow-2xs"
                    />
                    <Mail className="w-3.5 h-3.5 text-slate-400 group-hover:text-brand-500 group-focus-within:text-brand-600 absolute left-3 top-1/2 -translate-y-1/2 transition-colors pointer-events-none" />
                  </div>
                </div>

                {/* Hàng 3: Mật Khẩu (Có icon mắt kiểm tra tiện lợi) */}
                <div className="group">
                  <label className="text-xs font-bold text-slate-700 block mb-1.5 group-focus-within:text-brand-600 transition-colors">
                    Mật Khẩu Đăng Nhập
                  </label>
                  <div className="relative">
                    <input
                      type={showRegPassword ? "text" : "password"}
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Tối thiểu 6 ký tự"
                      disabled={regLoading}
                      className="w-full pl-9 pr-10 py-2.5 bg-slate-50/70 hover:bg-white focus:bg-white border border-slate-200/90 hover:border-brand-400 focus:border-brand-600 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-brand-500/10 transition-all duration-200 disabled:opacity-60 placeholder:text-slate-400 shadow-2xs"
                    />
                    <Lock className="w-3.5 h-3.5 text-slate-400 group-hover:text-brand-500 group-focus-within:text-brand-600 absolute left-3 top-1/2 -translate-y-1/2 transition-colors pointer-events-none" />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-slate-100 transition-colors"
                      title={showRegPassword ? "Ẩn" : "Hiện"}
                    >
                      {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* Thanh đo độ mạnh mật khẩu thanh mảnh */}
                  {regPassword && (
                    <div className="mt-1.5 flex items-center justify-between text-[11px]">
                      <div className="flex gap-1.5 w-28 h-1">
                        <div className={`flex-1 rounded-full transition-all duration-300 ${strength.level >= 1 ? strength.color : "bg-slate-200"}`} />
                        <div className={`flex-1 rounded-full transition-all duration-300 ${strength.level >= 2 ? strength.color : "bg-slate-200"}`} />
                        <div className={`flex-1 rounded-full transition-all duration-300 ${strength.level >= 3 ? strength.color : "bg-slate-200"}`} />
                      </div>
                      <span className={`font-semibold ${strength.textColor}`}>{strength.label}</span>
                    </div>
                  )}
                </div>

                {/* Điều khoản */}
                <div className="pt-0.5">
                  <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-600 group">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500 transition-colors cursor-pointer accent-brand-600 shrink-0"
                    />
                    <span className="leading-snug">
                      Đồng ý với{" "}
                      <Link href="/terms-of-service" className="text-brand-600 hover:underline font-semibold" target="_blank">
                        Điều khoản dịch vụ
                      </Link>{" "}
                      &amp;{" "}
                      <Link href="/chinh-sach-bao-mat" className="text-brand-600 hover:underline font-semibold" target="_blank">
                        Bảo mật
                      </Link>{" "}
                      HDC.
                    </span>
                  </label>
                </div>

                {/* Submit Register Button */}
                <button
                  type="submit"
                  disabled={regLoading}
                  className="relative group overflow-hidden w-full py-3 px-5 rounded-xl font-extrabold text-xs sm:text-sm text-white bg-gradient-to-r from-[#003843] via-[#004f5e] to-[#007b8f] hover:from-[#00222a] hover:via-[#003843] hover:to-[#00677a] shadow-lg shadow-brand-900/15 hover:shadow-xl hover:shadow-brand-700/25 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer mt-2"
                >
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
                  {regLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Đang tạo tài khoản...</span>
                    </>
                  ) : (
                    <>
                      <span>Tạo Tài Khoản Doanh Nghiệp</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-200" />
                    </>
                  )}
                </button>
              </form>

              {/* Mobile Switch Link to Login */}
              <div className="pt-4 lg:hidden text-center text-xs text-slate-500 border-t border-slate-100 mt-4">
                Đã có tài khoản HDC?{" "}
                <button
                  type="button"
                  onClick={() => switchMode("login")}
                  className="text-brand-600 font-extrabold hover:underline"
                >
                  Đăng nhập ngay
                </button>
              </div>
            </div>
          </div>

          {/* =========================================================
              TẤM TRƯỢT OVERLAY (DESKTOP SLIDING COVER PARALLAX)
              ========================================================= */}
          <div
            className={`hidden lg:block absolute top-0 left-0 w-1/2 h-full z-20 overflow-hidden transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] shadow-2xl ${
              mode === "login" ? "translate-x-full" : "translate-x-0"
            }`}
          >
            {/* Lớp nền Parallax trượt đối ứng */}
            <div
              className={`w-[200%] h-full flex absolute top-0 left-0 transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] ${
                mode === "login" ? "-translate-x-1/2" : "translate-x-0"
              }`}
            >
              {/* FACE A: Khi mode === "register" -> Mời Đăng Nhập (ở bên trái) */}
              <div className="w-1/2 h-full relative p-8 xl:p-12 flex flex-col justify-between text-white shrink-0">
                <div className="absolute inset-0 z-0 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/01_portraits_01.jpg"
                    alt="HDC Fashion Executive Suits"
                    className="w-full h-full object-cover object-top opacity-55 scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#00141a] via-[#00222a]/90 to-[#003843]/90" />
                  <div className="absolute top-0 right-0 w-72 h-72 bg-brand-500/20 rounded-full blur-[90px] pointer-events-none" />
                </div>

                {/* Header Brand */}
                <div className="relative z-10 flex items-center justify-between">
                  <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md">
                    <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center p-0.5 shadow-sm">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/images/icon.png" alt="HDC FASHION" className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <div className="font-black text-xs text-white tracking-wider">HDC FASHION</div>
                      <div className="text-[8px] uppercase tracking-widest text-cyan-200 font-bold">
                        Phong Cách Tạo Thành Công
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-cyan-200 text-[10px] font-bold backdrop-blur-md">
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    <span>HDC Corporate 2026</span>
                  </div>
                </div>

                {/* Center Content Face A */}
                <div className="relative z-10 my-auto py-4 space-y-4">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-200 text-[11px] font-bold border border-amber-400/30">
                    <span>Đã Có Tài Khoản?</span>
                  </div>

                  <h3 className="text-2xl xl:text-3xl font-black text-white leading-tight">
                    Chào Mừng Trở Lại! <br />
                    <span className="bg-gradient-to-r from-white via-amber-200 to-cyan-300 bg-clip-text text-transparent">
                      HDC Đồng Hành Cùng Bạn
                    </span>
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed max-w-xs">
                    Đăng nhập ngay vào hệ thống để tiếp tục theo dõi tiến độ may đo, 
                    quản lý đơn hàng và nhận báo giá ưu đãi doanh nghiệp.
                  </p>

                  <button
                    type="button"
                    onClick={() => switchMode("login")}
                    className="group relative overflow-hidden inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-white text-[#003843] hover:bg-cyan-50 font-extrabold text-xs shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-cyan-400/30 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1.5 transition-transform duration-300 text-brand-600" />
                    <span>Đăng Nhập Ngay</span>
                  </button>
                </div>

                {/* Bottom Testimonial */}
                <div className="relative z-10 pt-3 border-t border-white/15 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                    <span className="text-[11px] font-bold text-white ml-1">50.000+ Doanh Nghiệp</span>
                  </div>
                  <span className="text-[11px] text-cyan-200 font-medium">Bảo hành đường may 30 ngày</span>
                </div>
              </div>

              {/* FACE B: Khi mode === "login" -> Mời Đăng Ký (ở bên phải) */}
              <div className="w-1/2 h-full relative p-8 xl:p-12 flex flex-col justify-between text-white shrink-0">
                <div className="absolute inset-0 z-0 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/01_portraits_02.jpg"
                    alt="HDC Fashion Corporate Uniform"
                    className="w-full h-full object-cover object-top opacity-55 scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#00141a] via-[#00222a]/90 to-[#003843]/90" />
                  <div className="absolute bottom-0 right-0 w-72 h-72 bg-cyan-400/20 rounded-full blur-[90px] pointer-events-none" />
                </div>

                {/* Header Brand */}
                <div className="relative z-10 flex items-center justify-between">
                  <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md">
                    <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center p-0.5 shadow-sm">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/images/icon.png" alt="HDC FASHION" className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <div className="font-black text-xs text-white tracking-wider">HDC FASHION</div>
                      <div className="text-[8px] uppercase tracking-widest text-cyan-200 font-bold">
                        Phong Cách Tạo Thành Công
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-cyan-200 text-[10px] font-bold backdrop-blur-md">
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    <span>2026 Collection</span>
                  </div>
                </div>

                {/* Center Content Face B */}
                <div className="relative z-10 my-auto py-4 space-y-4">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-400/20 text-cyan-200 text-[11px] font-bold border border-cyan-400/30">
                    <span>Thành Viên Mới?</span>
                  </div>

                  <h3 className="text-2xl xl:text-3xl font-black text-white leading-tight">
                    Xin Chào Quý Khách! <br />
                    <span className="bg-gradient-to-r from-white via-cyan-200 to-brand-300 bg-clip-text text-transparent">
                      Khám Phá HDC Fashion
                    </span>
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed max-w-xs">
                    Chưa có tài khoản? Đăng ký ngay hôm nay để nhận đặc quyền may mẫu thử 0đ tận văn phòng, 
                    chiết khấu sỉ trực tiếp và tư vấn thiết kế độc quyền.
                  </p>

                  <button
                    type="button"
                    onClick={() => switchMode("register")}
                    className="group relative overflow-hidden inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-white text-[#003843] hover:bg-cyan-50 font-extrabold text-xs shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-cyan-400/30 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    <span>Đăng Ký Tài Khoản</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300 text-brand-600" />
                  </button>
                </div>

                {/* Bottom Testimonial */}
                <div className="relative z-10 pt-3 border-t border-white/15 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                    <span className="text-[11px] font-bold text-white ml-1">50.000+ Doanh Nghiệp</span>
                  </div>
                  <span className="text-[11px] text-cyan-200 font-medium">May mẫu thử 0đ tận nơi</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* =========================================================
          FOOTER (Compact 1 dòng)
          ========================================================= */}
      <footer className="w-full text-center text-[11px] text-slate-500 py-1 relative z-10 shrink-0">
        © {new Date().getFullYear()} HDC FASHION — Đồng phục doanh nghiệp cao cấp. Hotline hỗ trợ 24/7:{" "}
        <a href="tel:0984959586" className="text-brand-700 font-bold hover:underline">
          0984.959.586
        </a>
      </footer>
    </div>
  );
}
