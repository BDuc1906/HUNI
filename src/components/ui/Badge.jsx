import React from "react";

export default function Badge({ children, variant = "default", className = "" }) {
  const variants = {
    default:
      "bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200 border-neutral-200 dark:border-neutral-700",
    dark:
      "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 border-neutral-900 dark:border-white",
    outline:
      "border-neutral-300 text-neutral-700 dark:border-neutral-700 dark:text-neutral-300",
    success:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
        variants[variant] || variants.default
      } ${className}`}
    >
      {children}
    </span>
  );
}
