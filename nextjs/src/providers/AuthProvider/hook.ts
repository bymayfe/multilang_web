// providers/authProviders/hook.ts

import { useContext } from "react";
import { AuthContext, AuthContextType } from "./index";

// 🪝 Hook ile kullanımı
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
