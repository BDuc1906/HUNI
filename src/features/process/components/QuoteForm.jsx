"use client";

import { useState } from "react";
import { CheckCircle2, CircleAlert, Loader2, Send } from "lucide-react";
import { apiClient } from "@/shared/services/apiClient";

const initialForm = {
  fullName: "",
  company: "",
  phone: "",
  email: "",
  category: "polo",
  quantity: "",
  material: "",
  designRequest: "",
  notes: "",
};

const categoryOptions = [
  ["polo", "Đồng phục doanh nghiệp"],
  ["suit", "Đồng phục may đo"],
  ["golf", "Đồng phục thể thao & Golf"],
  ["school", "Đồng phục trường học"],
  ["accessories", "Phụ kiện doanh nghiệp"],
];

const materialOptions = [
  "Cần tư vấn từ HDC Fashion",
  "Cotton Compact",
  "Pique cá sấu 4 chiều",
  "Bamboo sợi tre",
  "Kate / sợi pha",
  "Khác",
];

function validate(form) {
  const errors = {};
  const normalizedPhone = form.phone.replace(/[\s.\-()+]/g, "");

  if (!form.fullName.trim()) errors.fullName = "Vui lòng nhập họ và tên.";
  if (!form.phone.trim()) {
    errors.phone = "Vui lòng nhập số điện thoại.";
  } else if (!/^\d{10,11}$/.test(normalizedPhone)) {
    errors.phone = "Số điện thoại cần có 10–11 chữ số.";
  }
  if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = "Email chưa đúng định dạng.";
  }
  if (!form.quantity.trim()) {
    errors.quantity = "Vui lòng nhập số lượng dự kiến.";
  } else if (!Number.isInteger(Number(form.quantity)) || Number(form.quantity) <= 0) {
    errors.quantity = "Số lượng phải là số nguyên dương.";
  } else if (Number(form.quantity) < 10) {
    errors.quantity = "Số lượng tối thiểu là 10 sản phẩm.";
  }

  return errors;
}

export default function QuoteForm() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: "idle", message: "" });

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
    if (status.type !== "idle") setStatus({ type: "idle", message: "" });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length) {
      setStatus({ type: "error", message: "Vui lòng kiểm tra các trường được đánh dấu." });
      return;
    }

    const notes = [
      form.material && `Chất liệu mong muốn: ${form.material}`,
      form.designRequest && `Yêu cầu thiết kế: ${form.designRequest}`,
      form.notes && `Ghi chú: ${form.notes}`,
    ]
      .filter(Boolean)
      .join("\n")
      .slice(0, 500);

    try {
      setStatus({ type: "loading", message: "Đang gửi yêu cầu báo giá..." });
      const result = await apiClient.post("/api/quotes", {
        fullName: form.fullName.trim(),
        company: form.company.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        category: form.category,
        quantity: Number(form.quantity),
        notes,
      });

      if (!result.success) {
        const apiMessage = result?.details?.[0]?.message || result?.error;
        throw new Error(apiMessage || "Không thể gửi yêu cầu. Vui lòng thử lại.");
      }

      setStatus({
        type: "success",
        message: "Yêu cầu đã được tiếp nhận. Chuyên viên HDC Fashion sẽ liên hệ với bạn sớm.",
      });
      setForm(initialForm);
      setErrors({});
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Không thể kết nối tới hệ thống báo giá. Vui lòng thử lại.",
      });
    }
  };

  const fieldClass = (name) =>
    `w-full rounded-xl border bg-white px-3 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:ring-2 focus:ring-brand-200 ${
      errors[name]
        ? "border-rose-500 focus:border-rose-500"
        : "border-slate-300 focus:border-brand-500"
    }`;

  return (
    <form noValidate onSubmit={handleSubmit} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl shadow-brand-950/5 sm:p-7">
      <div className="mb-6 flex items-start gap-3 border-b border-slate-100 pb-5">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
          <Send className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <h2 className="font-extrabold text-[#004f5e]">Thông tin cần báo giá</h2>
          <p className="mt-1 text-xs leading-5 text-slate-500">Các trường có dấu * là bắt buộc. Thông tin sẽ được gửi qua hệ thống báo giá của HDC Fashion.</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Họ và tên" name="fullName" value={form.fullName} error={errors.fullName} onChange={updateField} required className={fieldClass("fullName")} autoComplete="name" />
        <Field label="Tên doanh nghiệp" name="company" value={form.company} onChange={updateField} className={fieldClass("company")} autoComplete="organization" />
        <Field label="Số điện thoại" name="phone" value={form.phone} error={errors.phone} onChange={updateField} required className={fieldClass("phone")} autoComplete="tel" inputMode="tel" placeholder="0984 959 586" />
        <Field label="Email" name="email" type="email" value={form.email} error={errors.email} onChange={updateField} className={fieldClass("email")} autoComplete="email" placeholder="email@congty.vn" />
        <div>
          <label htmlFor="category" className="mb-1.5 block text-sm font-bold text-slate-700">Loại đồng phục</label>
          <select id="category" name="category" value={form.category} onChange={updateField} className={fieldClass("category")}>
            {categoryOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </div>
        <Field label="Số lượng dự kiến (tối thiểu 10)" name="quantity" type="number" min="10" step="1" value={form.quantity} error={errors.quantity} onChange={updateField} required className={fieldClass("quantity")} inputMode="numeric" placeholder="Ví dụ: 50" />
        <div>
          <label htmlFor="material" className="mb-1.5 block text-sm font-bold text-slate-700">Chất liệu mong muốn</label>
          <select id="material" name="material" value={form.material} onChange={updateField} className={fieldClass("material")}>
            <option value="">Chọn chất liệu hoặc để HDC tư vấn</option>
            {materialOptions.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
        </div>
        <TextArea label="Yêu cầu thiết kế" name="designRequest" value={form.designRequest} onChange={updateField} className={fieldClass("designRequest")} placeholder="Màu sắc, vị trí logo, phong cách hoặc thời gian cần hàng..." />
        <TextArea label="Ghi chú" name="notes" value={form.notes} onChange={updateField} className={fieldClass("notes")} placeholder="Thông tin bổ sung giúp HDC tư vấn chính xác hơn." />
      </div>

      {status.type !== "idle" && (
        <div
          role={status.type === "error" ? "alert" : "status"}
          className={`mt-5 flex gap-2 rounded-xl border p-3 text-sm ${
            status.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : status.type === "error" ? "border-rose-200 bg-rose-50 text-rose-800" : "border-brand-200 bg-brand-50 text-brand-800"
          }`}
        >
          {status.type === "loading" ? <Loader2 className="mt-0.5 h-4 w-4 shrink-0 animate-spin" aria-hidden="true" /> : status.type === "error" ? <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" /> : <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />}
          <span>{status.message}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={status.type === "loading"}
        className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-700 px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-brand-700/20 transition hover:from-brand-400 hover:to-brand-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 disabled:cursor-wait disabled:opacity-70"
      >
        {status.type === "loading" ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Send className="h-4 w-4" aria-hidden="true" />}
        NHẬN BÁO GIÁ
      </button>
    </form>
  );
}

function Field({ label, name, error, required, className, ...props }) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-bold text-slate-700">
        {label}{required && <span className="ml-1 text-rose-600">*</span>}
      </label>
      <input id={name} name={name} required={required} aria-required={required} aria-invalid={Boolean(error)} aria-describedby={error ? `${name}-error` : undefined} className={className} {...props} />
      {error && <p id={`${name}-error`} className="mt-1.5 text-xs font-medium text-rose-600">{error}</p>}
    </div>
  );
}

function TextArea({ label, name, className, ...props }) {
  return (
    <div className="sm:col-span-2">
      <label htmlFor={name} className="mb-1.5 block text-sm font-bold text-slate-700">{label}</label>
      <textarea id={name} name={name} rows="4" className={`${className} resize-y`} {...props} />
    </div>
  );
}
