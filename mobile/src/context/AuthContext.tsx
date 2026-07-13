import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import * as authService from "../services/authService";
import { User } from "../types";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  signup: (input: { name: string; email: string; password: string; inviteCode?: string }) => Promise<void>;
  login: (input: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

async function persistSession(user: User, accessToken: string, refreshToken: string) {
  await AsyncStorage.multiSet([
    ["user", JSON.stringify(user)],
    ["accessToken", accessToken],
    ["refreshToken", refreshToken],
  ]);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session on cold start
  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem("user");
      if (stored) setUser(JSON.parse(stored));
      setIsLoading(false);
    })();
  }, []);

  const signup: AuthContextValue["signup"] = async (input) => {
    const res = await authService.signup(input);
    await persistSession(res.user, res.accessToken, res.refreshToken);
    setUser(res.user);
  };

  const login: AuthContextValue["login"] = async (input) => {
    const res = await authService.login(input);
    await persistSession(res.user, res.accessToken, res.refreshToken);
    setUser(res.user);
  };

  const logout = async () => {
    const refreshToken = await AsyncStorage.getItem("refreshToken");
    if (refreshToken) {
      // Best-effort — log out locally even if this request fails
      authService.logout(refreshToken).catch(() => {});
    }
    await AsyncStorage.multiRemove(["user", "accessToken", "refreshToken"]);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
