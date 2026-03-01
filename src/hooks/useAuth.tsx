import { createContext, useContext, useEffect, useState, useRef, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  role: string;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState("viewer");
  const [loading, setLoading] = useState(true);
  const initialized = useRef(false);

  const resolveRole = async (u: User | null) => {
    if (!u) {
      setUser(null);
      setRole("viewer");
      setLoading(false);
      return;
    }
    setUser(u);
    try {
      const { data } = await supabase.rpc("is_admin");
      setRole(data ? "admin" : "viewer");
    } catch {
      setRole("viewer");
    }
    setLoading(false);
  };

  useEffect(() => {
    // Get initial session first
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!initialized.current) {
        initialized.current = true;
        resolveRole(session?.user ?? null);
      }
    });

    // Listen for future changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (initialized.current) {
        resolveRole(session?.user ?? null);
      } else {
        initialized.current = true;
        resolveRole(session?.user ?? null);
      }
    });

    // Safety timeout - never stay loading forever
    const timeout = setTimeout(() => {
      if (loading) setLoading(false);
    }, 5000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
