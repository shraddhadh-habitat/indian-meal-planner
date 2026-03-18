import { WeeklyPlan, DietMode, Recipe } from '../types';
import { breakfastRecipes, lunchRecipes, dinnerRecipes, recipes } from './recipes';

export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// All Maharashtrian / North Indian veg — no refined flour, no chana, no rajma, no shevga
// Lunch and dinner always paired with jowar bhakri or whole-wheat roti
// Max 1 paneer dish per day. Tuesday: zero paneer.
// Protein per person per day (≥50g):
// Mon 61g | Tue 55g | Wed 53g | Thu 50g | Fri 50g | Sat 52g | Sun 51g
export const defaultWeeklyPlan: WeeklyPlan = {
  Monday: {
    breakfast: 'besan-chilla',              // 17g — besan chilla with paneer stuffing
    lunch: 'soya-sabzi-bhakri',             // 22g — soya chunk masala + jowar bhakri
    dinner: 'paneer-tikka-masala-roti',     // 22g — paneer tikka masala + roti  → 61g
  },
  Tuesday: {
    breakfast: 'moong-chilla',              // 18g — moong dal chilla (NO paneer)
    lunch: 'matki-usal-bhakri',             // 17g — matki usal + jowar bhakri (NO paneer)
    dinner: 'soya-makhani-roti',            // 20g — soya makhani + roti (NO paneer)  → 55g
  },
  Wednesday: {
    breakfast: 'paneer-paratha',            // 19g — paneer paratha + curd
    lunch: 'palak-masoor-roti',             // 17g — palak masoor dal + roti (no paneer)
    dinner: 'baingan-bharit-bhakri',        // 17g — bharit + urad dal + bhakri (no paneer)  → 53g
  },
  Thursday: {
    breakfast: 'thalipeeth',               // 15g — bhajaniche thalipeeth
    lunch: 'methi-paneer-roti',             // 18g — methi matar paneer + roti
    dinner: 'tendli-masoor-bhakri',         // 17g — tendli sabzi + masoor dal + bhakri  → 50g
  },
  Friday: {
    breakfast: 'soya-poha',                // 14g — soya kanda poha
    lunch: 'paneer-bhurji-roti',            // 20g — paneer bhurji + roti
    dinner: 'amti-bhakri',                 // 16g — peanut amti + jowar bhakri  → 50g
  },
  Saturday: {
    breakfast: 'methi-thepla',             // 16g — methi thepla + curd (seasonal methi)
    lunch: 'vaal-amti-bhakri',             // 18g — vaal amti + jowar bhakri (Maharashtrian)
    dinner: 'matar-paneer-roti',            // 18g — matar paneer + roti (seasonal peas)  → 52g
  },
  Sunday: {
    breakfast: 'rava-upma-soya',           // 16g — rava upma with soya + seasonal veg
    lunch: 'palak-paneer-roti',             // 19g — palak paneer + roti (seasonal palak)
    dinner: 'maa-ki-dal-roti',             // 16g — maa ki dal (whole urad) + roti  → 51g
  },
};

export const fixedDefaultPlan: WeeklyPlan = defaultWeeklyPlan;

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function poolForMode(mode: DietMode): Recipe[] {
  if (mode === 'all') return recipes;
  if (mode === 'non-veg') return recipes.filter((r) => r.diet === 'non-veg');
  if (mode === 'mix') return recipes.filter((r) => !r.dietMode || r.dietMode === 'veg' || r.diet === 'non-veg');
  if (mode === 'veg') return recipes.filter((r) => !r.dietMode || r.dietMode === 'veg');
  // eggetarian | vegan | kids-tiffin
  return recipes.filter((r) => r.dietMode === mode);
}

export function generatePlanForDietMode(mode: DietMode): WeeklyPlan {
  const pool = poolForMode(mode);
  const b = pool.filter((r) => r.type === 'breakfast');
  const l = pool.filter((r) => r.type === 'lunch');
  const d = pool.filter((r) => r.type === 'dinner');

  // Fallback to full pool if any meal type is empty
  const safeB = b.length ? b : breakfastRecipes;
  const safeL = l.length ? l : lunchRecipes;
  const safeD = d.length ? d : dinnerRecipes;

  const plan: WeeklyPlan = {};
  DAYS.forEach((day) => {
    plan[day] = {
      breakfast: pickRandom(safeB).id,
      lunch: pickRandom(safeL).id,
      dinner: pickRandom(safeD).id,
    };
  });
  return plan;
}

export function generateShuffledPlan(): WeeklyPlan {
  const plan: WeeklyPlan = {};
  DAYS.forEach((day) => {
    plan[day] = {
      breakfast: pickRandom(breakfastRecipes).id,
      lunch: pickRandom(lunchRecipes).id,
      dinner: pickRandom(dinnerRecipes).id,
    };
  });
  return plan;
}
