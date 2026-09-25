"use client";

import React from "react";
import { useTheme } from "@/shared/hooks/useTheme";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle({ className = "" }) {
  const { theme, toggleTheme, mounted } = useTheme();

  if (!mounted) {
    return (
      <div className={`w-9 h-9 rounded-full border border-neutral-200 dark:border-neutral-800 ${className}`} />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      aria-label="Chuyển chế độ sáng/tối"
      title={theme === "dark" ? "Chuyển sang Giao diện Sáng (Chữ đen nền trắng)" : "Chuyển sang Giao diện Tối"}
      className={`relative w-9 h-9 rounded-full flex items-center justify-center transition-colors border border-neutral-300 dark:border-neutral-700 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 ${className}`}
    >
      {theme === "dark" ? (
        <Sun className="w-4 h-4 text-cyan-400" />
      ) : (
        <Moon className="w-4 h-4 text-neutral-700" />
      )}
    </button>
  );
}