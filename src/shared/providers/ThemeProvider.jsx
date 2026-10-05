"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export const ACCENT_PALETTES = {
  teal: {
    id: "teal",
    name: "Ocean Teal (HDC Fashion)",
    icon: "🌊",
    primary: "#0097B2",
    primaryLight: "#008FA8",
    primaryDark: "#06B6D4",
    gradient: "from-[#0097B2] to-[#06B6D4]",
    glow: "shadow-cyan-500/20",
    bgActiveLight: "bg-cyan-50 text-cyan-900 border-cyan-200",
    bgActiveDark: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
    blockActiveLight: "bg-[#008FA8] hover:bg-[#007A90]",
    blockActiveDark: "bg-[#06B6D4] hover:bg-[#22D3EE] shadow-xs shadow-cyan-500/30",
    activeTextLight: "text-[#008FA8]",
    activeTextDark: "text-[#06B6D4]",
    barAccentLight: "bg-[#008FA8]",
    barAccentDark: "bg-[#06B6D4]",
  },
  indigo: {
    id: "indigo",
    name: "Cyber Indigo (Linear / Tech)",
    icon: "⚡",
    primary: "#6366F1",
    primaryLight: "#4F46E5",
    primaryDark: "#818CF8",
    gradient: "from-[#4F46E5] to-[#818CF8]",
    glow: "shadow-indigo-500/20",
    bgActiveLight: "bg-indigo-50 text-indigo-900 border-indigo-200",
    bgActiveDark: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
    blockActiveLight: "bg-[#4F46E5] hover:bg-[#4338CA]",
    blockActiveDark: "bg-[#818CF8] hover:bg-[#A5B4FC] shadow-xs shadow-indigo-500/30",
    activeTextLight: "text-[#4F46E5]",
    activeTextDark: "text-[#818CF8]",
    barAccentLight: "bg-[#4F46E5]",
    barAccentDark: "bg-[#818CF8]",
  },
  emerald: {
    id: "emerald",
    name: "Bespoke Emerald (Cao Cấp)",
    icon: "🌿",
    primary: "#10B981",
    primaryLight: "#059669",
    primaryDark: "#34D399",
    gradient: "from-[#059669] to-[#34D399]",
    glow: "shadow-emerald-500/20",
    bgActiveLight: "bg-emerald-50 text-emerald-900 border-emerald-200",
    bgActiveDark: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    blockActiveLight: "bg-[#059669] hover:bg-[#047857]",
    blockActiveDark: "bg-[#34D399] hover:bg-[#6EE7B7] shadow-xs shadow-emerald-500/30",
    activeTextLight: "text-[#059669]",
    activeTextDark: "text-[#34D399]",
    barAccentLight: "bg-[#059669]",
    barAccentDark: "bg-[#34D399]",
  },
  amber: {
    id: "amber",
    name: "Warm Gold (Quý Phái)",
    icon: "✨",
    primary: "#F59E0B",
    primaryLight: "#D97706",
    primaryDark: "#FBBF24",
    gradient: "from-[#D97706] to-[#FBBF24]",
    glow: "shadow-amber-500/20",
    bgActiveLight: "bg-amber-50 text-amber-900 border-amber-200",
    bgActiveDark: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    blockActiveLight: "bg-[#D97706] hover:bg-[#B45309]",
    blockActiveDark: "bg-[#FBBF24] hover:bg-[#FCD34D] shadow-xs shadow-amber-500/30",
    activeTextLight: "text-[#D97706]",
    activeTextDark: "text-[#FBBF24]",
    barAccentLight: "bg-[#D97706]",
    barAccentDark: "bg-[#FBBF24]",
  },
};

const ThemeContext = createContext({
  theme: "light",
  toggleTheme: () => {},
  setTheme: () => {},
  accentPalette: "teal",
  setAccentPalette: () => {},
  currentAccent: ACCENT_PALETTES.teal,
});

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState("light");
  const [accentPalette, setAccentPaletteState] = useState("teal");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const savedTheme = localStorage.getItem("huni_theme");
      if (savedTheme) {
        setThemeState(savedTheme);
        if (savedTheme === "dark") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      } else {
        setThemeState("light");
        document.documentElement.classList.remove("dark");
      }

      const savedPalette = localStorage.getItem("huni_accent_palette");
      if (savedPalette && ACCENT_PALETTES[savedPalette]) {
        setAccentPaletteState(savedPalette);
      }
    } catch (e) {
      console.error("Theme load error", e);
    }
  }, []);

  const setTheme = (newTheme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem("huni_theme", newTheme);
      if (newTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    } catch (e) {
      console.error("Theme save error", e);
    }
  };

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
  };

  const setAccentPalette = (paletteKey) => {
    if (ACCENT_PALETTES[paletteKey]) {
      setAccentPaletteState(paletteKey);
      try {
        localStorage.setItem("huni_accent_palette", paletteKey);
      } catch (e) {
        console.error("Palette save error", e);
      }
    }
  };

  const currentAccent = ACCENT_PALETTES[accentPalette] || ACCENT_PALETTES.teal;

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        setTheme,
        accentPalette,
        setAccentPalette,
        currentAccent,
        mounted,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}