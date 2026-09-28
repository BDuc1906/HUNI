// ==================================================
// src/app/api/chat/route.js
// POST /api/chat — Trợ lý AI tư vấn HUNI
// Phiên bản: Gemini 2.5 Flash + Retry + Fallback đa model
// ==================================================

import { NextResponse } from "next/server";
import * as shopData from "@/shared/data";

// ==================================================
// 1. RÚT GỌN DỮ LIỆU — giảm token, tăng tốc
// ==================================================
const compactData = {
  brand: {
    name: shopData.BRAND_INFO.brandName,
    parent: shopData.BRAND_INFO.parentCompany,
    slogan: shopData.BRAND_INFO.slogan,
    ceo: {
      name: shopData.BRAND_INFO.ceo.name,
      title: shopData.BRAND_INFO.ceo.title,
    },
    contact: shopData.BRAND_INFO.contact,
    commitments: shopData.BRAND_INFO.commitments.map((c) => ({
      title: c.title,
      desc: c.desc,
    })),
    stats: shopData.BRAND_INFO.stats,
  },
  categories: shopData.CATEGORIES.filter((c) => c.id !== "all").map((c) => ({
    id: c.id,
    name: c.name,
    desc: c.desc,
  })),
  products: shopData.PRODUCTS.map((p) => ({
    id: p.id,
    title: p.title,
    category: p.category,
    material: p.material,
    price: p.price,
    originalPrice: p.originalPrice,
    unit: p.unit,
    wholesaleTiers: p.wholesaleTiers?.map((t) => ({
      range: t.label,
      price: t.price,
    })),
    colors: p.colors?.map((c) => c.name),
    sizes: p.sizes,
    features: p.features,
    description: p.description,
  })),
  fabrics: shopData.FABRIC_COMPARISONS,
  process: shopData.PROCESS_STEPS,
  faqs: shopData.FAQS,
};

// ==================================================
// 2. SYSTEM PROMPT
// ==================================================
const SYSTEM_PROMPT = `Bạn là "Huni Assistant" — trợ lý tư vấn bán hàng chuyên nghiệp của HUNI UNIFORM (thương hiệu đồng phục doanh nghiệp cao cấp thuộc HDC GROUP VN).

## VAI TRÒ
Tư vấn khách hàng (chủ yếu là doanh nghiệp, tổ chức, trường học) về sản phẩm đồng phục, chất liệu vải, bảng giá sỉ, quy trình đặt may và chính sách ưu đãi.

## PHONG CÁCH GIAO TIẾP
- Xưng "em", gọi khách là "anh/chị". Thân thiện, nhiệt tình, chuyên nghiệp.
- Trả lời NGẮN GỌN, đi thẳng vào vấn đề, không lan man.
- Câu trả lời lý tưởng: 2-5 câu hoặc 3-5 gạch đầu dòng.
- Sử dụng emoji phù hợp, tiết chế (tối đa 1-2 emoji/câu trả lời).

## QUY TẮC NỘI DUNG
1. **CHỈ** dùng thông tin từ DỮ LIỆU bên dưới. TUYỆT ĐỐI không bịa giá, không bịa sản phẩm, không bịa chính sách.
2. Khi khách hỏi giá → báo giá theo mốc số lượng (sỉ càng nhiều càng rẻ).
3. Khi khách hỏi sản phẩm → giới thiệu 1-3 sản phẩm phù hợp nhất, kèm giá và điểm nổi bật.
4. Khi khách hỏi chất liệu → so sánh ngắn 2-3 loại vải phù hợp nhu cầu.
5. Khi khách hỏi quy trình → liệt kê 5 bước ngắn gọn.
6. Khi không có thông tin → nói: "Em chưa có thông tin này, anh/chị vui lòng gọi hotline 0984.959.586 để được tư vấn chi tiết ạ."
7. Không hứa hẹn những gì không có trong dữ liệu.

## ĐỊNH DẠNG
- Dùng gạch đầu dòng "-" cho danh sách, tối đa 5 mục.
- Đơn vị tiền tệ: VNĐ (VD: 155.000đ).
- KHÔNG dùng markdown phức tạp (###, **, bảng biểu).
- KHÔNG viết đoạn văn dài quá 5 dòng.

## DỮ LIỆU THƯƠNG HIỆU
${JSON.stringify(compactData)}`;

// ==================================================
// 3. DANH SÁCH MODEL — Ưu tiên model ổn định
// gemini-2.5-flash hiện là model ít bị 503 nhất
// ==================================================
const MODEL_CANDIDATES = [
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
  "gemini-3.8-flash",
  "gemini-flash-latest",
];

// ==================================================
// 4. CẤU HÌNH GENERATION
// ==================================================
const GENERATION_CONFIG = {
  temperature: 0.65,
  topP: 0.9,
  topK: 40,
  maxOutputTokens: 2048,
  candidateCount: 1,
};

const MAX_HISTORY = 10;

// ==================================================
// 5. GỌI GEMINI VỚI RETRY CHO LỖI 503/429
// Backoff: 0ms → 500ms → 1500ms
// ==================================================
async function callGeminiWithRetry(url, payload, maxRetries = 2) {
  const DELAYS = [0, 500, 1500];

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    if (attempt > 0) {
      const wait = DELAYS[attempt] || 1500;
      console.log(
        `[chat] ⏳ Đợi ${wait}ms rồi retry (lần ${attempt}/${maxRetries})...`
      );
      await new Promise((r) => setTimeout(r, wait));
    }

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const json = await res.json();

    if (res.ok) return { ok: true, status: res.status, json };

    const isRetryable = res.status === 503 || res.status === 429;
    const isLastAttempt = attempt === maxRetries;

    if (!isRetryable || isLastAttempt) {
      return { ok: false, status: res.status, json };
    }

    console.warn(
      `[chat] ⚠️ Lỗi ${res.status} (${
        json?.error?.status || "UNKNOWN"
      }), sẽ thử lại...`
    );
  }

  return { ok: false, status: 0, json: null };
}

// ==================================================
// 6. POST HANDLER
// ==================================================
export async function POST(req) {
  // ----- Kiểm tra API key -----
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("[chat] ❌ GEMINI_API_KEY chưa được cấu hình");
    return NextResponse.json(
      {
        reply:
          "Xin lỗi, hệ thống tư vấn đang bảo trì. Anh/chị vui lòng gọi hotline 0984.959.586 để được hỗ trợ ngay ạ.",
      },
      { status: 200 }
    );
  }

  try {
    // ----- Parse & validate request -----
    const { messages } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { reply: "Anh/chị vui lòng nhập câu hỏi ạ 😊" },
        { status: 200 }
      );
    }

    // ----- Chuẩn hóa lịch sử hội thoại -----
    const cleanedMessages = messages
      .filter(
        (m) => m && typeof m.text === "string" && m.text.trim().length > 0
      )
      .slice(-MAX_HISTORY)
      .map((m) => ({
        role: m.role === "model" ? "model" : "user",
        parts: [{ text: m.text.trim().slice(0, 1000) }],
      }));

    if (cleanedMessages.length === 0) {
      return NextResponse.json(
        { reply: "Anh/chị vui lòng nhập câu hỏi ạ 😊" },
        { status: 200 }
      );
    }

    // ----- Chuẩn bị payload gửi Gemini -----
    const requestPayload = {
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: cleanedMessages,
      generationConfig: GENERATION_CONFIG,
      safetySettings: [
        { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_ONLY_HIGH" },
        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_ONLY_HIGH" },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_ONLY_HIGH",
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_ONLY_HIGH",
        },
      ],
    };

    // ----- Gọi lần lượt các model với retry -----
    let reply = null;
    let lastError = null;

    for (const model of MODEL_CANDIDATES) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        console.log(`[chat] 🚀 Thử model: ${model}`);

        const { ok, status, json } = await callGeminiWithRetry(
          url,
          requestPayload
        );

        if (!ok) {
          lastError = { model, status, body: json };
          console.warn(
            `[chat] ⚠️ ${model} thất bại (${status}), chuyển model tiếp...`
          );
          continue;
        }

        const candidate = json?.candidates?.[0];
        const finishReason = candidate?.finishReason;

        if (finishReason === "SAFETY") {
          lastError = { model, reason: "SAFETY" };
          console.warn(`[chat] ⚠️ ${model} bị chặn bởi safety filter`);
          continue;
        }

        reply = candidate?.content?.parts?.[0]?.text?.trim() || null;

        if (reply) {
          console.log(
            `[chat] ✅ ${model} OK (${reply.length} ký tự, finish: ${
              finishReason || "STOP"
            })`
          );
          break;
        }

        lastError = { model, reason: "EMPTY" };
      } catch (err) {
        lastError = { model, error: err.message };
        console.warn(`[chat] ⚠️ ${model} exception:`, err.message);
      }
    }

    // ----- Xử lý khi tất cả model thất bại -----
    if (!reply) {
      console.error(
        "[chat] ❌ Tất cả model thất bại:",
        JSON.stringify(lastError, null, 2)
      );

      const isTemporary =
        lastError?.status === 503 || lastError?.status === 429;

      return NextResponse.json(
        {
          reply: isTemporary
            ? "Hệ thống AI đang quá tải tạm thời 😅 Anh/chị thử lại sau 30 giây, hoặc gọi hotline 0984.959.586 để được tư vấn trực tiếp ạ."
            : "Xin lỗi anh/chị, em đang gặp sự cố kỹ thuật. Anh/chị vui lòng gọi hotline 0984.959.586 để được hỗ trợ ạ 🙏",
        },
        { status: 200 }
      );
    }

    // ----- Trả kết quả thành công -----
    return NextResponse.json({ reply });
  } catch (error) {
    console.error("[chat] ❌ Lỗi server:", error);
    return NextResponse.json(
      {
        reply:
          "Xin lỗi anh/chị, em đang gặp sự cố kết nối. Anh/chị vui lòng gọi hotline 0984.959.586 để được hỗ trợ ạ 🙏",
      },
      { status: 200 }
    );
  }
}