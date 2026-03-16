'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

type AuthContext = {
  user: User | null;
  loading: boolean;
};

const Context = createContext<AuthContext>({ user: null, loading: true });

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const supabase = createSupabaseBrowserClient();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <Context.Provider value={{ user, loading }}>{children}</Context.Provider>
  );
}

export const useAuth = () => useContext(Context);
