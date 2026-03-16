'use client';

import { DAYS } from '../data/weeklyPlan';

interface Props {
  selectedDay: string | 'all';
  onDayChange: (day: string | 'all') => void;
  dietFilter: 'all' | 'veg' | 'non-veg';
  onDietChange: (diet: 'all' | 'veg' | 'non-veg') => void;
}

export default function FilterBar({ selectedDay, onDayChange, dietFilter, onDietChange }: Props) {
  return (
    <div className="space-y-3">
      {/* Day filter — horizontal scroll on mobile */}
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

      {/* Diet filter */}
      <div className="flex gap-2">
        {(['all', 'veg', 'non-veg'] as const).map((diet) => (
          <button
            key={diet}
            onClick={() => onDietChange(diet)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              dietFilter === diet
                ? diet === 'veg'
                  ? 'bg-green-500 text-white shadow-sm'
                  : diet === 'non-veg'
                  ? 'bg-red-500 text-white shadow-sm'
                  : 'bg-orange-500 text-white shadow-sm'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-orange-300'
            }`}
          >
            {diet === 'all' ? '🍽 All' : diet === 'veg' ? '🥦 Veg Only' : '🍗 Non-Veg Only'}
          </button>
        ))}
      </div>
    </div>
  );
}
