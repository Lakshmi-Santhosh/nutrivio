// frontend/src/utils/constants.js

export const HEALTH_SCORE = {
  EXCELLENT: { min: 85, label: 'Excellent',  color: '#10b981', bg: 'rgba(16,185,129,0.12)', emoji: '🌟' },
  GOOD:      { min: 70, label: 'Good',       color: '#84cc16', bg: 'rgba(132,204,22,0.12)', emoji: '✅' },
  MODERATE:  { min: 50, label: 'Moderate',   color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', emoji: '⚠️' },
  POOR:      { min: 30, label: 'Poor',       color: '#f97316', bg: 'rgba(249,115,22,0.12)', emoji: '❌' },
  VERY_POOR: { min: 0,  label: 'Very Poor',  color: '#ef4444', bg: 'rgba(239,68,68,0.12)',  emoji: '🚫' },
};

export function getScoreCategory(score) {
  if (score >= 85) return HEALTH_SCORE.EXCELLENT;
  if (score >= 70) return HEALTH_SCORE.GOOD;
  if (score >= 50) return HEALTH_SCORE.MODERATE;
  if (score >= 30) return HEALTH_SCORE.POOR;
  return HEALTH_SCORE.VERY_POOR;
}

export const NUTRIENT_LIMITS = {
  calories: { max: 600,  unit: 'kcal', label: 'Calories',   icon: '🔥' },
  sugar:    { max: 50,   unit: 'g',    label: 'Sugar',      icon: '🍬' },
  fat:      { max: 35,   unit: 'g',    label: 'Total Fat',  icon: '🧈' },
  sodium:   { max: 2000, unit: 'mg',   label: 'Sodium',     icon: '🧂' },
  protein:  { max: 30,   unit: 'g',    label: 'Protein',    icon: '💪' },
};

export const LOADING_STEPS = [
  { label: 'Extracting ingredients from image…', icon: '🔍' },
  { label: 'Fetching product data…',             icon: '📦' },
  { label: 'Running AI analysis…',               icon: '🤖' },
  { label: 'Preparing your results…',            icon: '✨' },
];

export const SAMPLE_INGREDIENTS = [
  {
    label: '🍟 Fast Food Fries',
    text: 'Potatoes, Vegetable Oil (Canola Oil, Corn Oil, Soybean Oil, Hydrogenated Soybean Oil), Dextrose, Sodium Acid Pyrophosphate, Salt, Natural Beef Flavor, Citric Acid, Dimethylpolysiloxane.',
  },
  {
    label: '🧃 Juice Box',
    text: 'Water, High Fructose Corn Syrup, Apple Juice Concentrate, Citric Acid, Sodium Benzoate, Red 40, Yellow 5, Natural Flavors.',
  },
  {
    label: '🥣 Granola Bar',
    text: 'Whole grain rolled oats, honey, almonds, pumpkin seeds, sunflower oil, sea salt, vanilla extract.',
  },
  {
    label: '🍫 Chocolate Biscuit',
    text: 'Refined wheat flour, sugar, palm oil, cocoa powder, invert syrup, raising agents (500, 503), salt, artificial flavoring.',
  },
];

