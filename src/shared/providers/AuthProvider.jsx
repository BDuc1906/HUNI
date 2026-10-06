"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { authService } from "@/shared/services/apiClient";

const AuthContext = createContext({
  user: null,
  loading: false,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  setUser: () => {},
});

export function useAuth() {
  const context = useContext(AuthContext);
  return context || {
    user: null,
    loading: false,
    login: async () => {},
    register: async () => {},
    logout: () => {},
    setUser: () => {},
  };
}

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkSession() {
      // Thử đọc từ sessionStorage trước (nhanh hơn)
      const saved = typeof window !== "undefined" ? sessionStorage.getItem("huni_user") : null;
      if (saved) {
        try {
          setUser(JSON.parse(saved));
        } catch {}
      }

      // Xác thực với server (token trong httpOnly cookie tự gửi)
      try {
        const res = await authService.getMe();
        if (res?.success && res?.user) {
          setUser(res.user);
          if (typeof window !== "undefined") {
            sessionStorage.setItem("huni_user", JSON.stringify(res.user));
          }
        } else {
          // Cookie hết hạn hoặc invalid
          setUser(null);
          if (typeof window !== "undefined") {
            sessionStorage.removeItem("huni_user");
          }
        }
      } catch {
        // Không có session
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    checkSession();
  }, []);

  const login = async (emailOrObj, maybePassword) => {
    let email, password;
    if (typeof emailOrObj === "object" && emailOrObj !== null) {
      email = emailOrObj.email;
      password = emailOrObj.password;
    } else {
      email = emailOrObj;
      password = maybePassword;
    }

    const res = await authService.login({ email, password });
    if (res?.success && res?.user) {
      setUser(res.user);
      // Token đã lưu trong httpOnly cookie bởi backend
    }
    return res;
  };

  const register = async (data) => {
    return authService.register(data);
  };

  const logout = () => {
    try {
      authService.logout();
    } catch {}
    setUser(null);
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("huni_user");
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}