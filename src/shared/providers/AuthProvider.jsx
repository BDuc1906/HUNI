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
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("huni_token") : null;
      const savedUser = typeof window !== "undefined" ? localStorage.getItem("huni_user") : null;
      if (token && savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch {}
    setLoading(false);
  }, []);

  async function login(credentials) {
    const res = await authService.login(credentials);
    if (res?.success && res?.user) {
      setUser(res.user);
    }
    return res;
  }

  async function register(data) {
    return authService.register(data);
  }

  function logout() {
    try {
      authService.logout();
    } catch {}
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}