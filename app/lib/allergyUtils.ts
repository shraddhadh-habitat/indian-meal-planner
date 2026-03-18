import { AllergyItem } from '../types';

// Keywords are matched against ingredient strings (case-insensitive).
// Each entry covers common English names, Hindi names and transliterations
// used in Indian recipe writing.
export const ALLERGY_KEYWORDS: Record<AllergyItem, string[]> = {
  // ── Nuts ────────────────────────────────────────────────────────────────────
  peanuts:   ['peanut', 'groundnut', 'shengdana', 'moongfali'],
  cashews:   ['cashew'],
  almonds:   ['almond', 'badam'],
  walnuts:   ['walnut', 'akhrot'],
  coconut:   ['coconut', 'nariyal', 'kopra', 'khopra'],

  // ── Grains (wheat & maida treated as separate items per user spec) ──────────
  // "wheat" covers whole wheat, atta, semolina/rava (which is durum wheat)
  wheat:     ['wheat', 'atta', 'semolina', 'rava', 'suji', 'sooji'],
  bajra:     ['bajra', 'pearl millet'],
  jowar:     ['jowar', 'sorghum'],
  ragi:      ['ragi', 'nachni', 'finger millet'],
  maida:     ['maida', 'all-purpose flour'],

  // ── Dairy ───────────────────────────────────────────────────────────────────
  milk:      ['milk', 'doodh', 'khoya', 'mawa', 'condensed milk', 'evaporated'],
  paneer:    ['paneer'],
  curd:      ['curd', 'dahi', 'yogurt', 'yoghurt', 'hung curd', 'chakka'],
  ghee:      ['ghee'],
  butter:    ['butter'],
  cheese:    ['cheese'],

  // ── Legumes ─────────────────────────────────────────────────────────────────
  soy:       ['soy', 'soya', 'tofu'],
  chana:     ['chana', 'chickpea', 'bengal gram', 'chola', 'chole', 'besan'],
  moong:     ['moong', 'mung'],
  urad:      ['urad', 'black gram', 'black lentil'],
  toor:      ['toor', 'arhar', 'pigeon pea', 'tur'],
  rajma:     ['rajma', 'kidney bean'],
  matki:     ['matki', 'moth bean'],

  // ── Seeds ───────────────────────────────────────────────────────────────────
  sesame:    ['sesame', ' til', 'tahini'],   // space before 'til' avoids 'until'
  mustard:   ['mustard', ' rai', 'sarson'],  // space before 'rai' avoids e.g. 'biryani'
  flaxseed:  ['flaxseed', 'alsi', 'linseed', 'flax seed'],

  // ── Vegetables ──────────────────────────────────────────────────────────────
  onion:     ['onion', 'pyaz', 'kanda', 'shallot'],
  garlic:    ['garlic', 'lehsun', 'lasun'],
  tomato:    ['tomato', 'tamatar'],
  brinjal:   ['brinjal', 'eggplant', 'baingan', 'aubergine'],
  potato:    ['potato', 'aloo', 'batata'],
  mushroom:  ['mushroom'],

  // ── Other ───────────────────────────────────────────────────────────────────
  eggs:      ['egg', 'anda'],
  fish:      ['fish', 'mackerel', 'tuna', 'salmon', 'sardine', 'hilsa', 'rohu'],
  shellfish: ['prawn', 'shrimp', 'crab', 'lobster', 'mussel', 'clam', 'shellfish'],
};

// High-FODMAP items automatically avoided in IBS mode.
// Based on Monash University FODMAP guidelines for Indian cooking context.
export const IBS_FODMAP_ITEMS: AllergyItem[] = [
  'onion',    // very high fructans
  'garlic',   // very high fructans
  'mushroom', // polyols (mannitol)
  'wheat',    // fructans in large amounts
  'chana',    // GOS (galacto-oligosaccharides)
  'urad',     // GOS
  'toor',     // GOS
  'rajma',    // GOS
  'matki',    // GOS
  'moong',    // GOS (lower than others but significant in Indian servings)
];

/** Returns true if any ingredient line in the recipe contains a keyword for the given allergy. */
export function ingredientsContain(ingredients: string[], item: AllergyItem): boolean {
  const joined = ingredients.join(' ').toLowerCase();
  return ALLERGY_KEYWORDS[item].some((kw) => joined.includes(kw.toLowerCase()));
}

/** Returns true if the recipe is safe given avoidances + IBS mode. */
export function recipeIsSafe(
  ingredients: string[],
  avoidances: AllergyItem[],
  ibsMode: boolean,
): boolean {
  const effectiveAvoidances = ibsMode
    ? Array.from(new Set([...avoidances, ...IBS_FODMAP_ITEMS]))
    : avoidances;

  return !effectiveAvoidances.some((item) => ingredientsContain(ingredients, item));
}

// ── UI metadata ─────────────────────────────────────────────────────────────

export interface AllergyGroup {
  label: string;
  items: { value: AllergyItem; label: string }[];
}

export const ALLERGY_GROUPS: AllergyGroup[] = [
  {
    label: 'Nuts',
    items: [
      { value: 'peanuts',  label: 'Peanuts' },
      { value: 'cashews',  label: 'Cashews' },
      { value: 'almonds',  label: 'Almonds' },
      { value: 'walnuts',  label: 'Walnuts' },
      { value: 'coconut',  label: 'Coconut' },
    ],
  },
  {
    label: 'Grains',
    items: [
      { value: 'wheat',  label: 'Wheat / Gluten' },
      { value: 'maida',  label: 'Maida' },
      { value: 'bajra',  label: 'Bajra' },
      { value: 'jowar',  label: 'Jowar' },
      { value: 'ragi',   label: 'Ragi' },
    ],
  },
  {
    label: 'Dairy',
    items: [
      { value: 'milk',   label: 'Milk / Khoya' },
      { value: 'paneer', label: 'Paneer' },
      { value: 'curd',   label: 'Curd / Dahi' },
      { value: 'ghee',   label: 'Ghee' },
      { value: 'butter', label: 'Butter' },
      { value: 'cheese', label: 'Cheese' },
    ],
  },
  {
    label: 'Legumes',
    items: [
      { value: 'chana',  label: 'Chana / Besan' },
      { value: 'moong',  label: 'Moong' },
      { value: 'urad',   label: 'Urad Dal' },
      { value: 'toor',   label: 'Toor Dal' },
      { value: 'rajma',  label: 'Rajma' },
      { value: 'matki',  label: 'Matki' },
      { value: 'soy',    label: 'Soy / Tofu' },
    ],
  },
  {
    label: 'Seeds',
    items: [
      { value: 'sesame',   label: 'Sesame / Til' },
      { value: 'mustard',  label: 'Mustard' },
      { value: 'flaxseed', label: 'Flaxseed / Alsi' },
    ],
  },
  {
    label: 'Vegetables',
    items: [
      { value: 'onion',    label: 'Onion' },
      { value: 'garlic',   label: 'Garlic' },
      { value: 'tomato',   label: 'Tomato' },
      { value: 'brinjal',  label: 'Brinjal / Baingan' },
      { value: 'potato',   label: 'Potato / Aloo' },
      { value: 'mushroom', label: 'Mushroom' },
    ],
  },
  {
    label: 'Other',
    items: [
      { value: 'eggs',      label: 'Eggs' },
      { value: 'fish',      label: 'Fish' },
      { value: 'shellfish', label: 'Shellfish' },
    ],
  },
];
