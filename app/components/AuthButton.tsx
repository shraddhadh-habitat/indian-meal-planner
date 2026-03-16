'use client';

import { useAuth } from '../providers';
import { createSupabaseBrowserClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function AuthButton() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  if (loading) return null;

  if (user) {
    const avatar = user.user_metadata?.avatar_url as string | undefined;
    const name = (user.user_metadata?.full_name as string | undefined) ?? 'User';
    const initials = name.charAt(0).toUpperCase();

    return (
      <div className="flex items-center gap-2">
        {avatar ? (
          <img
            src={avatar}
            alt={name}
            className="w-7 h-7 rounded-full border-2 border-white/50"
          />
        ) : (
          <div className="w-7 h-7 rounded-full bg-white/30 flex items-center justify-center text-xs font-bold text-white border-2 border-white/50">
            {initials}
          </div>
        )}
        <button
          onClick={async () => {
            await supabase.auth.signOut();
            router.refresh();
          }}
          className="text-xs text-white/80 hover:text-white underline underline-offset-2"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => router.push('/login')}
      className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white font-semibold text-sm px-4 py-2 rounded-full transition-all"
    >
      Sign in
    </button>
  );
}
