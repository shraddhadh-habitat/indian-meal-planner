export type MealType = 'breakfast' | 'lunch' | 'dinner';
export type DietType = 'veg' | 'non-veg';

export interface Recipe {
  id: string;
  name: string;
  type: MealType;
  diet: DietType;
  cookTime: number; // minutes
  proteinPerServing: number; // grams
  servings: number; // base servings
  ingredients: string[];
  steps: string[];
  tags: string[];
  description: string;
}

export interface MealSlot {
  day: string;
  mealType: MealType;
  recipeId: string;
}

export interface WeeklyPlan {
  [day: string]: {
    breakfast: string;
    lunch: string;
    dinner: string;
  };
}
