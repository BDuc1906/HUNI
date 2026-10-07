"use client";

import React, { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/shared/providers/AuthProvider";
import { authService } from "@/shared/services/apiClient";
import {
  Loader2,
  Mail,
  Lock,
  User,
  UserPlus,
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

import { isAccountLocked } from "@/shared/utils/accountLockManager";

function AuthSlidingDualPanelInner({ defaultMode = "login" }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  const registeredParam = searchParams.get("registered") === "1";
  const isLockedParam = searchParams.get("error") === "account_locked";
  const { user, login } = useAuth();

  // Tự động chuyển hướng nếu người dùng đã đăng nhập từ trước
  useEffect(() => {
    if (user) {
      const explicitRedirect = searchParams.get("redirect");
      const userRole = (user.role || user.Role)?.toString().toUpperCase();
      if (explicitRedirect && explicitRedirect !== "/") {
        window.location.href = explicitRedirect;
      } else if (userRole === "ADMIN" || userRole === "1") {
        window.location.href = "/admin";
      } else {
        window.location.href = "/";
      }
    }
  }, [user, searchParams]);

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
  const [loginError, setLoginError] = useState(
    isLockedParam
      ? "⛔ Tài khoản của bạn vừa bị Quản trị viên khóa. Bạn đã bị đăng xuất khỏi hệ thống!"
      : ""
  );
  const [loginSuccess, setLoginSuccess] = useState(registeredParam);

  useEffect(() => {
    if (isLockedParam) {
      setLoginError(
        "⛔ Tài khoản của bạn vừa bị Quản trị viên khóa. Bạn đã bị đăng xuất khỏi hệ thống!"
      );
    }
  }, [isLockedParam]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");

    // 1. KIỂM TRA TÀI KHOẢN CÓ BỊ KHÓA KHÔNG:
    if (isAccountLocked(loginEmail)) {
      setLoginError(
        "⛔ Tài khoản này đã bị Quản trị viên khóa do không còn sử dụng. Bạn không thể đăng nhập vào hệ thống."
      );
      return;
    }

    setLoginLoading(true);

    try {
      const res = await login(loginEmail, loginPassword);

      if (!res.success) {
        setLoginError(res.error || "Email hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại.");
      } else {
        const userRole = (res.user?.role || res.user?.Role)?.toString().toUpperCase();
        const explicitRedirect = searchParams.get("redirect");

        let targetUrl = "/";
        if (explicitRedirect && explicitRedirect !== "/") {
          targetUrl = explicitRedirect;
        } else if (userRole === "ADMIN" || userRole === "1") {
          targetUrl = "/admin";
        } else {
          targetUrl = "/";
        }

        window.location.href = targetUrl;
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
      const data = await authService.register({
        fullName: regFullName,
        email: regEmail,
        phone: regPhone,
        password: regPassword,
      });

      if (!data.success) {
        const details = data.details?.map((d) => d.message).join(" | ");
        setRegError(details ? `${data.error} — ${details}` : data.error);
        return;
      }

      setLoginEmail(regEmail);
      setLoginPassword(regPassword);
      setLoginSuccess(true);
      switchMode("login");
    } catch (err) {
      setRegError("Không thể đăng ký lúc này. Vui lòng thử lại sau.");
    } finally {
      setRegLoading(false);
    }
  };

  return (
    <div className="min-h-screen sm:h-screen w-full bg-gradient-to-br from-slate-100 via-[#eef5f8] to-slate-200 flex flex-col justify-center p-3 sm:p-5 selection:bg-brand-500 selection:text-white relative overflow-x-hidden sm:overflow-hidden">
      {/* Ambient Glows */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-brand-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-400/10 rounded-full blur-[140px] pointer-events-none" />

      {/* =========================================================
          TOP ACTION BAR (Compact)
          ========================================================= */}
      <header className="w-full max-w-[1040px] mx-auto flex items-center justify-between pb-2 sm:pb-3 relative z-30 shrink-0">
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
          ========================================================= */}
      <main className="w-full max-w-[1040px] mx-auto relative z-20 flex-1 flex items-center justify-center">
        <div className="relative w-full h-[580px] sm:h-[600px] lg:h-[620px] max-h-[calc(100vh-60px)] bg-white rounded-[32px] shadow-[0_25px_60px_-15px_rgba(0,35,45,0.18),0_10px_25px_-5px_rgba(0,0,0,0.08)] border border-slate-200/80 overflow-hidden">
          
          {/* =========================================================
              PANEL 1: FORM ĐĂNG NHẬP (BÊN TRÁI 0 -> 50%)
              ========================================================= */}
          <div
            className={`absolute top-0 left-0 w-full lg:w-1/2 h-full p-6 sm:p-8 lg:p-10 flex flex-col justify-center overflow-y-auto lg:overflow-y-visible z-10 transition-all duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] ${
              mode === "login"
                ? "opacity-100 translate-x-0 pointer-events-auto"
                : "lg:opacity-0 lg:-translate-x-12 lg:pointer-events-none hidden lg:flex"
            }`}
          >
            <div className="max-w-[390px] mx-auto w-full">
              {/* Header Logo & Title */}
              <div className="mb-3 sm:mb-4">
                <Link href="/" className="inline-flex items-center group mb-2" title="Về trang chủ HDC FASHION">
                  <div className="h-8 sm:h-9 w-32 sm:w-36 relative flex items-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/images/logo.png"
                      alt="HDC FASHION Logo"
                      width={140}
                      height={34}
                      style={{ height: "34px", width: "auto", maxHeight: "34px", objectFit: "contain" }}
                      className="h-full w-auto max-h-8 sm:max-h-9 object-contain transform group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </Link>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Đăng Nhập Tài Khoản
                </h2>
                <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 leading-relaxed">
                  Theo dõi đơn may mẫu, duyệt thiết kế &amp; nhận báo giá sỉ độc quyền.
                </p>
              </div>

              {/* Form Content */}
              <form onSubmit={handleLoginSubmit} className="space-y-3">
                {loginSuccess && (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-800 text-xs shadow-2xs animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-semibold text-xs">Đăng ký thành công! Hãy đăng nhập ngay.</span>
                  </div>
                )}

                {loginError && (
                  <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-800 text-xs shadow-2xs animate-in shake">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span className="font-semibold text-xs">{loginError}</span>
                  </div>
                )}

                {/* Email Field - Floating Label */}
                <div className="relative group">
                  <input
                    type="email"
                    id="loginEmail"
                    required
                    autoComplete="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder=""
                    disabled={loginLoading}
                    className="peer w-full pl-9 sm:pl-10 pr-3.5 py-2.5 sm:py-3 bg-white hover:bg-slate-50/50 focus:bg-white border border-slate-200/90 hover:border-brand-400 focus:border-brand-600 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-3 focus:ring-brand-500/15 transition-all duration-200 disabled:opacity-60 shadow-md hover:shadow-lg focus:shadow-lg"
                  />
                  <Mail className="w-4 h-4 text-slate-400 group-hover:text-brand-500 peer-focus:text-brand-600 absolute left-3 top-1/2 -translate-y-1/2 transition-colors pointer-events-none" />
                  <label
                    htmlFor="loginEmail"
                    className={`absolute left-8 sm:left-9 transition-all duration-200 pointer-events-none select-none ${
                      loginEmail
                        ? "-top-2 text-[10px] font-bold text-slate-700 bg-white px-1.5 rounded"
                        : "top-1/2 -translate-y-1/2 text-xs text-slate-400 font-normal group-hover:-top-2 group-hover:translate-y-0 group-hover:text-[10px] group-hover:font-bold group-hover:text-brand-600 group-hover:bg-white group-hover:px-1.5 peer-focus:-top-2 peer-focus:translate-y-0 peer-focus:text-[10px] peer-focus:font-bold peer-focus:text-brand-600 peer-focus:bg-white peer-focus:px-1.5"
                    }`}
                  >
                    Email Doanh Nghiệp / Cá Nhân
                  </label>
                </div>

                {/* Password Field - Floating Label */}
                <div className="relative group">
                  <input
                    type={showLoginPassword ? "text" : "password"}
                    id="loginPassword"
                    required
                    autoComplete="current-password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder=""
                    disabled={loginLoading}
                    className="peer w-full pl-9 sm:pl-10 pr-10 py-2.5 sm:py-3 bg-white hover:bg-slate-50/50 focus:bg-white border border-slate-200/90 hover:border-brand-400 focus:border-brand-600 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-3 focus:ring-brand-500/15 transition-all duration-200 disabled:opacity-60 shadow-md hover:shadow-lg focus:shadow-lg"
                  />
                  <Lock className="w-4 h-4 text-slate-400 group-hover:text-brand-500 peer-focus:text-brand-600 absolute left-3 top-1/2 -translate-y-1/2 transition-colors pointer-events-none" />
                  <label
                    htmlFor="loginPassword"
                    className={`absolute left-8 sm:left-9 transition-all duration-200 pointer-events-none select-none ${
                      loginPassword
                        ? "-top-2 text-[10px] font-bold text-slate-700 bg-white px-1.5 rounded"
                        : "top-1/2 -translate-y-1/2 text-xs text-slate-400 font-normal group-hover:-top-2 group-hover:translate-y-0 group-hover:text-[10px] group-hover:font-bold group-hover:text-brand-600 group-hover:bg-white group-hover:px-1.5 peer-focus:-top-2 peer-focus:translate-y-0 peer-focus:text-[10px] peer-focus:font-bold peer-focus:text-brand-600 peer-focus:bg-white peer-focus:px-1.5"
                    }`}
                  >
                    Mật Khẩu
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-slate-100 transition-colors"
                    title={showLoginPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between text-xs pt-0.5">
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
                  <a
                    href="tel:0984959586"
                    title="Hỗ trợ lấy lại mật khẩu"
                    className="text-[11px] font-semibold text-brand-600 hover:text-brand-800 hover:underline transition-colors"
                  >
                    Quên mật khẩu?
                  </a>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loginLoading}
                  className="relative group overflow-hidden w-full py-2.5 sm:py-3 px-5 rounded-xl font-extrabold text-xs sm:text-sm text-white bg-gradient-to-r from-[#003843] via-[#004f5e] to-[#007b8f] hover:from-[#00222a] hover:via-[#003843] hover:to-[#00677a] shadow-lg shadow-brand-900/15 hover:shadow-xl hover:shadow-brand-700/25 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer mt-1"
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

                {/* Phần Đăng Ký Tài Khoản chuyển ngay dưới phần Đăng Nhập */}
                <div className="pt-2 flex flex-col items-center gap-2">
                  <div className="flex items-center justify-center gap-2 w-full">
                    <div className="h-px bg-slate-200 flex-1" />
                    <span className="text-[11px] font-medium text-slate-400">Chưa có tài khoản doanh nghiệp?</span>
                    <div className="h-px bg-slate-200 flex-1" />
                  </div>

                  <button
                    type="button"
                    onClick={() => switchMode("register")}
                    className="w-full py-2.5 px-4 rounded-xl border border-brand-500/30 hover:border-brand-600 bg-brand-50/60 hover:bg-brand-100/70 text-brand-700 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-200 hover:shadow-md cursor-pointer group"
                  >
                    <UserPlus className="w-4 h-4 text-brand-600 group-hover:scale-110 transition-transform" />
                    <span>Đăng Ký Tài Khoản Ngay</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* =========================================================
              PANEL 2: FORM ĐĂNG KÝ (BÊN PHẢI 50% -> 100%)
              - Cân đối tuyệt đối, không tràn, không thô
              - Form căn giữa trục dọc hoàn hảo
              ========================================================= */}
          <div
            className={`absolute top-0 right-0 w-full lg:w-1/2 h-full p-6 sm:p-8 lg:p-10 flex flex-col justify-center overflow-y-auto lg:overflow-y-visible z-10 transition-all duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] ${
              mode === "register"
                ? "opacity-100 translate-x-0 pointer-events-auto"
                : "lg:opacity-0 lg:translate-x-12 lg:pointer-events-none hidden lg:flex"
            }`}
          >
            <div className="max-w-[400px] mx-auto w-full">
              {/* Header Logo & Title */}
              <div className="mb-2 sm:mb-2.5">
                <Link href="/" className="inline-flex items-center group mb-1.5" title="Về trang chủ HDC FASHION">
                  <div className="h-7 sm:h-8 w-28 sm:w-32 relative flex items-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/images/logo.png"
                      alt="HDC FASHION Logo"
                      width={130}
                      height={30}
                      style={{ height: "30px", width: "auto", maxHeight: "30px", objectFit: "contain" }}
                      className="h-full w-auto max-h-7 sm:max-h-8 object-contain transform group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </Link>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                  Tạo Tài Khoản Doanh Nghiệp
                </h2>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Nhận may mẫu thử 0đ tận văn phòng &amp; chiết khấu sỉ trực tiếp.
                </p>
              </div>

              {/* Form Content - Thiết kế 2 cột tinh tế, thanh thoát với Floating Labels */}
              <form onSubmit={handleRegisterSubmit} className="space-y-3 sm:space-y-3.5 pt-1">
                {regError && (
                  <div className="p-2 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2 text-rose-800 text-xs shadow-2xs animate-in shake">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                    <span className="font-semibold text-xs">{regError}</span>
                  </div>
                )}

                {/* Hàng 1: Họ tên + Số điện thoại (Floating Labels) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
                  <div className="relative group">
                    <input
                      type="text"
                      id="regFullName"
                      required
                      value={regFullName}
                      onChange={(e) => setRegFullName(e.target.value)}
                      placeholder=""
                      disabled={regLoading}
                      className="peer w-full pl-8 sm:pl-9 pr-3 py-2 sm:py-2.5 bg-white hover:bg-slate-50/50 focus:bg-white border border-slate-200/90 hover:border-brand-400 focus:border-brand-600 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-3 focus:ring-brand-500/15 transition-all duration-200 disabled:opacity-60 shadow-md hover:shadow-lg focus:shadow-lg"
                    />
                    <User className="w-3.5 h-3.5 text-slate-400 group-hover:text-brand-500 peer-focus:text-brand-600 absolute left-2.5 top-1/2 -translate-y-1/2 transition-colors pointer-events-none" />
                    <label
                      htmlFor="regFullName"
                      className={`absolute left-7 sm:left-8 transition-all duration-200 pointer-events-none select-none ${
                        regFullName
                          ? "-top-2 text-[10px] font-bold text-slate-700 bg-white px-1.5 rounded"
                          : "top-1/2 -translate-y-1/2 text-xs text-slate-400 font-normal group-hover:-top-2 group-hover:translate-y-0 group-hover:text-[10px] group-hover:font-bold group-hover:text-brand-600 group-hover:bg-white group-hover:px-1.5 peer-focus:-top-2 peer-focus:translate-y-0 peer-focus:text-[10px] peer-focus:font-bold peer-focus:text-brand-600 peer-focus:bg-white peer-focus:px-1.5"
                      }`}
                    >
                      Họ và Tên
                    </label>
                  </div>

                  <div className="relative group">
                    <input
                      type="tel"
                      id="regPhone"
                      required
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder=""
                      disabled={regLoading}
                      className="peer w-full pl-8 sm:pl-9 pr-3 py-2 sm:py-2.5 bg-white hover:bg-slate-50/50 focus:bg-white border border-slate-200/90 hover:border-brand-400 focus:border-brand-600 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-3 focus:ring-brand-500/15 transition-all duration-200 disabled:opacity-60 shadow-md hover:shadow-lg focus:shadow-lg"
                    />
                    <Phone className="w-3.5 h-3.5 text-slate-400 group-hover:text-brand-500 peer-focus:text-brand-600 absolute left-2.5 top-1/2 -translate-y-1/2 transition-colors pointer-events-none" />
                    <label
                      htmlFor="regPhone"
                      className={`absolute left-7 sm:left-8 transition-all duration-200 pointer-events-none select-none ${
                        regPhone
                          ? "-top-2 text-[10px] font-bold text-slate-700 bg-white px-1.5 rounded"
                          : "top-1/2 -translate-y-1/2 text-xs text-slate-400 font-normal group-hover:-top-2 group-hover:translate-y-0 group-hover:text-[10px] group-hover:font-bold group-hover:text-brand-600 group-hover:bg-white group-hover:px-1.5 peer-focus:-top-2 peer-focus:translate-y-0 peer-focus:text-[10px] peer-focus:font-bold peer-focus:text-brand-600 peer-focus:bg-white peer-focus:px-1.5"
                      }`}
                    >
                      Số Điện Thoại / Zalo
                    </label>
                  </div>
                </div>

                {/* Hàng 2: Email Doanh Nghiệp (Floating Label) */}
                <div className="relative group">
                  <input
                    type="email"
                    id="regEmail"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder=""
                    disabled={regLoading}
                    className="peer w-full pl-8 sm:pl-9 pr-3 py-2 sm:py-2.5 bg-white hover:bg-slate-50/50 focus:bg-white border border-slate-200/90 hover:border-brand-400 focus:border-brand-600 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-3 focus:ring-brand-500/15 transition-all duration-200 disabled:opacity-60 shadow-md hover:shadow-lg focus:shadow-lg"
                  />
                  <Mail className="w-3.5 h-3.5 text-slate-400 group-hover:text-brand-500 peer-focus:text-brand-600 absolute left-2.5 top-1/2 -translate-y-1/2 transition-colors pointer-events-none" />
                  <label
                    htmlFor="regEmail"
                    className={`absolute left-7 sm:left-8 transition-all duration-200 pointer-events-none select-none ${
                      regEmail
                        ? "-top-2 text-[10px] font-bold text-slate-700 bg-white px-1.5 rounded"
                        : "top-1/2 -translate-y-1/2 text-xs text-slate-400 font-normal group-hover:-top-2 group-hover:translate-y-0 group-hover:text-[10px] group-hover:font-bold group-hover:text-brand-600 group-hover:bg-white group-hover:px-1.5 peer-focus:-top-2 peer-focus:translate-y-0 peer-focus:text-[10px] peer-focus:font-bold peer-focus:text-brand-600 peer-focus:bg-white peer-focus:px-1.5"
                    }`}
                  >
                    Email Doanh Nghiệp / Cá Nhân
                  </label>
                </div>

                {/* Hàng 3: Mật Khẩu (Floating Label) */}
                <div className="group">
                  <div className="relative">
                    <input
                      type={showRegPassword ? "text" : "password"}
                      id="regPassword"
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder=""
                      disabled={regLoading}
                      className="peer w-full pl-8 sm:pl-9 pr-9 py-2 sm:py-2.5 bg-white hover:bg-slate-50/50 focus:bg-white border border-slate-200/90 hover:border-brand-400 focus:border-brand-600 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-3 focus:ring-brand-500/15 transition-all duration-200 disabled:opacity-60 placeholder:text-slate-400 shadow-md hover:shadow-lg focus:shadow-lg"
                    />
                    <Lock className="w-3.5 h-3.5 text-slate-400 group-hover:text-brand-500 peer-focus:text-brand-600 absolute left-2.5 top-1/2 -translate-y-1/2 transition-colors pointer-events-none" />
                    <label
                      htmlFor="regPassword"
                      className={`absolute left-7 sm:left-8 transition-all duration-200 pointer-events-none select-none ${
                        regPassword
                          ? "-top-2 text-[10px] font-bold text-slate-700 bg-white px-1.5 rounded"
                          : "top-1/2 -translate-y-1/2 text-xs text-slate-400 font-normal group-hover:-top-2 group-hover:translate-y-0 group-hover:text-[10px] group-hover:font-bold group-hover:text-brand-600 group-hover:bg-white group-hover:px-1.5 peer-focus:-top-2 peer-focus:translate-y-0 peer-focus:text-[10px] peer-focus:font-bold peer-focus:text-brand-600 peer-focus:bg-white peer-focus:px-1.5"
                      }`}
                    >
                      Mật Khẩu Đăng Nhập
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-slate-100 transition-colors"
                      title={showRegPassword ? "Ẩn" : "Hiện"}
                    >
                      {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* Thanh đo độ mạnh mật khẩu thanh mảnh */}
                  {regPassword && (
                    <div className="mt-1 flex items-center justify-between text-[10px]">
                      <div className="flex gap-1.5 w-24 h-1">
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
                  <label className="flex items-center gap-2 cursor-pointer select-none text-[11px] text-slate-600 group">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="w-3.5 h-3.5 rounded border-slate-300 text-brand-600 focus:ring-brand-500 transition-colors cursor-pointer accent-brand-600 shrink-0"
                    />
                    <span className="leading-snug">
                      Đồng ý với{" "}
                      <Link href="/terms-of-service" className="text-brand-600 hover:underline font-semibold" target="_blank">
                        Điều khoản
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
                  className="relative group overflow-hidden w-full py-2 sm:py-2.5 px-4 rounded-xl font-extrabold text-xs sm:text-sm text-white bg-gradient-to-r from-[#003843] via-[#004f5e] to-[#007b8f] hover:from-[#00222a] hover:via-[#003843] hover:to-[#00677a] shadow-lg shadow-brand-900/15 hover:shadow-xl hover:shadow-brand-700/25 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer mt-0.5"
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

                {/* Phần Đăng Nhập chuyển ngay dưới Đăng Ký */}
                <div className="pt-1 flex flex-col items-center gap-1">
                  <div className="flex items-center justify-center gap-2 w-full">
                    <div className="h-px bg-slate-200 flex-1" />
                    <span className="text-[10px] font-medium text-slate-400">Đã có tài khoản doanh nghiệp?</span>
                    <div className="h-px bg-slate-200 flex-1" />
                  </div>

                  <button
                    type="button"
                    onClick={() => switchMode("login")}
                    className="w-full py-1.5 sm:py-2 px-3 rounded-xl border border-brand-500/30 hover:border-brand-600 bg-brand-50/60 hover:bg-brand-100/70 text-brand-700 font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all duration-200 hover:shadow-md cursor-pointer group"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                    <span>Đăng Nhập Ngay</span>
                  </button>
                </div>
              </form>
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
              {/* FACE A: Khi mode === "register" -> Tôn vinh hình ảnh vest executive */}
              <div className="w-1/2 h-full relative p-8 xl:p-12 flex flex-col justify-end items-center text-white shrink-0 metallic-sheen-container overflow-hidden group/panel">
                {/* ẢNH TO TỰ TẠO: HDC Fashion Executive Suits */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/auth_welcome_hero.jpg"
                    alt="HDC Fashion Executive Suits"
                    className="w-full h-full object-cover object-[center_20%] transition-transform duration-1000 scale-100 group-hover/panel:scale-105"
                  />
                  {/* Lớp gradient tối sang trọng */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#00141a]/95 via-[#00222a]/30 to-black/10" />
                  <div className="absolute inset-0 bg-radial from-transparent via-transparent to-black/30 pointer-events-none" />
                </div>

                {/* Caption thương hiệu thanh lịch & cao cấp */}
                <div className="relative z-30 w-full flex flex-col items-center text-center pb-2">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/45 backdrop-blur-md border border-white/20 text-cyan-200 text-xs font-semibold shadow-lg mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    <span>May Đo Chuẩn Xác • May Mẫu 0đ</span>
                  </div>
                  <p className="text-white/90 text-xs sm:text-sm font-medium drop-shadow-md">
                    Đồng hành cùng hơn 2.500+ doanh nghiệp uy tín toàn quốc
                  </p>
                </div>
              </div>

              {/* FACE B: Khi mode === "login" -> Tôn vinh hình ảnh bộ sưu tập đồng phục doanh nghiệp */}
              <div className="w-1/2 h-full relative p-8 xl:p-12 flex flex-col justify-end items-center text-white shrink-0 metallic-sheen-container overflow-hidden group/panel">
                {/* ẢNH TO TỰ TẠO: HDC Fashion Corporate Uniform Showcase */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/auth_showcase_hero.jpg"
                    alt="HDC Fashion Corporate Uniform Showcase"
                    className="w-full h-full object-cover object-[center_25%] transition-transform duration-1000 scale-100 group-hover/panel:scale-105"
                  />
                  {/* Lớp gradient tối sang trọng */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#00141a]/95 via-[#00222a]/30 to-black/10" />
                  <div className="absolute inset-0 bg-radial from-transparent via-transparent to-black/30 pointer-events-none" />
                </div>

                {/* Caption thương hiệu thanh lịch & cao cấp */}
                <div className="relative z-30 w-full flex flex-col items-center text-center pb-2">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/45 backdrop-blur-md border border-white/20 text-cyan-200 text-xs font-semibold shadow-lg mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Bộ Sưu Tập Đồng Phục Cao Cấp 2026</span>
                  </div>
                  <p className="text-white/90 text-xs sm:text-sm font-medium drop-shadow-md">
                    Nâng tầm diện mạo chuyên nghiệp cho doanh nghiệp hàng đầu
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
