"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  ChevronDown,
  Sun,
  Moon,
  Palette,
  Check,
  MoreHorizontal,
  ExternalLink,
} from "lucide-react";
import { useTheme, ACCENT_PALETTES } from "@/shared/providers/ThemeProvider";

export default function AdminHeader({ user }) {
  const pathname = usePathname();
  const { theme, toggleTheme, accentPalette, setAccentPalette, currentAccent } =
    useTheme();
  const isDark = theme === "dark";

  const [timeframe, setTimeframe] = useState("Monthly");
  const [searchVal, setSearchVal] = useState("");
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const paletteRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (paletteRef.current && !paletteRef.current.contains(e.target)) {
        setIsPaletteOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      className={`h-14 shrink-0 px-4 sm:px-6 flex items-center justify-between gap-4 select-none transition-colors duration-200 border-b z-20 ${
        isDark
          ? "bg-[#0F1420] border-[#1E293B] text-white"
          : "bg-white border-slate-200/80 text-slate-900 shadow-xs"
      }`}
    >
      {/* 1. Breadcrumb: Dashboard > Overview */}
      <div className="flex items-center gap-2 text-xs font-medium">
        <Link
          href="/admin"
          className={
            isDark
              ? "text-slate-400 hover:text-white transition-colors"
              : "text-slate-500 hover:text-slate-900 transition-colors"
          }
        >
          Dashboard
        </Link>
        <span className={isDark ? "text-slate-600" : "text-slate-300"}>&gt;</span>
        <span
          className={`font-bold transition-colors ${
            isDark ? currentAccent.activeTextDark : currentAccent.activeTextLight
          }`}
        >
          Overview
        </span>
      </div>

      {/* 2. Right Controls: Search, Timeframe Pill, Color Palette Picker, Light/Dark Switcher */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Capsule Search Input */}
        <div className="relative hidden sm:block">
          <input
            type="text"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            placeholder="Search..."
            className={`w-44 lg:w-56 pl-8 pr-3 py-1.5 rounded-full text-xs transition-all border outline-none ${
              isDark
                ? "bg-[#141C2E] border-[#22314E] text-white placeholder:text-slate-500 focus:border-cyan-500"
                : "bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-slate-400 shadow-2xs"
            }`}
          />
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>

        {/* Timeframe Dropdown (Monthly ▾) */}
        <button
          type="button"
          onClick={() =>
            setTimeframe((prev) => (prev === "Daily" ? "Monthly" : "Daily"))
          }
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
            isDark
              ? "bg-[#141C2E] border-[#22314E] text-slate-200 hover:text-white"
              : "bg-slate-50 border-slate-200 text-slate-700 hover:text-black shadow-2xs"
          }`}
        >
          <span>{timeframe}</span>
          <ChevronDown className="w-3.5 h-3.5 opacity-60" />
        </button>

        {/* BỘ CHỌN PHỐI MÀU (COLOR PALETTE PICKER) */}
        <div className="relative" ref={paletteRef}>
          <button
            type="button"
            onClick={() => setIsPaletteOpen((prev) => !prev)}
            title="Đổi phối màu giao diện"
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              isDark
                ? "bg-[#141C2E] border-[#22314E] text-slate-300 hover:text-white"
                : "bg-slate-50 border-slate-200 text-slate-700 hover:text-black shadow-2xs"
            }`}
          >
            <span
              className="w-2.5 h-2.5 rounded-full ring-1 ring-white/40 shadow-xs"
              style={{
                backgroundColor: isDark
                  ? currentAccent.primaryDark
                  : currentAccent.primaryLight,
              }}
            />
            <span className="hidden md:inline text-[11px]">
              {currentAccent.name.split(" ")[0]}
            </span>
            <ChevronDown className="w-3 h-3 opacity-60" />
          </button>

          {/* PALETTE DROPDOWN MENU */}
          {isPaletteOpen && (
            <div
              className={`absolute right-0 top-full mt-2 w-64 rounded-2xl p-2.5 border shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 ${
                isDark
                  ? "bg-[#131926] border-[#22314E] text-white"
                  : "bg-white border-slate-200 text-slate-900"
              }`}
            >
              <div className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Chọn Phối Màu Giao Diện
              </div>
              <div className="space-y-1">
                {Object.values(ACCENT_PALETTES).map((pal) => {
                  const isSelected = accentPalette === pal.id;
                  return (
                    <button
                      key={pal.id}
                      type="button"
                      onClick={() => {
                        setAccentPalette(pal.id);
                        setIsPaletteOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? isDark
                            ? "bg-[#1E293B] text-white"
                            : "bg-slate-100 text-slate-950 font-bold"
                          : isDark
                          ? "hover:bg-[#1A2234] text-slate-300"
                          : "hover:bg-slate-50 text-slate-700"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className="w-3.5 h-3.5 rounded-full ring-2 ring-white/20 shadow-xs"
                          style={{
                            backgroundColor: isDark
                              ? pal.primaryDark
                              : pal.primaryLight,
                          }}
                        />
                        <span>{pal.name}</span>
                      </div>
                      {isSelected && (
                        <Check className="w-4 h-4 text-emerald-500" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* NÚT CHUYỂN GIAO DIỆN SÁNG / TỐI (LIGHT / DARK THEME TOGGLE) */}
        <button
          type="button"
          onClick={toggleTheme}
          title={
            isDark
              ? "Chuyển sang giao diện Sáng (Thanh lịch)"
              : "Chuyển sang giao diện Tối (Bảo vệ mắt)"
          }
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
            isDark
              ? "bg-[#141C2E] border-[#22314E] text-cyan-300 hover:bg-[#1E293B]"
              : "bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100 shadow-2xs"
          }`}
        >
          {isDark ? (
            <>
              <Sun className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline font-mono text-[11px]">Dark</span>
            </>
          ) : (
            <>
              <Moon className="w-3.5 h-3.5 text-slate-700" />
              <span className="hidden sm:inline font-mono text-[11px]">Light</span>
            </>
          )}
        </button>

        {/* More options button */}
        <button
          type="button"
          className={`p-1.5 rounded-xl border transition-colors ${
            isDark
              ? "border-[#22314E] bg-[#141C2E] text-slate-400 hover:text-white"
              : "border-slate-200 text-slate-400 hover:text-slate-700 bg-slate-50"
          }`}
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
