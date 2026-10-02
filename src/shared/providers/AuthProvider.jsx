"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { authService } from "@/shared/services/apiClient";

const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("huni_token");
    const savedUser = localStorage.getItem("huni_user");
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {}
    }
    setLoading(false);
  }, []);

  async function login(email, password) {
    const res = await authService.login({ email, password });
    if (res.success) setUser(res.user);
    return res;
  }

  async function register(data) {
    return authService.register(data);
  }

  function logout() {
    authService.logout();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}