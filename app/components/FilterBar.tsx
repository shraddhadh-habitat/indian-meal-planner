'use client';

import { DAYS } from '../data/weeklyPlan';
import { DietMode, CuisineType } from '../types';

const DIET_MODES: { value: DietMode; label: string; activeClass: string }[] = [
  { value: 'all',          label: '🍽 All',              activeClass: 'bg-orange-500 text-white' },
  { value: 'maha-veg',     label: '🥬 Maha Veg',         activeClass: 'bg-green-600 text-white' },
  { value: 'non-veg',      label: '🍗 Non-Veg',          activeClass: 'bg-red-500 text-white' },
  { value: 'mix',          label: '🥗 Mix',              activeClass: 'bg-yellow-500 text-white' },
  { value: 'eggetarian',   label: '🥚 Eggetarian',       activeClass: 'bg-yellow-400 text-gray-800' },
  { value: 'vegan',        label: '🌱 Vegan',            activeClass: 'bg-emerald-500 text-white' },
  { value: 'kids-tiffin',  label: '🧒 Kids Tiffin',      activeClass: 'bg-pink-500 text-white' },
];

const CUISINES: { value: CuisineType; label: string }[] = [
  { value: 'all',           label: '🗺 All Regions' },
  { value: 'maharashtrian', label: '🏯 Maharashtrian' },
  { value: 'north-indian',  label: '🌾 North Indian' },
  { value: 'south-indian',  label: '🌴 South Indian' },
];

interface Props {
  selectedDay: string | 'all';
  onDayChange: (day: string | 'all') => void;
  dietMode: DietMode;
  onDietModeChange: (mode: DietMode) => void;
  cuisineFilter: CuisineType;
  onCuisineChange: (cuisine: CuisineType) => void;
}

export default function FilterBar({
  selectedDay, onDayChange,
  dietMode, onDietModeChange,
  cuisineFilter, onCuisineChange,
}: Props) {
  return (
    <div className="space-y-3">
      {/* Day filter */}
      <div className="overflow-x-auto pb-1 -mx-4 px-4">
        <div className="flex gap-2 w-max">
          <button
            onClick={() => onDayChange('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedDay === 'all'
                ? 'bg-orange-500 text-white shadow-sm'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-orange-300'
            }`}
          >
            All Days
          </button>
          {DAYS.map((day) => (
            <button
              key={day}
              onClick={() => onDayChange(day)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedDay === day
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-orange-300'
              }`}
            >
              {day.slice(0, 3)}
            </button>
          ))}
        </div>
      </div>

      {/* Diet mode selector */}
      <div className="overflow-x-auto pb-1 -mx-4 px-4">
        <div className="flex gap-2 w-max">
          {DIET_MODES.map(({ value, label, activeClass }) => (
            <button
              key={value}
              onClick={() => onDietModeChange(value)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                dietMode === value
                  ? `${activeClass} shadow-sm`
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-orange-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Regional cuisine selector */}
      <div className="overflow-x-auto pb-1 -mx-4 px-4">
        <div className="flex gap-2 w-max">
          {CUISINES.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => onCuisineChange(value)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                cuisineFilter === value
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-orange-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
