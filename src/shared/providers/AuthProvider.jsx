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
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}