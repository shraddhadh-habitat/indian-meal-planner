'use client';

import { useState } from 'react';
import { AllergyItem } from '../types';
import { ALLERGY_GROUPS, IBS_FODMAP_ITEMS } from '../lib/allergyUtils';

interface Props {
  avoidances: AllergyItem[];
  ibsMode: boolean;
  onAvoidancesChange: (items: AllergyItem[]) => void;
  onIbsModeChange: (on: boolean) => void;
}

export default function AllergyFilter({
  avoidances, ibsMode, onAvoidancesChange, onIbsModeChange,
}: Props) {
  const [open, setOpen] = useState(false);

  const toggle = (item: AllergyItem) => {
    onAvoidancesChange(
      avoidances.includes(item)
        ? avoidances.filter((a) => a !== item)
        : [...avoidances, item],
    );
  };

  const clearAll = () => {
    onAvoidancesChange([]);
    onIbsModeChange(false);
  };

  // Items effectively avoided = manual + IBS preset (deduplicated)
  const effectiveCount = ibsMode
    ? new Set([...avoidances, ...IBS_FODMAP_ITEMS]).size
    : avoidances.length;

  return (
    <div className="rounded-xl border border-orange-100 bg-white overflow-hidden">
      {/* Toggle bar */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-orange-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-base">⚠️</span>
          <span className="text-sm font-semibold text-gray-700">Allergy &amp; Avoidance Filter</span>
          {effectiveCount > 0 && (
            <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full">
              {effectiveCount} avoided
            </span>
          )}
          {ibsMode && (
            <span className="bg-purple-100 text-purple-700 text-xs font-bold px-2 py-0.5 rounded-full">
              IBS mode
            </span>
          )}
        </div>
        <span className={`text-gray-400 text-sm transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
          ▾
        </span>
      </button>

      {open && (
        <div className="px-4 pb-4 border-t border-orange-50 space-y-4 pt-3">

          {/* IBS mode */}
          <div className="flex items-start gap-3 bg-purple-50 border border-purple-100 rounded-xl p-3">
            <div className="flex-1">
              <p className="text-sm font-semibold text-purple-800">🧘 IBS-Friendly Mode</p>
              <p className="text-xs text-purple-600 mt-0.5 leading-relaxed">
                Hides high-FODMAP recipes. Auto-avoids: onion, garlic, mushroom, wheat, and most legumes (chana, urad, toor, rajma, matki, moong) per Monash University guidelines.
              </p>
            </div>
            <button
              onClick={() => onIbsModeChange(!ibsMode)}
              className={`flex-shrink-0 w-11 h-6 rounded-full transition-colors duration-200 relative ${
                ibsMode ? 'bg-purple-500' : 'bg-gray-200'
              }`}
              aria-label="Toggle IBS mode"
            >
              <span
                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                  ibsMode ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {/* Avoidance groups */}
          {ALLERGY_GROUPS.map((group) => (
            <div key={group.label}>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                {group.label}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {group.items.map(({ value, label }) => {
                  const active = avoidances.includes(value);
                  const fromIbs = ibsMode && IBS_FODMAP_ITEMS.includes(value) && !active;
                  return (
                    <button
                      key={value}
                      onClick={() => toggle(value)}
                      className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all border ${
                        active
                          ? 'bg-red-500 text-white border-red-500'
                          : fromIbs
                          ? 'bg-purple-100 text-purple-700 border-purple-300'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-red-300'
                      }`}
                    >
                      {active ? '✕ ' : fromIbs ? '⚡ ' : ''}{label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Clear all */}
          {effectiveCount > 0 && (
            <button
              onClick={clearAll}
              className="text-xs text-gray-400 hover:text-red-500 underline transition-colors"
            >
              Clear all avoidances
            </button>
          )}

          <p className="text-xs text-gray-400 border-t border-gray-100 pt-2">
            Purple chips (⚡) are avoided by IBS mode. Red chips (✕) are your manual selections. Recipes containing any avoided ingredient are hidden.
          </p>
        </div>
      )}
    </div>
  );
}
