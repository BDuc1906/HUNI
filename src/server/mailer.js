// ==================================================
// src/server/mailer.js — Gửi email với Resend
// ==================================================

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const NOTIFY_EMAIL = process.env.ORDER_NOTIFICATION_EMAIL;

// ==================================================
// Gửi email thông báo đơn hàng mới cho admin
// ==================================================
export async function sendOrderNotificationEmail(order) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("[mailer] RESEND_API_KEY chưa cấu hình — bỏ qua gửi email");
    return null;
  }

  const itemsHtml = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding:8px;border-bottom:1px solid #eee;">${item.productName}</td>
        <td style="padding:8px;border-bottom:1px solid #eee;text-align:center;">${item.quantity}</td>
        <td style="padding:8px;border-bottom:1px solid #eee;text-align:right;">${item.unitPrice.toLocaleString("vi-VN")} đ</td>
      </tr>`
    )
    .join("");

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
      <div style="background:linear-gradient(135deg,#071b34,#0a2540);color:white;padding:20px;border-radius:12px 12px 0 0;">
        <h1 style="margin:0;font-size:20px;">🔔 ĐƠN HÀNG MỚI</h1>
        <p style="margin:6px 0 0 0;opacity:0.9;font-size:13px;">HUNI UNIFORM — HDC GROUP VN</p>
      </div>

      <div style="background:#f8fafc;padding:20px;border:1px solid #e2e8f0;border-top:none;">
        <h2 style="margin:0 0 12px 0;font-size:16px;color:#071b34;">
          Mã đơn: <span style="color:#d4af37;">${order.orderNumber}</span>
        </h2>

        <table style="width:100%;font-size:13px;color:#334155;margin-bottom:16px;">
          <tr><td style="padding:4px 0;"><strong>Khách hàng:</strong></td><td>${order.customer.fullName}</td></tr>
          <tr><td style="padding:4px 0;"><strong>SĐT:</strong></td><td>${order.customer.phone}</td></tr>
          <tr><td style="padding:4px 0;"><strong>Email:</strong></td><td>${order.customer.email || "—"}</td></tr>
          <tr><td style="padding:4px 0;"><strong>Công ty:</strong></td><td>${order.customer.company || "—"}</td></tr>
          <tr><td style="padding:4px 0;"><strong>Địa chỉ:</strong></td><td>${order.customer.address}</td></tr>
          <tr><td style="padding:4px 0;"><strong>Thanh toán:</strong></td><td>${order.paymentMethod}</td></tr>
        </table>

        <table style="width:100%;font-size:13px;border-collapse:collapse;background:white;border-radius:8px;overflow:hidden;">
          <thead style="background:#071b34;color:white;">
            <tr>
              <th style="padding:10px;text-align:left;">Sản phẩm</th>
              <th style="padding:10px;text-align:center;">SL</th>
              <th style="padding:10px;text-align:right;">Đơn giá</th>
            </tr>
          </thead>
          <tbody>${itemsHtml}</tbody>
        </table>

        <div style="text-align:right;margin-top:16px;font-size:15px;">
          <div style="padding:4px 0;">Tạm tính: <strong>${order.subtotal.toLocaleString("vi-VN")} đ</strong></div>
          ${order.discount > 0 ? `<div style="padding:4px 0;color:#059669;">Giảm: <strong>-${order.discount.toLocaleString("vi-VN")} đ</strong></div>` : ""}
          <div style="padding:8px 0;font-size:18px;border-top:2px solid #d4af37;margin-top:8px;">
            TỔNG: <strong style="color:#d4af37;">${order.total.toLocaleString("vi-VN")} đ</strong>
          </div>
        </div>

        ${order.notes ? `<div style="margin-top:16px;padding:12px;background:#fef3c7;border-left:4px solid #d4af37;border-radius:4px;font-size:13px;"><strong>Ghi chú:</strong> ${order.notes}</div>` : ""}
      </div>

      <div style="text-align:center;padding:16px;color:#64748b;font-size:12px;">
        Vui lòng liên hệ khách trong vòng 15 phút!
      </div>
    </div>
  `;

  try {
    const result = await resend.emails.send({
      from: "HUNI UNIFORM <onboarding@resend.dev>",
      to: NOTIFY_EMAIL,
      subject: `🔔 Đơn mới ${order.orderNumber} — ${order.customer.fullName}`,
      html,
    });
    return result;
  } catch (error) {
    console.error("[mailer] Lỗi gửi email:", error);
    return null;
  }
}

// ==================================================
// Gửi email xác nhận cho khách (nếu có email)
// ==================================================
export async function sendCustomerConfirmationEmail(order) {
  if (!process.env.RESEND_API_KEY || !order.customer.email) return null;

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
      <div style="background:linear-gradient(135deg,#071b34,#0a2540);color:white;padding:24px;border-radius:12px 12px 0 0;text-align:center;">
        <h1 style="margin:0;font-size:22px;">Cảm ơn quý khách!</h1>
        <p style="margin:8px 0 0 0;opacity:0.9;">HUNI UNIFORM đã nhận đơn hàng của bạn</p>
      </div>

      <div style="background:white;padding:24px;border:1px solid #e2e8f0;border-top:none;">
        <p style="font-size:14px;color:#334155;">Xin chào <strong>${order.customer.fullName}</strong>,</p>
        <p style="font-size:14px;color:#334155;">
          HUNI đã tiếp nhận đơn hàng <strong style="color:#d4af37;">${order.orderNumber}</strong>
          và sẽ liên hệ với quý khách trong vòng <strong>15 phút</strong> để xác nhận chi tiết.
        </p>

        <div style="background:#fef3c7;padding:16px;border-radius:8px;margin:20px 0;text-align:center;">
          <div style="font-size:12px;color:#92400e;">Tổng thanh toán dự kiến</div>
          <div style="font-size:24px;font-weight:bold;color:#071b34;margin-top:4px;">
            ${order.total.toLocaleString("vi-VN")} đ
          </div>
        </div>

        <p style="font-size:13px;color:#64748b;">
          Mọi thắc mắc xin liên hệ hotline <strong>0984.959.586</strong> hoặc email
          <strong>dongphuchuni@gmail.com</strong>.
        </p>
      </div>

      <div style="text-align:center;padding:16px;color:#64748b;font-size:12px;">
        © 2026 HUNI UNIFORM — HDC GROUP VN
      </div>
    </div>
  `;

  try {
    return await resend.emails.send({
      from: "HUNI UNIFORM <onboarding@resend.dev>",
      to: order.customer.email,
      subject: `Xác nhận đơn hàng ${order.orderNumber} — HUNI UNIFORM`,
      html,
    });
  } catch (error) {
    console.error("[mailer] Lỗi gửi email khách:", error);
    return null;
  }
}