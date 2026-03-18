'use client';

import { DAYS } from '../data/weeklyPlan';
import { DietMode, CuisineType } from '../types';

const DIET_MODE_OPTIONS: { value: DietMode; label: string }[] = [
  { value: 'all',          label: '🍽 All Recipes' },
  { value: 'veg',          label: '🥬 Vegetarian' },
  { value: 'non-veg',      label: '🍗 Non-Veg' },
  { value: 'mix',          label: '🥗 Mix (Veg + Non-Veg)' },
  { value: 'eggetarian',   label: '🥚 Eggetarian' },
  { value: 'vegan',        label: '🌱 Vegan' },
  { value: 'kids-tiffin',  label: '🧒 Kids Tiffin' },
];

const CUISINES: { value: CuisineType; label: string }[] = [
  { value: 'all',           label: '🗺 All Regions' },
  { value: 'maharashtrian', label: '🏯 Maharashtrian' },
  { value: 'north-indian',  label: '🌾 North Indian' },
  { value: 'south-indian',  label: '🌴 South Indian' },
  { value: 'festive',       label: '🎉 Festive' },
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

      {/* Diet mode + Cuisine row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Diet mode dropdown */}
        <div className="flex items-center gap-1.5">
          <label htmlFor="diet-mode-select" className="text-xs font-semibold text-gray-500 whitespace-nowrap">
            Diet:
          </label>
          <select
            id="diet-mode-select"
            value={dietMode}
            onChange={(e) => onDietModeChange(e.target.value as DietMode)}
            className="text-xs font-medium bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-gray-700 focus:outline-none focus:border-orange-400 cursor-pointer"
          >
            {DIET_MODE_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        {/* Regional cuisine pills */}
        <div className="overflow-x-auto -mx-0 flex-1">
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
    </div>
  );
}
