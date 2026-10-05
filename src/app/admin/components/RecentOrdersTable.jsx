"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowUpDown,
  Search,
  ChevronDown,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";
import { useTheme } from "@/shared/providers/ThemeProvider";

const SAMPLE_TRANSACTIONS = [
  {
    id: "#04910",
    customer: "Ryan Korsoaard",
    product: "Ergo Office Chair - Classic Edition",
    status: "Success",
    qty: 12,
    unitPrice: "$3,450",
    totalAmount: "$41,400",
  },
  {
    id: "#04911",
    customer: "Sophia Montgomery",
    product: "Premium Cotton Oxford Shirt",
    status: "Success",
    qty: 48,
    unitPrice: "$1,280",
    totalAmount: "$61,440",
  },
  {
    id: "#04912",
    customer: "Alexander Wright",
    product: "Custom Tailored Corporate Blazer",
    status: "Pending",
    qty: 25,
    unitPrice: "$2,890",
    totalAmount: "$72,250",
  },
  {
    id: "#04913",
    customer: "Elena Rostova",
    product: "Breathable Pique Polo Uniform",
    status: "Success",
    qty: 150,
    unitPrice: "$420",
    totalAmount: "$63,000",
  },
  {
    id: "#04914",
    customer: "Marcus Vance",
    product: "Quick-Dry Performance Sportswear",
    status: "Success",
    qty: 80,
    unitPrice: "$560",
    totalAmount: "$44,800",
  },
];

export default function RecentOrdersTable({ orders = [] }) {
  const { theme, currentAccent } = useTheme();
  const isDark = theme === "dark";
  const [selectedIds, setSelectedIds] = useState(["#04910"]);

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div
      className={`rounded-2xl transition-all duration-300 border overflow-hidden ${
        isDark
          ? "bg-[#131926] border-[#1E293B] text-white shadow-lg shadow-black/20"
          : "bg-white border-slate-200/80 text-slate-900 shadow-xs"
      }`}
    >
      {/* Table Header Row: Search & Filter */}
      <div
        className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-dashed ${
          isDark ? "border-[#1E293B]" : "border-slate-200/80"
        }`}
      >
        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-bold uppercase tracking-wider ${
              isDark ? "text-slate-200" : "text-slate-800"
            }`}
          >
            RECENT TRANSACTIONS
          </span>
          <span
            className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
              isDark
                ? currentAccent.bgActiveDark
                : currentAccent.bgActiveLight
            }`}
          >
            5 orders
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search transactions..."
              className={`text-xs pl-7 pr-3 py-1.5 rounded-xl border outline-none w-44 sm:w-52 transition-all ${
                isDark
                  ? "bg-[#0E131F] border-[#1E293B] text-white placeholder:text-slate-500 focus:border-cyan-500"
                  : "bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-slate-400"
              }`}
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <Link
            href="/admin/orders"
            className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-colors ${
              isDark
                ? "bg-[#1A2337] border-[#2A3B5C] text-slate-300 hover:text-white"
                : "bg-slate-50 border-slate-200 text-slate-700 hover:text-black"
            }`}
          >
            View All
          </Link>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr
              className={`border-b border-dashed text-[11px] font-bold uppercase tracking-wider ${
                isDark
                  ? "border-[#1E293B] text-slate-400 bg-[#0E131F]/80"
                  : "border-slate-200 text-slate-500 bg-slate-50/75"
              }`}
            >
              <th className="py-3 px-4 w-10">
                <input
                  type="checkbox"
                  className="rounded border-slate-400 cursor-pointer"
                />
              </th>
              <th className="py-3 px-4 font-mono">
                <div className="flex items-center gap-1 cursor-pointer">
                  <span>ID</span>
                  <ArrowUpDown className="w-3 h-3 opacity-60" />
                </div>
              </th>
              <th className="py-3 px-4">
                <div className="flex items-center gap-1 cursor-pointer">
                  <span>CUSTOMER</span>
                  <ArrowUpDown className="w-3 h-3 opacity-60" />
                </div>
              </th>
              <th className="py-3 px-4">
                <div className="flex items-center gap-1 cursor-pointer">
                  <span>PRODUCT</span>
                  <ArrowUpDown className="w-3 h-3 opacity-60" />
                </div>
              </th>
              <th className="py-3 px-4">
                <div className="flex items-center gap-1 cursor-pointer">
                  <span>STATUS</span>
                  <ArrowUpDown className="w-3 h-3 opacity-60" />
                </div>
              </th>
              <th className="py-3 px-4">
                <div className="flex items-center gap-1 cursor-pointer">
                  <span>QTY</span>
                  <ArrowUpDown className="w-3 h-3 opacity-60" />
                </div>
              </th>
              <th className="py-3 px-4 text-right">
                <div className="flex items-center justify-end gap-1 cursor-pointer">
                  <span>UNIT PRICE</span>
                  <ArrowUpDown className="w-3 h-3 opacity-60" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody
            className={`divide-y ${
              isDark ? "divide-[#1E293B]/70" : "divide-slate-100"
            }`}
          >
            {SAMPLE_TRANSACTIONS.map((row) => {
              const isChecked = selectedIds.includes(row.id);

              return (
                <tr
                  key={row.id}
                  className={`transition-colors ${
                    isDark
                      ? "hover:bg-[#1A2337]/60"
                      : "hover:bg-slate-50/80"
                  }`}
                >
                  <td className="py-3.5 px-4">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleSelect(row.id)}
                      className="rounded cursor-pointer"
                    />
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-400">
                    {row.id}
                  </td>
                  <td className="py-3.5 px-4 font-bold">
                    <span
                      className={isDark ? "text-slate-200" : "text-slate-900"}
                    >
                      {row.customer}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`truncate max-w-[200px] inline-block ${
                        isDark ? "text-slate-400" : "text-slate-600"
                      }`}
                    >
                      {row.product}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    {row.status === "Success" ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span>Success</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        <span>Pending</span>
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold">
                    {row.qty}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold">
                    {row.unitPrice}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
