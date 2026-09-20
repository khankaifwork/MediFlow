import { useState, useEffect, type ReactNode } from "react";
import type { User } from "../types/user";
import { getCurrentUser } from "../services/auth.service";
import { AuthContext } from "./AuthContextDef";

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("access_token")
  );
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    async function initAuth() {
      const storedToken = localStorage.getItem("access_token");
      if (!storedToken) {
        if (isMounted) {
          setUser(null);
          setLoading(false);
        }
        return;
      }

      try {
        const profile = await getCurrentUser();
        if (isMounted) {
          setUser(profile);
        }
      } catch (err) {
        console.error("Failed to restore session:", err);
        localStorage.removeItem("access_token");
        if (isMounted) {
          setToken(null);
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    initAuth();

    return () => {
      isMounted = false;
    };
  }, [token]);

  async function login(newToken: string) {
    localStorage.setItem("access_token", newToken);
    setToken(newToken);
    setLoading(true);
    try {
      const profile = await getCurrentUser();
      setUser(profile);
    } catch (err) {
      console.error("Failed to load user after login:", err);
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem("access_token");
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}