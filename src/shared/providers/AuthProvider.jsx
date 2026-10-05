"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { SessionProvider } from "next-auth/react";

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

  const login = async () => {};
  const register = async () => {};
  const logout = () => {
    try {
      localStorage.removeItem("huni_token");
      localStorage.removeItem("huni_user");
    } catch {}
    setUser(null);
  };

  return (
    <SessionProvider>
      <AuthContext.Provider value={{ user, loading, login, register, logout, setUser }}>
        {children}
      </AuthContext.Provider>
    </SessionProvider>
  );
}