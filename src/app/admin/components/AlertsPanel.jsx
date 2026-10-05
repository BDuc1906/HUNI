"use client";

import React from "react";
import Link from "next/link";
import {
  AlertCircle, Clock, FileText, RotateCcw, TrendingUp, ArrowRight,
  Bell,
} from "lucide-react";

const ICON_MAP = {
  Clock: Clock,
  FileText: FileText,
  RotateCcw: RotateCcw,
  TrendingUp: TrendingUp,
};

const TYPE_STYLES = {
  danger:  { bg: "bg-rose-50",     border: "border-rose-200",     icon: "bg-rose-100 text-rose-600",         text: "text-rose-700",     cta: "text-rose-700 hover:bg-rose-100" },
  warning: { bg: "bg-amber-50",    border: "border-amber-200",    icon: "bg-amber-100 text-amber-600",       text: "text-amber-700",    cta: "text-amber-700 hover:bg-amber-100" },
  info:    { bg: "bg-sky-50",      border: "border-sky-200",      icon: "bg-sky-100 text-sky-600",           text: "text-sky-700",      cta: "text-sky-700 hover:bg-sky-100" },
  success: { bg: "bg-emerald-50",  border: "border-emerald-200",  icon: "bg-emerald-100 text-emerald-600",   text: "text-emerald-700",  cta: "text-emerald-700 hover:bg-emerald-100" },
};

export default function AlertsPanel({ alerts = [] }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="relative p-2 rounded-xl bg-[#0097B2]/10 text-[#0097B2] border border-[#0097B2]/20">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-rose-500 ring-2 ring-white animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Cần Xử Lý</h3>
            <p className="text-xs text-slate-500">{alerts.length} việc quan trọng</p>
          </div>
        </div>
      </div>

      <div className="space-y-2 flex-1 overflow-y-auto">
        {alerts.map((alert) => {
          const Icon = ICON_MAP[alert.icon] || AlertCircle;
          const style = TYPE_STYLES[alert.type] || TYPE_STYLES.info;

          return (
            <div
              key={alert.id}
              className={`p-3 rounded-xl border ${style.bg} ${style.border} transition-all hover:shadow-md`}
            >
              <div className="flex items-start gap-2.5">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${style.icon}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-semibold leading-snug ${style.text}`}>
                    {alert.title}
                  </p>
                  <Link
                    href={alert.action}
                    className={`mt-2 inline-flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-md transition-colors ${style.cta}`}
                  >
                    <span>{alert.cta}</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}