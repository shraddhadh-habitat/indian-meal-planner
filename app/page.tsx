'use client';

import { useState, useCallback, useEffect } from 'react';
import { Recipe, WeeklyPlan } from './types';
import { getRecipeById } from './data/recipes';
import { DAYS, fixedDefaultPlan, generateShuffledPlan } from './data/weeklyPlan';
import MealCard from './components/MealCard';
import RecipeModal from './components/RecipeModal';
import ProteinDashboard from './components/ProteinDashboard';
import FilterBar from './components/FilterBar';
import AuthButton from './components/AuthButton';
import GroupPanel from './components/GroupPanel';
import { useAuth } from './providers';

const SERVINGS = 3;
const RECIPE_COUNT = 55;

export default function Home() {
  const { user } = useAuth();
  const [plan, setPlan] = useState<WeeklyPlan>(fixedDefaultPlan);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [selectedDay, setSelectedDay] = useState<string | 'all'>('all');
  const [dietFilter, setDietFilter] = useState<'all' | 'veg' | 'non-veg'>('all');
  const [shuffling, setShuffling] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);

  const handleShuffle = useCallback(() => {
    setShuffling(true);
    setTimeout(() => {
      setPlan(generateShuffledPlan());
      setShuffling(false);
    }, 400);
  }, []);

  const handleMealClick = useCallback((recipeId: string) => {
    const recipe = getRecipeById(recipeId);
    if (recipe) setSelectedRecipe(recipe);
  }, []);

  // Save plan to group whenever it changes
  useEffect(() => {
    if (!activeGroupId) return;
    fetch(`/api/groups/${activeGroupId}/plan`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan }),
    }).catch(() => {});
  }, [plan, activeGroupId]);

  const visibleDays = selectedDay === 'all' ? DAYS : [selectedDay];

  const mealPassesFilter = (recipeId: string) => {
    if (dietFilter === 'all') return true;
    const recipe = getRecipeById(recipeId);
    return recipe?.diet === dietFilter;
  };

  const dayPassesDietFilter = (day: string) => {
    if (dietFilter === 'all') return true;
    const meals = plan[day];
    if (!meals) return false;
    return [meals.breakfast, meals.lunch, meals.dinner].some(mealPassesFilter);
  };

  const filteredDays = visibleDays.filter(dayPassesDietFilter);

  return (
    <div className="min-h-screen bg-orange-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 text-white">
        <div className="max-w-5xl mx-auto px-4 py-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                🍛 Bhojan Planner
              </h1>
              <p className="text-orange-100 text-sm mt-1">
                Weekly Indian meal plan · {SERVINGS} people
              </p>
            </div>
            <div className="flex flex-col gap-2 items-end">
              <AuthButton />
              <button
                onClick={handleShuffle}
                disabled={shuffling}
                className="flex items-center gap-1.5 bg-white text-orange-600 font-semibold text-sm px-4 py-2 rounded-full shadow hover:bg-orange-50 transition-all disabled:opacity-60 active:scale-95"
              >
                <span className={`text-base ${shuffling ? 'animate-spin' : ''}`}>
                  🎲
                </span>
                Shuffle Week
              </button>
              <button
                onClick={() => setShowDashboard((v) => !v)}
                className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white font-semibold text-sm px-4 py-2 rounded-full transition-all"
              >
                📊 {showDashboard ? 'Hide' : 'Protein'} Summary
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-5 space-y-5">
        {/* Group panel — only for signed-in users */}
        {user && (
          <GroupPanel
            currentPlan={plan}
            onGroupPlanLoaded={setPlan}
            onGroupChange={setActiveGroupId}
          />
        )}

        {/* Protein dashboard */}
        {showDashboard && <ProteinDashboard plan={plan} servings={SERVINGS} />}

        {/* Filter bar */}
        <FilterBar
          selectedDay={selectedDay}
          onDayChange={setSelectedDay}
          dietFilter={dietFilter}
          onDietChange={setDietFilter}
        />

        {/* Meal plan grid */}
        {filteredDays.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-4xl mb-3">🥗</p>
            <p className="font-medium">No meals match this filter.</p>
            <p className="text-sm mt-1">Try a different day or diet filter.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredDays.map((day) => {
              const meals = plan[day];
              if (!meals) return null;

              const mealEntries: Array<{ type: 'breakfast' | 'lunch' | 'dinner'; id: string }> = [
                { type: 'breakfast', id: meals.breakfast },
                { type: 'lunch', id: meals.lunch },
                { type: 'dinner', id: meals.dinner },
              ];

              const visibleMeals = mealEntries.filter((m) => mealPassesFilter(m.id));

              return (
                <section
                  key={day}
                  className={`transition-opacity duration-300 ${shuffling ? 'opacity-40' : 'opacity-100'}`}
                >
                  {/* Day header */}
                  <div className="flex items-center gap-3 mb-3">
                    <h2 className="text-base font-bold text-gray-800">{day}</h2>
                    <div className="h-px flex-1 bg-orange-200" />
                    <DayProteinBadge meals={meals} servings={SERVINGS} />
                  </div>

                  {/* Meal cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {visibleMeals.map(({ type, id }) => {
                      const recipe = getRecipeById(id);
                      if (!recipe) return null;
                      return (
                        <MealCard
                          key={type}
                          recipe={recipe}
                          mealType={type}
                          servings={SERVINGS}
                          onClick={() => handleMealClick(id)}
                        />
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        )}

        {/* Footer */}
        <footer className="text-center text-xs text-gray-400 py-6 border-t border-orange-100">
          <p>Bhojan Planner · {RECIPE_COUNT} recipes · Practical Indian cooking for busy women</p>
          <p className="mt-1">Protein values are estimates. Tap any meal card to see the full recipe.</p>
          <p className="mt-2">
            <a href="https://t.me/BhojanPlannerBot" className="text-orange-400 hover:text-orange-600 underline" target="_blank" rel="noreferrer">
              ✈️ Get daily plans on Telegram
            </a>
          </p>
        </footer>
      </main>

      {/* Recipe modal */}
      <RecipeModal
        recipe={selectedRecipe}
        onClose={() => setSelectedRecipe(null)}
        servings={SERVINGS}
      />
    </div>
  );
}

function DayProteinBadge({
  meals,
  servings,
}: {
  meals: { breakfast: string; lunch: string; dinner: string };
  servings: number;
}) {
  const total = [meals.breakfast, meals.lunch, meals.dinner]
    .map(getRecipeById)
    .reduce((sum, r) => sum + (r ? r.proteinPerServing * servings : 0), 0);

  return (
    <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-semibold">
      💪 {total}g
    </span>
  );
}
