'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/providers';

type Visit = { id: string; path: string; user_id: string | null; ip: string; created_at: string };
type Group = { id: string; name: string; share_code: string; created_at: string; group_members: { count: number }[] };
type TelegramChat = { chat_id: string; created_at: string };
type AuthUser = { id: string; email?: string; created_at: string; user_metadata?: { full_name?: string; avatar_url?: string } };

type AdminData = {
  visitCount: number;
  recentVisits: Visit[];
  groups: Group[];
  telegramChats: TelegramChat[];
  authUsers: AuthUser[];
};

const ADMIN_EMAIL = 'shraddhadh@gmail.com';

export default function AdminPage() {
  const { user, loading } = useAuth();
  const [data, setData] = useState<AdminData | null>(null);

  const isAdmin = user?.email?.toLowerCase() === ADMIN_EMAIL;

  useEffect(() => {
    if (!isAdmin) return;
    fetch('/api/admin/data')
      .then(res => res.json())
      .then(json => setData(json));
  }, [isAdmin]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading…</div>;
  }

  if (!isAdmin) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Access denied.</div>;
  }

  if (!data) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading…</div>;
  }

  const { visitCount, recentVisits, groups, telegramChats, authUsers } = data;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-orange-600 to-amber-500 text-white px-6 py-5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Bhojan Planner — Admin</h1>
            <p className="text-orange-100 text-sm mt-0.5">Logged in as {user?.email}</p>
          </div>
          <a href="/" className="text-sm text-white/80 hover:text-white underline">← Back to app</a>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard label="Total visits" value={visitCount ?? 0} icon="👁" />
          <StatCard label="Users" value={authUsers?.length ?? 0} icon="👤" />
          <StatCard label="Groups" value={groups?.length ?? 0} icon="👨‍👩‍👧" />
          <StatCard label="Telegram subs" value={telegramChats?.length ?? 0} icon="✈️" />
        </div>

        <Section title="Recent Visits" icon="👁">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="pb-2 pr-4 font-medium">Path</th>
                  <th className="pb-2 pr-4 font-medium">User</th>
                  <th className="pb-2 pr-4 font-medium">IP</th>
                  <th className="pb-2 font-medium">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {(recentVisits ?? []).map((v) => (
                  <tr key={v.id} className="hover:bg-gray-50">
                    <td className="py-2 pr-4 font-mono text-xs text-gray-700">{v.path}</td>
                    <td className="py-2 pr-4 text-xs text-gray-500">{v.user_id ? v.user_id.slice(0, 8) + '…' : '—'}</td>
                    <td className="py-2 pr-4 text-xs text-gray-500">{v.ip}</td>
                    <td className="py-2 text-xs text-gray-400">{new Date(v.created_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section title="Users" icon="👤">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="pb-2 pr-4 font-medium">Name</th>
                  <th className="pb-2 pr-4 font-medium">Email</th>
                  <th className="pb-2 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {(authUsers ?? []).map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="py-2 pr-4 flex items-center gap-2">
                      {u.user_metadata?.avatar_url && (
                        <img src={u.user_metadata.avatar_url} alt="" className="w-6 h-6 rounded-full" />
                      )}
                      <span>{u.user_metadata?.full_name ?? '—'}</span>
                    </td>
                    <td className="py-2 pr-4 text-gray-600">{u.email}</td>
                    <td className="py-2 text-xs text-gray-400">{new Date(u.created_at).toLocaleDateString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section title="Groups" icon="👨‍👩‍👧">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="pb-2 pr-4 font-medium">Name</th>
                  <th className="pb-2 pr-4 font-medium">Code</th>
                  <th className="pb-2 pr-4 font-medium">Members</th>
                  <th className="pb-2 font-medium">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {(groups ?? []).map((g) => (
                  <tr key={g.id} className="hover:bg-gray-50">
                    <td className="py-2 pr-4 font-medium">{g.name}</td>
                    <td className="py-2 pr-4 font-mono text-orange-600 font-bold tracking-widest">{g.share_code}</td>
                    <td className="py-2 pr-4 text-gray-600">{g.group_members?.[0]?.count ?? 0}</td>
                    <td className="py-2 text-xs text-gray-400">{new Date(g.created_at).toLocaleDateString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section title="Telegram Subscribers" icon="✈️">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="pb-2 pr-4 font-medium">Chat ID</th>
                  <th className="pb-2 font-medium">Subscribed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {(telegramChats ?? []).map((t) => (
                  <tr key={t.chat_id} className="hover:bg-gray-50">
                    <td className="py-2 pr-4 font-mono text-xs">{t.chat_id}</td>
                    <td className="py-2 text-xs text-gray-400">{new Date(t.created_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      </main>
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: number; icon: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <p className="text-3xl mb-1">{icon}</p>
      <p className="text-2xl font-bold text-gray-800">{value.toLocaleString()}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}

function Section({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
      <h2 className="text-lg font-bold text-gray-800 mb-4">{icon} {title}</h2>
      {children}
    </div>
  );
}
