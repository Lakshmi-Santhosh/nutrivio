// backend/routes/analyze.js
// Nutrivio 3-Phase Ingredient Analysis Engine
//
// Phase 1: Local ingredient DB (instant, covers ~80% of common ingredients)
// Phase 2: Category-based scoring (groups like sweeteners, unhealthyFats)
// Phase 3: Gemini AI for unknowns + final rich analysis

const express = require('express');
const router  = express.Router();
const { scoreIngredients } = require('../utils/ingredientRules');
const { scoreUnknownIngredient, analyzeWithGemini } = require('../utils/geminiClient');

/**
 * Parse raw ingredients string into an array.
 * Handles: "Water, Sugar, Salt." / "Water; Sugar; Salt"
 */
function parseIngredients(text) {
  return text
    .replace(/ingredients\s*:/i, '')
    .replace(/\.$/, '')
    .split(/[,;]\s*/)
    .map(s => s.trim())
    .filter(s => s.length > 1);
}

/**
 * Compute a base score (0-100) from scoreAdjustment.
 * Starts at 70 (neutral), adjusted per ingredient.
 */
function computeBaseScore(adjustment, ingredientCount) {
  const base = 70;
  const scaled = Math.max(-40, Math.min(30, adjustment * 1.5));
  return Math.max(5, Math.min(99, Math.round(base + scaled)));
}

/**
 * POST /api/analyze
 * Body: { ingredients: string, productMeta?: object }
 */
router.post('/', async (req, res, next) => {
  try {
    const { ingredients, productMeta } = req.body;

    if (!ingredients || ingredients.trim().length < 3) {
      return res.status(400).json({ error: 'Ingredients text is required.' });
    }

    console.log('🧪 Starting 3-phase analysis...');

    // ── PHASE 1 + 2: Local scoring ──────────────────────────────────────────
    const ingredientList = parseIngredients(ingredients);
    console.log(`   Phase 1/2: Scoring ${ingredientList.length} ingredients locally`);

    const { scoreAdjustment, flagged, matched, unknown } = scoreIngredients(ingredientList);
    const localScore = computeBaseScore(scoreAdjustment, ingredientList.length);

    console.log(`   Local score hint: ${localScore}/100 | Unknown: ${unknown.length} ingredients`);

    // ── PHASE 3: Gemini AI for unknowns ──────────────────────────────────────
    let extraFlagged = [];
    if (unknown.length > 0) {
      console.log(`   Phase 3: Asking Gemini about ${unknown.length} unknown ingredients...`);
      const aiResults = await Promise.all(
        unknown.slice(0, 10).map(ing => scoreUnknownIngredient(ing))
      );
      extraFlagged = aiResults.filter(r => r.harmful || r.score <= -2);
    }

    // ── FULL AI ANALYSIS via Gemini ───────────────────────────────────────────
    console.log('   🤖 Requesting full Gemini analysis...');
    let analysis;

    try {
      analysis = await analyzeWithGemini(ingredients, productMeta, localScore);
    } catch (aiError) {
      console.warn('   ⚠️  Gemini full analysis failed, using local score:', aiError.message);
      // Graceful fallback using local data
      const harmfulNames = [
        ...flagged.map(f => f.ingredient),
        ...extraFlagged.map(f => f.ingredient),
      ];
      analysis = {
        productName: productMeta?.name || 'Unknown Product',
        brand:       productMeta?.brand || '',
        healthScore: localScore,
        shortVerdict: localScore >= 70
          ? 'This product appears reasonably healthy.'
          : 'This product contains several concerning ingredients.',
        aiSummary: `Based on local ingredient analysis, this product scored ${localScore}/100. ` +
          (flagged.length > 0
            ? `Concerning ingredients detected: ${flagged.map(f => f.label).join(', ')}.`
            : 'No major harmful ingredients detected.'),
        ingredients:       ingredientList,
        harmfulIngredients: harmfulNames,
        nutrients: {
          calories: productMeta?.calories || 0,
          sugar:    productMeta?.sugar    || 0,
          fat:      productMeta?.fat      || 0,
          sodium:   productMeta?.sodium   || 0,
          protein:  productMeta?.protein  || 0,
        },
        warnings: flagged.map(f => ({
          text:  `Contains ${f.label}`,
          level: f.score <= -3 ? 'high' : 'medium',
        })),
        alternatives: [
          { name: 'Whole food alternatives', reason: 'Minimally processed foods are always healthier' },
        ],
        _source: 'local-fallback',
      };
    }

    // Merge real nutrition data if available from barcode
    if (productMeta?.calories) {
      analysis.nutrients = {
        calories: productMeta.calories || analysis.nutrients?.calories || 0,
        sugar:    productMeta.sugar    || analysis.nutrients?.sugar    || 0,
        fat:      productMeta.fat      || analysis.nutrients?.fat      || 0,
        sodium:   productMeta.sodium   || analysis.nutrients?.sodium   || 0,
        protein:  productMeta.protein  || analysis.nutrients?.protein  || 0,
      };
    }

    // Attach phase metadata (useful for debugging)
    analysis._meta = {
      localScore,
      phase1Matched:  matched.length,
      phase2Flagged:  flagged.length,
      phase3Unknown:  unknown.length,
      phase3AiFlagged: extraFlagged.length,
    };

    console.log(`✅ Analysis complete. Final score: ${analysis.healthScore}/100`);
    res.json({ analysis });

  } catch (error) {
    console.error('❌ Analyze error:', error.message);
    next(error);
  }
});

module.exports = router;
