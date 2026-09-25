"use client";

import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log lỗi ra console dev — production có thể gửi tới Sentry
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      // Nếu có custom fallback → dùng
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Fallback mặc định
      return (
        <section className="py-12 sm:py-16 bg-slate-50 border-t border-slate-200">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-[#071b34] mb-2">
              Có lỗi xảy ra khi tải phần này
            </h3>
            <p className="text-sm text-slate-600 mb-5 max-w-md mx-auto">
              {this.props.name
                ? `Phần "${this.props.name}" gặp sự cố. Quý khách vui lòng thử lại hoặc liên hệ hotline.`
                : "Quý khách vui lòng thử lại hoặc liên hệ hotline để được hỗ trợ."}
            </p>
            <button
              onClick={this.handleReset}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-[#071b34] font-bold text-sm rounded-xl shadow-md active:scale-[0.98] transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Thử lại</span>
            </button>
          </div>
        </section>
      );
    }

    return this.props.children;
  }
}