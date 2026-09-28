"use client";

import { useState } from "react";
import { Bot, X, Send, Loader2 } from "lucide-react";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!input.trim() || loading) return;
    const next = [...messages, { role: "user", text: input }];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      setMessages([...next, { role: "model", text: data.reply }]);
    } catch {
      setMessages([...next, { role: "model", text: "Có lỗi xảy ra, vui lòng thử lại." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Nút bật/tắt — nằm ngay trong cột FloatingActions, không tự định vị riêng */}
      <button
        onClick={() => setOpen((o) => !o)}
        title="Tư vấn AI HUNI"
        className="relative w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 to-amber-400 text-[#071b34] flex items-center justify-center shadow-xl hover:shadow-2xl transition-all transform hover:scale-110 border-2 border-white"
      >
        {!open && (
          <span className="absolute inset-0 rounded-full bg-amber-400 animate-ping opacity-40" />
        )}
        {open ? <X className="w-5 h-5 relative" /> : <Bot className="w-5 h-5 relative" />}
      </button>

      {/* Cửa sổ chat — fixed riêng, chỉ hiện khi bấm mở */}
      {open && (
        <div className="fixed z-40 bottom-24 right-4 md:bottom-6 md:right-24 w-[85vw] max-w-80 h-96 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-amber-400/20">
          <div className="bg-gradient-to-r from-[#071b34] to-[#0a2540] text-white px-4 py-3 flex justify-between items-center shrink-0">
            <span className="flex items-center gap-2 font-bold text-sm">
              <Bot className="w-4 h-4 text-amber-400" />
              Tư vấn HUNI
            </span>
            <button onClick={() => setOpen(false)}>
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2 text-sm">
            {messages.length === 0 && (
              <p className="text-slate-400 text-xs text-center mt-8">
                Hỏi em về sản phẩm, chất liệu vải, giá cả...
              </p>
            )}
            {messages.map((m, i) => (
              <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
                <span
                  className={`inline-block px-3 py-2 rounded-xl max-w-[85%] ${
                    m.role === "user"
                      ? "bg-amber-400 text-[#071b34]"
                      : "bg-slate-100 text-slate-800"
                  }`}
                >
                  {m.text}
                </span>
              </div>
            ))}
            {loading && <Loader2 className="w-4 h-4 animate-spin text-amber-500" />}
          </div>

          <div className="p-2 border-t flex gap-2 shrink-0">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Nhập câu hỏi..."
              disabled={loading}
              className="flex-1 px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-amber-500"
            />
            <button
              onClick={send}
              disabled={loading}
              className="bg-gradient-to-tr from-amber-500 to-amber-400 text-[#071b34] p-2 rounded-xl disabled:opacity-60"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
