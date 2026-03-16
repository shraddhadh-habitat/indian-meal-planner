'use client';

import { Recipe, MealType } from '../types';

interface Props {
  recipe: Recipe;
  mealType: MealType;
  servings: number;
  onClick: () => void;
}

const mealColors: Record<MealType, string> = {
  breakfast: 'bg-amber-50 border-amber-200 hover:border-amber-400',
  lunch: 'bg-orange-50 border-orange-200 hover:border-orange-400',
  dinner: 'bg-red-50 border-red-200 hover:border-red-400',
};

const mealHeaderColors: Record<MealType, string> = {
  breakfast: 'text-amber-700 bg-amber-100',
  lunch: 'text-orange-700 bg-orange-100',
  dinner: 'text-red-700 bg-red-100',
};

const mealIcons: Record<MealType, string> = {
  breakfast: '🌅',
  lunch: '☀️',
  dinner: '🌙',
};

export default function MealCard({ recipe, mealType, servings, onClick }: Props) {
  const totalProtein = recipe.proteinPerServing * servings;

  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-xl border-2 p-3 transition-all duration-150 cursor-pointer group ${mealColors[mealType]} hover:shadow-md active:scale-[0.98]`}
    >
      {/* Meal type label */}
      <div className="flex items-center justify-between mb-2">
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${mealHeaderColors[mealType]}`}>
          {mealIcons[mealType]} {mealType}
        </span>
        <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${recipe.diet === 'veg' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {recipe.diet === 'veg' ? '🥦' : '🍗'}
        </span>
      </div>

      {/* Recipe name */}
      <p className="font-semibold text-gray-800 text-sm leading-snug group-hover:text-orange-700 transition-colors">
        {recipe.name}
      </p>

      {/* Protein + time */}
      <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
        <span>⏱ {recipe.cookTime}m</span>
        <span className="font-semibold text-gray-700">💪 {totalProtein}g total</span>
      </div>

      {/* Tap hint */}
      <p className="text-xs text-gray-400 mt-1 group-hover:text-orange-500 transition-colors">
        Tap for recipe →
      </p>
    </button>
  );
}
