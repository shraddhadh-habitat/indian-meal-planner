'use client';

import { WeeklyPlan } from '../types';
import { getRecipeById } from '../data/recipes';
import { DAYS } from '../data/weeklyPlan';

interface Props {
  plan: WeeklyPlan;
  servings: number;
}

export default function ProteinDashboard({ plan, servings }: Props) {
  const dailyProtein = DAYS.map((day) => {
    const meals = plan[day];
    if (!meals) return { day, total: 0, perPerson: 0, breakdown: { breakfast: 0, lunch: 0, dinner: 0 } };

    const breakfast = getRecipeById(meals.breakfast);
    const lunch = getRecipeById(meals.lunch);
    const dinner = getRecipeById(meals.dinner);

    const bProtein = (breakfast?.proteinPerServing ?? 0) * servings;
    const lProtein = (lunch?.proteinPerServing ?? 0) * servings;
    const dProtein = (dinner?.proteinPerServing ?? 0) * servings;
    const total = bProtein + lProtein + dProtein;

    return {
      day,
      total,
      perPerson: Math.round(total / servings),
      breakdown: { breakfast: bProtein, lunch: lProtein, dinner: dProtein },
    };
  });

  const weeklyTotal = dailyProtein.reduce((sum, d) => sum + d.total, 0);
  const weeklyPerPerson = Math.round(weeklyTotal / servings);
  const maxDayTotal = Math.max(...dailyProtein.map((d) => d.total));

  // Recommended: ~50g/day per person (150g for 3 people)
  const dailyTarget = 50 * servings;

  return (
    <div className="bg-white rounded-2xl border border-orange-200 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800">Weekly Protein Summary</h2>
        <span className="text-xs text-gray-500 bg-orange-50 px-2 py-1 rounded-lg">
          For {servings} people
        </span>
      </div>

      {/* Weekly totals */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl p-4 text-white text-center">
          <p className="text-3xl font-bold">{weeklyTotal}g</p>
          <p className="text-xs text-orange-100 mt-1">Total weekly protein</p>
          <p className="text-sm text-orange-100">({servings} people)</p>
        </div>
        <div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-orange-700">{weeklyPerPerson}g</p>
          <p className="text-xs text-orange-600 mt-1">Per person / week</p>
          <p className="text-sm text-orange-500">~{Math.round(weeklyPerPerson / 7)}g/day</p>
        </div>
      </div>

      {/* Daily bars */}
      <div className="space-y-3">
        {dailyProtein.map(({ day, total, perPerson, breakdown }) => {
          const pct = maxDayTotal > 0 ? (total / maxDayTotal) * 100 : 0;
          const meetsTarget = total >= dailyTarget;

          return (
            <div key={day}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-gray-600 w-12">{day.slice(0, 3)}</span>
                <div className="flex-1 mx-2 bg-gray-100 rounded-full h-4 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${meetsTarget ? 'bg-gradient-to-r from-orange-400 to-amber-400' : 'bg-gradient-to-r from-orange-300 to-orange-200'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="text-right w-28">
                  <span className="text-xs font-bold text-gray-700">{total}g</span>
                  <span className="text-xs text-gray-400 ml-1">({perPerson}g/pp)</span>
                </div>
              </div>

              {/* Breakdown dots */}
              <div className="flex gap-3 pl-14 text-xs text-gray-400">
                <span>🌅 {breakdown.breakfast}g</span>
                <span>☀️ {breakdown.lunch}g</span>
                <span>🌙 {breakdown.dinner}g</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Target note */}
      <p className="text-xs text-gray-400 mt-4 border-t border-gray-100 pt-3">
        * Target: ~{dailyTarget}g/day for {servings} people ({50}g per person, based on 50g RDA)
      </p>
    </div>
  );
}
