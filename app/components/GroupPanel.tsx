'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../providers';
import { WeeklyPlan } from '../types';

type Group = {
  id: string;
  name: string;
  share_code: string;
};

type Props = {
  currentPlan: WeeklyPlan;
  onGroupPlanLoaded: (plan: WeeklyPlan) => void;
  onGroupChange: (groupId: string | null) => void;
};

export default function GroupPanel({ currentPlan, onGroupPlanLoaded, onGroupChange }: Props) {
  const { user } = useAuth();
  const [group, setGroup] = useState<Group | null>(null);
  const [mode, setMode] = useState<'idle' | 'creating' | 'joining'>('idle');
  const [inputName, setInputName] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  // Persist active group in localStorage
  useEffect(() => {
    const saved = localStorage.getItem('aharam_group');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Group;
        setGroup(parsed);
        onGroupChange(parsed.id);
        // Load group plan
        fetch(`/api/groups/${parsed.id}/plan`)
          .then((r) => r.json())
          .then((data) => {
            if (data.plan) onGroupPlanLoaded(data.plan);
          })
          .catch(() => {});
      } catch {
        localStorage.removeItem('aharam_group');
      }
    }
  }, []);

  const saveGroup = (g: Group | null) => {
    if (g) {
      localStorage.setItem('aharam_group', JSON.stringify(g));
    } else {
      localStorage.removeItem('aharam_group');
    }
    setGroup(g);
    onGroupChange(g?.id ?? null);
  };

  const handleCreate = async () => {
    if (!inputName.trim()) return;
    setLoading(true);
    setError('');
    const res = await fetch('/api/groups', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: inputName }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error); return; }
    saveGroup(data);
    setMode('idle');
    setInputName('');
    // Save current plan to group
    savePlanToGroup(data.id, currentPlan);
  };

  const handleJoin = async () => {
    if (!inputCode.trim()) return;
    setLoading(true);
    setError('');
    const res = await fetch('/api/groups/join', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: inputCode }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error); return; }
    saveGroup(data);
    setMode('idle');
    setInputCode('');
    // Load group plan
    const planRes = await fetch(`/api/groups/${data.id}/plan`);
    const planData = await planRes.json();
    if (planData.plan) onGroupPlanLoaded(planData.plan);
  };

  const handleLeave = () => {
    saveGroup(null);
    setMode('idle');
  };

  const savePlanToGroup = useCallback(async (groupId: string, plan: WeeklyPlan) => {
    await fetch(`/api/groups/${groupId}/plan`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan }),
    }).catch(() => {});
  }, []);

  // Auto-save plan to group on plan change
  useEffect(() => {
    if (group?.id) {
      savePlanToGroup(group.id, currentPlan);
    }
  }, [currentPlan, group?.id, savePlanToGroup]);

  const copyCode = () => {
    if (group) {
      navigator.clipboard.writeText(group.share_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!user) return null;

  return (
    <div className="bg-white rounded-xl border border-orange-100 shadow-sm p-4">
      {/* Active group */}
      {group ? (
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs text-gray-500 font-medium">Active group</p>
            <p className="font-bold text-gray-800">{group.name}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={copyCode}
              className="flex items-center gap-1.5 bg-orange-100 hover:bg-orange-200 text-orange-700 font-bold text-sm px-3 py-1.5 rounded-lg transition-all font-mono tracking-widest"
            >
              {copied ? '✓ Copied' : group.share_code}
            </button>
            <button
              onClick={handleLeave}
              className="text-xs text-gray-400 hover:text-red-500 transition-colors"
            >
              Leave
            </button>
          </div>
        </div>
      ) : mode === 'idle' ? (
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500 flex-1">Plan groups — share with family</span>
          <button
            onClick={() => setMode('creating')}
            className="text-xs font-semibold bg-orange-100 hover:bg-orange-200 text-orange-700 px-3 py-1.5 rounded-lg transition-all"
          >
            Create
          </button>
          <button
            onClick={() => setMode('joining')}
            className="text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg transition-all"
          >
            Join
          </button>
        </div>
      ) : mode === 'creating' ? (
        <div className="flex items-center gap-2">
          <input
            autoFocus
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            placeholder="Group name…"
            className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <button
            onClick={handleCreate}
            disabled={loading}
            className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg disabled:opacity-60 transition-all"
          >
            {loading ? '…' : 'Create'}
          </button>
          <button onClick={() => { setMode('idle'); setError(''); }} className="text-xs text-gray-400 hover:text-gray-600">Cancel</button>
          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <input
            autoFocus
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
            placeholder="Enter code…"
            maxLength={6}
            className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm font-mono tracking-widest uppercase focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <button
            onClick={handleJoin}
            disabled={loading}
            className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg disabled:opacity-60 transition-all"
          >
            {loading ? '…' : 'Join'}
          </button>
          <button onClick={() => { setMode('idle'); setError(''); }} className="text-xs text-gray-400 hover:text-gray-600">Cancel</button>
          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
      )}
    </div>
  );
}
