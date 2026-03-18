export type MealType = 'breakfast' | 'lunch' | 'dinner';
export type DietType = 'veg' | 'non-veg';
export type DietMode = 'all' | 'maha-veg' | 'non-veg' | 'mix' | 'eggetarian' | 'vegan' | 'kids-tiffin';
export type CuisineType = 'all' | 'south-indian' | 'maharashtrian' | 'north-indian';

export interface Recipe {
  id: string;
  name: string;
  type: MealType;
  diet: DietType;
  dietMode?: DietMode;   // used for new diet mode selector
  cuisine?: CuisineType; // used for regional cuisine selector
  cookTime: number; // minutes
  proteinPerServing: number; // grams
  servings: number; // base servings
  ingredients: string[];
  steps: string[];
  tags: string[];
  description: string;
}

export interface FestiveRecipe {
  id: string;
  name: string;
  diet: DietType;
  cookTime: number;
  proteinPerServing: number; // grams, for base servings below
  servings: number;          // base recipe yield (servings)
  ingredients: string[];
  steps: string[];
  description: string;
  tags: string[];
}

export interface Festival {
  id: string;
  name: string;
  cuisine: Exclude<CuisineType, 'all'>;
  emoji: string;
  season: string; // e.g. "August–September"
  recipes: FestiveRecipe[];
}

export type AllergyItem =
  // Nuts
  | 'peanuts' | 'cashews' | 'almonds' | 'walnuts' | 'coconut'
  // Grains
  | 'wheat' | 'bajra' | 'jowar' | 'ragi' | 'maida'
  // Dairy
  | 'milk' | 'paneer' | 'curd' | 'ghee' | 'butter' | 'cheese'
  // Legumes
  | 'soy' | 'chana' | 'moong' | 'urad' | 'toor' | 'rajma' | 'matki'
  // Seeds
  | 'sesame' | 'mustard' | 'flaxseed'
  // Vegetables
  | 'onion' | 'garlic' | 'tomato' | 'brinjal' | 'potato' | 'mushroom'
  // Other
  | 'eggs' | 'fish' | 'shellfish';

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
