// backend/utils/ingredientRules.js
// ─── NUTRIVIO INGREDIENT SCORING ENGINE ───────────────────────────────────────
// Phase 1: Direct ingredient rules (most common 50+ ingredients)
// Phase 2: Category-based grouping
// Phase 3: Gemini AI fallback for unknown ingredients

// ─── PHASE 1: DIRECT INGREDIENT RULES ────────────────────────────────────────
const ingredientRules = {
  // Sugars / Sweeteners (bad)
  'sugar':                   { score: -2, category: 'sweetener',     label: 'Added Sugar' },
  'added sugar':             { score: -3, category: 'sweetener',     label: 'Added Sugar' },
  'cane sugar':              { score: -2, category: 'sweetener',     label: 'Cane Sugar' },
  'brown sugar':             { score: -2, category: 'sweetener',     label: 'Brown Sugar' },
  'invert sugar':            { score: -2, category: 'sweetener',     label: 'Invert Sugar' },
  'high fructose corn syrup':{ score: -4, category: 'sweetener',     label: 'HFCS' },
  'hfcs':                    { score: -4, category: 'sweetener',     label: 'HFCS' },
  'corn syrup':              { score: -3, category: 'sweetener',     label: 'Corn Syrup' },
  'glucose syrup':           { score: -3, category: 'sweetener',     label: 'Glucose Syrup' },
  'fructose':                { score: -2, category: 'sweetener',     label: 'Fructose' },
  'dextrose':                { score: -2, category: 'sweetener',     label: 'Dextrose' },
  'maltose':                 { score: -2, category: 'sweetener',     label: 'Maltose' },
  'sucrose':                 { score: -2, category: 'sweetener',     label: 'Sucrose' },
  'honey':                   { score: -1, category: 'sweetener',     label: 'Honey' },
  'maple syrup':             { score: -1, category: 'sweetener',     label: 'Maple Syrup' },
  'agave':                   { score: -2, category: 'sweetener',     label: 'Agave' },
  'stevia':                  { score:  1, category: 'sweetener',     label: 'Stevia' },
  'aspartame':               { score: -3, category: 'sweetener',     label: 'Aspartame' },
  'sucralose':               { score: -2, category: 'sweetener',     label: 'Sucralose' },
  'saccharin':               { score: -3, category: 'sweetener',     label: 'Saccharin' },
  'acesulfame':              { score: -2, category: 'sweetener',     label: 'Acesulfame-K' },
  'maltodextrin':            { score: -2, category: 'sweetener',     label: 'Maltodextrin' },

  // Fats (bad)
  'palm oil':                { score: -2, category: 'unhealthyFat',  label: 'Palm Oil' },
  'hydrogenated oil':        { score: -4, category: 'unhealthyFat',  label: 'Hydrogenated Oil' },
  'partially hydrogenated':  { score: -4, category: 'unhealthyFat',  label: 'Trans Fat' },
  'trans fat':               { score: -4, category: 'unhealthyFat',  label: 'Trans Fat' },
  'shortening':              { score: -3, category: 'unhealthyFat',  label: 'Shortening' },
  'lard':                    { score: -2, category: 'unhealthyFat',  label: 'Lard' },

  // Fats (good)
  'olive oil':               { score:  2, category: 'healthyFat',    label: 'Olive Oil' },
  'avocado oil':             { score:  2, category: 'healthyFat',    label: 'Avocado Oil' },
  'coconut oil':             { score:  0, category: 'healthyFat',    label: 'Coconut Oil' },
  'sunflower oil':           { score: -1, category: 'healthyFat',    label: 'Sunflower Oil' },
  'canola oil':              { score:  0, category: 'healthyFat',    label: 'Canola Oil' },

  // Sodium / Preservatives
  'salt':                    { score: -1, category: 'sodium',        label: 'Salt' },
  'sodium':                  { score: -1, category: 'sodium',        label: 'Sodium' },
  'sodium chloride':         { score: -1, category: 'sodium',        label: 'Sodium Chloride' },
  'sodium benzoate':         { score: -3, category: 'preservative',  label: 'Sodium Benzoate' },
  'sodium nitrate':          { score: -3, category: 'preservative',  label: 'Sodium Nitrate' },
  'sodium nitrite':          { score: -4, category: 'preservative',  label: 'Sodium Nitrite' },
  'bha':                     { score: -3, category: 'preservative',  label: 'BHA' },
  'bht':                     { score: -3, category: 'preservative',  label: 'BHT' },
  'tbhq':                    { score: -3, category: 'preservative',  label: 'TBHQ' },
  'potassium sorbate':       { score: -1, category: 'preservative',  label: 'Potassium Sorbate' },
  'calcium propionate':      { score: -1, category: 'preservative',  label: 'Calcium Propionate' },

  // Artificial Colors
  'red 40':                  { score: -3, category: 'artificialColor', label: 'Red 40' },
  'yellow 5':                { score: -3, category: 'artificialColor', label: 'Yellow 5' },
  'yellow 6':                { score: -3, category: 'artificialColor', label: 'Yellow 6' },
  'blue 1':                  { score: -3, category: 'artificialColor', label: 'Blue 1' },
  'blue 2':                  { score: -3, category: 'artificialColor', label: 'Blue 2' },
  'green 3':                 { score: -3, category: 'artificialColor', label: 'Green 3' },
  'caramel color':           { score: -2, category: 'artificialColor', label: 'Caramel Color' },

  // Flavor Enhancers
  'msg':                     { score: -2, category: 'additive',      label: 'MSG' },
  'monosodium glutamate':    { score: -2, category: 'additive',      label: 'MSG' },
  'natural flavors':         { score: -1, category: 'additive',      label: 'Natural Flavors' },
  'artificial flavors':      { score: -2, category: 'additive',      label: 'Artificial Flavors' },

  // Healthy Ingredients (good)
  'whole wheat':             { score:  3, category: 'wholeFood',     label: 'Whole Wheat' },
  'whole grain':             { score:  3, category: 'wholeFood',     label: 'Whole Grain' },
  'oats':                    { score:  3, category: 'wholeFood',     label: 'Oats' },
  'rolled oats':             { score:  3, category: 'wholeFood',     label: 'Rolled Oats' },
  'millets':                 { score:  3, category: 'wholeFood',     label: 'Millets' },
  'quinoa':                  { score:  3, category: 'wholeFood',     label: 'Quinoa' },
  'almonds':                 { score:  2, category: 'wholeFood',     label: 'Almonds' },
  'walnuts':                 { score:  2, category: 'wholeFood',     label: 'Walnuts' },
  'flaxseed':                { score:  2, category: 'wholeFood',     label: 'Flaxseed' },
  'chia seeds':              { score:  2, category: 'wholeFood',     label: 'Chia Seeds' },
  'spinach':                 { score:  3, category: 'wholeFood',     label: 'Spinach' },
  'kale':                    { score:  3, category: 'wholeFood',     label: 'Kale' },
  'water':                   { score:  0, category: 'neutral',       label: 'Water' },
  'vitamin c':               { score:  1, category: 'vitamin',       label: 'Vitamin C' },
  'vitamin e':               { score:  1, category: 'vitamin',       label: 'Vitamin E' },
  'vitamin d':               { score:  1, category: 'vitamin',       label: 'Vitamin D' },
  'iron':                    { score:  1, category: 'mineral',       label: 'Iron' },
  'calcium':                 { score:  1, category: 'mineral',       label: 'Calcium' },
  'fiber':                   { score:  2, category: 'wholeFood',     label: 'Fiber' },
  'protein':                 { score:  1, category: 'wholeFood',     label: 'Protein' },
};

// ─── PHASE 2: CATEGORY GROUPINGS ─────────────────────────────────────────────
const categories = {
  sweeteners:     ['sugar', 'fructose', 'glucose syrup', 'corn syrup', 'cane sugar',
                   'invert sugar', 'brown sugar', 'maltose', 'sucrose', 'dextrose'],
  unhealthyFats:  ['palm oil', 'hydrogenated oil', 'partially hydrogenated', 'trans fat',
                   'shortening', 'lard'],
  artificialColors: ['red 40', 'yellow 5', 'yellow 6', 'blue 1', 'blue 2', 'green 3'],
  preservatives:  ['sodium benzoate', 'sodium nitrate', 'sodium nitrite', 'bha', 'bht', 'tbhq'],
  healthyFoods:   ['whole wheat', 'whole grain', 'oats', 'rolled oats', 'millets',
                   'quinoa', 'almonds', 'walnuts', 'flaxseed', 'chia seeds'],
};

/**
 * Score an ingredient list using Phase 1 + Phase 2 rules.
 * Returns { scoreAdjustment, flagged, matched }
 * Phase 3 (Gemini fallback) is handled in the analyze route.
 */
function scoreIngredients(ingredientList) {
  let scoreAdjustment = 0;
  const flagged   = [];   // Harmful ones
  const matched   = [];   // All matched
  const unknown   = [];   // Need AI

  for (const raw of ingredientList) {
    const lower = raw.toLowerCase().trim();
    let found = false;

    // Phase 1: direct match
    for (const [key, rule] of Object.entries(ingredientRules)) {
      if (lower.includes(key)) {
        scoreAdjustment += rule.score;
        matched.push({ ingredient: raw, rule });
        if (rule.score <= -2) {
          flagged.push({ ingredient: raw, label: rule.label, category: rule.category, score: rule.score });
        }
        found = true;
        break;
      }
    }

    // Phase 2: category match (if not found in Phase 1)
    if (!found) {
      for (const [cat, list] of Object.entries(categories)) {
        if (list.some(k => lower.includes(k))) {
          found = true;
          break;
        }
      }
    }

    if (!found) {
      unknown.push(raw);
    }
  }

  return { scoreAdjustment, flagged, matched, unknown };
}

module.exports = { ingredientRules, categories, scoreIngredients };
