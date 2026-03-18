'use client';

import { useState } from 'react';
import { FestiveRecipe, Festival, AllergyItem } from '../types';
import { festivals, getFestivalsByCuisine } from '../data/festivities';
import { recipeIsSafe } from '../lib/allergyUtils';

type CuisineTab = 'all' | 'maharashtrian' | 'south-indian' | 'north-indian';

const TABS: { value: CuisineTab; label: string }[] = [
  { value: 'all',           label: '🗺 All' },
  { value: 'maharashtrian', label: '🏯 Maharashtrian' },
  { value: 'south-indian',  label: '🌴 South Indian' },
  { value: 'north-indian',  label: '🌾 North Indian' },
];

const dietBadge = (diet: string) =>
  diet === 'veg'
    ? 'bg-green-100 text-green-700 border border-green-200'
    : 'bg-red-100 text-red-700 border border-red-200';

interface Props {
  servings: number;
  avoidances: AllergyItem[];
  ibsMode: boolean;
}

export default function FestiveSection({ servings, avoidances, ibsMode }: Props) {
  const [activeTab, setActiveTab] = useState<CuisineTab>('all');
  const [expandedRecipeId, setExpandedRecipeId] = useState<string | null>(null);
  const [expandedFestivalId, setExpandedFestivalId] = useState<string | null>(null);

  const visibleFestivals = getFestivalsByCuisine(activeTab);

  const toggleFestival = (id: string) => {
    setExpandedFestivalId(prev => prev === id ? null : id);
    setExpandedRecipeId(null);
  };

  const toggleRecipe = (id: string) => {
    setExpandedRecipeId(prev => prev === id ? null : id);
  };

  return (
    <div className="bg-white rounded-2xl border border-orange-100 shadow-sm overflow-hidden">
      {/* Section header */}
      <div className="bg-gradient-to-r from-orange-600 to-amber-500 px-5 py-4">
        <h2 className="text-lg font-bold text-white">🎉 Festive Recipes</h2>
        <p className="text-orange-100 text-xs mt-0.5">
          Traditional authentic dishes for {festivals.length} Indian festivals
        </p>
      </div>

      {/* Cuisine tabs */}
      <div className="overflow-x-auto border-b border-orange-100 -mb-px">
        <div className="flex w-max px-4 pt-3 gap-1">
          {TABS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => { setActiveTab(value); setExpandedFestivalId(null); setExpandedRecipeId(null); }}
              className={`px-4 py-2 text-xs font-semibold whitespace-nowrap rounded-t-lg transition-all border-b-2 ${
                activeTab === value
                  ? 'bg-orange-50 border-orange-500 text-orange-700'
                  : 'bg-transparent border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Festival list */}
      <div className="divide-y divide-orange-50">
        {visibleFestivals.map((festival) => (
          <FestivalBlock
            key={festival.id}
            festival={festival}
            servings={servings}
            avoidances={avoidances}
            ibsMode={ibsMode}
            isOpen={expandedFestivalId === festival.id}
            onToggle={() => toggleFestival(festival.id)}
            expandedRecipeId={expandedRecipeId}
            onToggleRecipe={toggleRecipe}
          />
        ))}
      </div>
    </div>
  );
}

function FestivalBlock({
  festival,
  servings,
  avoidances,
  ibsMode,
  isOpen,
  onToggle,
  expandedRecipeId,
  onToggleRecipe,
}: {
  festival: Festival;
  servings: number;
  avoidances: AllergyItem[];
  ibsMode: boolean;
  isOpen: boolean;
  onToggle: () => void;
  expandedRecipeId: string | null;
  onToggleRecipe: (id: string) => void;
}) {
  const cuisineBadge: Record<string, string> = {
    maharashtrian: 'bg-orange-100 text-orange-700',
    'south-indian': 'bg-green-100 text-green-700',
    'north-indian': 'bg-blue-100 text-blue-700',
  };

  return (
    <div>
      {/* Festival header — click to expand */}
      <button
        onClick={onToggle}
        className="w-full text-left px-5 py-4 flex items-center justify-between hover:bg-orange-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{festival.emoji}</span>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-800">{festival.name}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cuisineBadge[festival.cuisine]}`}>
                {festival.cuisine === 'maharashtrian' ? 'Maharashtrian' : festival.cuisine === 'south-indian' ? 'South Indian' : 'North Indian'}
              </span>
            </div>
            <span className="text-xs text-gray-400">{festival.season} · {festival.recipes.length} recipes</span>
          </div>
        </div>
        <span className={`text-gray-400 text-lg transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
          ▾
        </span>
      </button>

      {/* Recipes list */}
      {isOpen && (
        <div className="bg-orange-50/40 border-t border-orange-100 divide-y divide-orange-100">
          {festival.recipes.map((recipe) => {
            const safe = recipeIsSafe(recipe.ingredients, avoidances, ibsMode);
            return (
              <RecipeBlock
                key={recipe.id}
                recipe={recipe}
                servings={servings}
                safe={safe}
                isOpen={expandedRecipeId === recipe.id}
                onToggle={() => onToggleRecipe(recipe.id)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

function RecipeBlock({
  recipe,
  servings,
  safe,
  isOpen,
  onToggle,
}: {
  recipe: FestiveRecipe;
  servings: number;
  safe: boolean;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const scaleFactor = servings / recipe.servings;
  const scaledProtein = Math.round(recipe.proteinPerServing * servings);
  const showScale = scaleFactor !== 1;

  return (
    <div>
      {/* Recipe summary row */}
      <button
        onClick={safe ? onToggle : undefined}
        disabled={!safe}
        className={`w-full text-left px-5 py-3 flex items-center justify-between transition-colors ${
          safe ? 'hover:bg-orange-50 cursor-pointer' : 'opacity-40 cursor-not-allowed bg-gray-50'
        }`}
      >
        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-semibold text-sm text-gray-800">{recipe.name}</p>
              {!safe && <span className="text-xs text-red-500 font-medium">⚠ avoided ingredient</span>}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${dietBadge(recipe.diet)}`}>
                {recipe.diet === 'veg' ? '🥦' : '🍗'}
              </span>
              <span className="text-xs text-gray-400">⏱ {recipe.cookTime}m</span>
              <span className="text-xs font-semibold text-gray-600">
                💪 {scaledProtein}g for {servings}
              </span>
            </div>
          </div>
        </div>
        <span className={`text-gray-400 text-sm transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}>
          ▾
        </span>
      </button>

      {/* Full recipe detail */}
      {isOpen && (
        <div className="px-5 pb-5 pt-1 space-y-4 bg-white">
          <p className="text-sm text-gray-500 italic leading-relaxed">{recipe.description}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {recipe.tags.map((tag) => (
              <span key={tag} className="bg-orange-50 text-orange-600 border border-orange-100 px-2 py-0.5 rounded-full text-xs">
                #{tag}
              </span>
            ))}
          </div>

          {/* Protein summary */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 text-center">
              <p className="text-xl font-bold text-orange-600">{recipe.proteinPerServing}g</p>
              <p className="text-xs text-gray-500 mt-0.5">per person</p>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-center">
              <p className="text-xl font-bold text-amber-600">{scaledProtein}g</p>
              <p className="text-xs text-gray-500 mt-0.5">for {servings} people</p>
            </div>
          </div>

          {/* Ingredients */}
          <div>
            <h4 className="font-bold text-sm text-gray-800 mb-2 flex items-center gap-2">
              <span className="w-5 h-5 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                {recipe.ingredients.length}
              </span>
              Ingredients
              <span className="text-xs text-gray-400 font-normal">
                (for {recipe.servings} servings
                {showScale && (
                  <span className="ml-1 text-orange-600 font-semibold">
                    — multiply by {scaleFactor % 1 === 0 ? scaleFactor : scaleFactor.toFixed(1)}× for {servings}
                  </span>
                )}
                )
              </span>
            </h4>
            <ul className="space-y-1">
              {recipe.ingredients.map((ing, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-orange-400 mt-0.5 flex-shrink-0 text-xs">◆</span>
                  {ing}
                </li>
              ))}
            </ul>
          </div>

          {/* Steps */}
          <div>
            <h4 className="font-bold text-sm text-gray-800 mb-2">Method</h4>
            <ol className="space-y-2">
              {recipe.steps.map((step, i) => (
                <li key={i} className="flex gap-3 text-sm text-gray-700">
                  <span className="flex-shrink-0 w-5 h-5 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center text-xs font-bold">
                    {i + 1}
                  </span>
                  <span className="leading-relaxed pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}
