'use client';

import { Recipe } from '../types';

interface Props {
  recipe: Recipe | null;
  onClose: () => void;
  servings?: number;
}

const dietBadge = (diet: string) =>
  diet === 'veg'
    ? 'bg-green-100 text-green-800 border border-green-300'
    : 'bg-red-100 text-red-800 border border-red-300';

const mealIcon = (type: string) => {
  if (type === 'breakfast') return '🌅';
  if (type === 'lunch') return '☀️';
  return '🌙';
};

export default function RecipeModal({ recipe, onClose, servings = 3 }: Props) {
  if (!recipe) return null;

  const totalProtein = recipe.proteinPerServing * servings;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative bg-white w-full sm:max-w-2xl sm:rounded-2xl rounded-t-2xl max-h-[92vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-4 sm:rounded-t-2xl rounded-t-2xl">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{mealIcon(recipe.type)}</span>
                <span className="text-white/80 text-sm capitalize">{recipe.type}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight">
                {recipe.name}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white text-2xl leading-none mt-1 flex-shrink-0"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          {/* Quick stats */}
          <div className="flex flex-wrap gap-2 mt-3">
            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${dietBadge(recipe.diet)}`}>
              {recipe.diet === 'veg' ? '🥦 Veg' : '🍗 Non-Veg'}
            </span>
            <span className="bg-white/20 text-white px-2 py-0.5 rounded-full text-xs font-semibold">
              ⏱ {recipe.cookTime} min
            </span>
            <span className="bg-white/20 text-white px-2 py-0.5 rounded-full text-xs font-semibold">
              💪 {recipe.proteinPerServing}g protein/person
            </span>
            <span className="bg-white/20 text-white px-2 py-0.5 rounded-full text-xs font-semibold">
              👥 Total for {servings}: {totalProtein}g protein
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="px-5 py-5 space-y-6">
          {/* Description */}
          <p className="text-gray-600 text-sm leading-relaxed italic">{recipe.description}</p>

          {/* Tags */}
          {recipe.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {recipe.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-orange-50 text-orange-700 border border-orange-200 px-2 py-0.5 rounded-full text-xs"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Ingredients */}
          <div>
            <h3 className="font-bold text-gray-800 text-base mb-3 flex items-center gap-2">
              <span className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                {recipe.ingredients.length}
              </span>
              Ingredients
              <span className="text-xs text-gray-400 font-normal ml-1">
                (for {recipe.servings} servings — scale as needed)
              </span>
            </h3>
            <ul className="space-y-1.5">
              {recipe.ingredients.map((ing, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-orange-400 mt-0.5 flex-shrink-0">◆</span>
                  {ing}
                </li>
              ))}
            </ul>
          </div>

          {/* Steps */}
          <div>
            <h3 className="font-bold text-gray-800 text-base mb-3">Method</h3>
            <ol className="space-y-3">
              {recipe.steps.map((step, i) => (
                <li key={i} className="flex gap-3 text-sm text-gray-700">
                  <span className="flex-shrink-0 w-6 h-6 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center text-xs font-bold">
                    {i + 1}
                  </span>
                  <span className="leading-relaxed pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Protein summary */}
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
            <p className="text-sm font-semibold text-orange-800 mb-2">Protein Summary</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-orange-600">{recipe.proteinPerServing}g</p>
                <p className="text-xs text-gray-500 mt-0.5">per person</p>
              </div>
              <div className="bg-white rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-amber-600">{totalProtein}g</p>
                <p className="text-xs text-gray-500 mt-0.5">for {servings} people</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
