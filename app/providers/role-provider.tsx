"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type AppRole = "guest" | "physician" | "lab";

type RoleContextValue = {
  role: AppRole;
  setRole: (r: AppRole) => void;
};

const RoleContext = createContext<RoleContextValue | undefined>(undefined);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<AppRole>("guest");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("app_role") as AppRole | null;
      if (stored) setRole(stored);
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("app_role", role);
    } catch {}
  }, [role]);

  const value = useMemo(() => ({ role, setRole }), [role]);
  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useRole() {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error("useRole must be used within RoleProvider");
  return ctx;
}
