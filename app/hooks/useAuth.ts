"use client";

import { useEffect, useState } from "react";

export interface User {
  login_id: number;
  firstname: string;
  username: string;
  phone_num: string;
  role_id: number;
  role_name: string;
  laboratory_id?: number | null;
  physician_id?: number | null;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get user info from localStorage (set during login)
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch (e) {
        console.error("Failed to parse user data:", e);
      }
    }
    setLoading(false);
  }, []);

  const logout = async () => {
    // Call logout API
    await fetch("/api/auth/logout", { method: "POST" });
    // Clear user from localStorage
    localStorage.removeItem("user");
    setUser(null);
    // Redirect to login
    window.location.href = "/login";
  };

  return { user, loading, logout };
}

