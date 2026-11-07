// backend/utils/geminiClient.js
// Gemini AI integration for Nutrivio
// Used for: (1) full ingredient analysis, (2) Phase 3 unknown ingredient lookup

const axios = require('axios');

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

/**
 * Call Gemini with a prompt, returns parsed text response
 */
async function callGemini(prompt, systemInstruction = '') {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your-gemini-api-key-here') {
    throw new Error('GEMINI_API_KEY not configured. Add it to backend/.env');
  }

  const body = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 1500,
    },
  };

  if (systemInstruction) {
    body.systemInstruction = { parts: [{ text: systemInstruction }] };
  }

  const response = await axios.post(
    `${GEMINI_API_BASE}?key=${apiKey}`,
    body,
    { timeout: 30000 }
  );

  const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
  return text.trim();
}

/**
 * PHASE 3: Ask Gemini about an unknown ingredient.
 * Returns { ingredient, category, score, explanation }
 * Result is saved to an in-memory cache so it's reused.
 */
const unknownCache = {};

async function scoreUnknownIngredient(ingredient) {
  const key = ingredient.toLowerCase().trim();
  if (unknownCache[key]) return unknownCache[key];

  const prompt = `You are a food health expert. Evaluate this food ingredient: "${ingredient}"

Return ONLY a valid JSON object (no markdown, no explanation):
{
  "ingredient": "${ingredient}",
  "category": "sweetener" | "preservative" | "artificialColor" | "unhealthyFat" | "healthyFood" | "neutral" | "additive",
  "score": (integer from -4 to +3),
  "harmful": true | false,
  "explanation": "one sentence reason"
}

Score guide: -4 = very harmful, -3 = harmful, -2 = concerning, -1 = slightly bad, 0 = neutral, 1 = slightly good, 2 = good, 3 = excellent`;

  try {
    const raw = await callGemini(prompt);
    const cleaned = raw.replace(/```json|```/g, '').trim();
    const result = JSON.parse(cleaned);
    unknownCache[key] = result; // Cache for future use
    console.log(`  🤖 Gemini scored "${ingredient}": ${result.score} (${result.category})`);
    return result;
  } catch (e) {
    console.warn(`  ⚠️  Could not score "${ingredient}" via Gemini:`, e.message);
    return { ingredient, category: 'neutral', score: 0, harmful: false, explanation: 'Unknown ingredient' };
  }
}

/**
 * Full product analysis via Gemini AI.
 * Uses our local score as a "pre-analysis hint" and asks Gemini for the full structured result.
 */
async function analyzeWithGemini(ingredients, productMeta, localScoreHint) {
  const systemInstruction = `You are Nutrivio AI, an expert food health analyst for Indian and global packaged foods.
Analyze food products and return ONLY a valid JSON object — no markdown, no backticks, no explanation.

Health score guide (0-100):
- 85-100: Excellent (whole foods, minimal processing)
- 70-84: Good (healthy with minor concerns)
- 50-69: Moderate (some concerning ingredients)
- 30-49: Poor (multiple unhealthy components)
- 0-29: Very poor (heavily processed, harmful ingredients)

Flag these as harmful: artificial colors (Red 40, Yellow 5, Blue 1), HFCS, trans fats, hydrogenated oils,
sodium benzoate, sodium nitrite, BHA/BHT, aspartame, saccharin, MSG, excessive sugar, palm oil, maltodextrin.`;

  const metaStr = productMeta
    ? `Product: ${productMeta.name || 'Unknown'}\nBrand: ${productMeta.brand || ''}\n` +
      `Nutrition per 100g — Calories: ${productMeta.calories || '?'} kcal, ` +
      `Sugar: ${productMeta.sugar || '?'}g, Fat: ${productMeta.fat || '?'}g, ` +
      `Sodium: ${productMeta.sodium || '?'}mg, Protein: ${productMeta.protein || '?'}g\n\n`
    : '';

  const prompt = `${metaStr}Ingredients: ${ingredients}

Local pre-analysis score hint: ${localScoreHint}/100 (use as a reference, not a constraint)

Return ONLY this exact JSON structure:
{
  "productName": "string",
  "brand": "string",
  "healthScore": number (0-100),
  "shortVerdict": "1-2 sentence verdict",
  "aiSummary": "3-5 sentence detailed analysis",
  "ingredients": ["array of ingredient strings"],
  "harmfulIngredients": ["subset that are concerning"],
  "nutrients": {
    "calories": number,
    "sugar": number,
    "fat": number,
    "sodium": number,
    "protein": number
  },
  "warnings": [
    { "text": "warning description", "level": "high" | "medium" | "low" }
  ],
  "alternatives": [
    { "name": "product name", "reason": "why it is healthier" }
  ]
}`;

  const raw = await callGemini(prompt, systemInstruction);
  const cleaned = raw.replace(/```json|```/g, '').trim();
  return JSON.parse(cleaned);
}

/**
 * Local fallback classifier using keyword detection.
 * Used when Gemini API is unavailable (rate limited, down, etc.)
 * Analyzes OCR text to detect if it's a food product label.
 */
function localFoodClassifier(ocrText) {
  if (!ocrText || ocrText.length < 20) {
    return { isFoodProduct: false, hasIngredientLabel: false, confidence: 0 };
  }

  const text = ocrText.toLowerCase();
  
  // Food/ingredient label keywords (strong indicators)
  const strongFoodKeywords = [
    'ingredients:', 'ingredients', 'nutrition facts', 'nutrition information',
    'calories', 'protein', 'carbohydrate', 'fat', 'sugar', 'sodium',
    'dietary fiber', 'cholesterol', 'serving size', 'servings per',
    'contains:', 'may contain', 'allergen', 'gluten', 'lactose',
    'per 100g', 'per 100ml', 'per serving', 'energy', 'kcal', 'kj'
  ];
  
  // Non-food keywords (strong indicators it's NOT food)
  const nonFoodKeywords = [
    'shampoo', 'conditioner', 'soap', 'lotion', 'cream', 'moisturizer',
    'toothpaste', 'mouthwash', 'deodorant', 'perfume', 'cologne', 'balm',
    'medicine', 'tablet', 'capsule', 'dosage', 'prescription', 'supplement',
    'detergent', 'cleaner', 'disinfectant', 'bleach', 'sanitizer',
    'email', 'from:', 'to:', 'subject:', 'dear', 'regards',
    'invoice', 'receipt', 'payment', 'transaction', 'resume', 'cv',
    'screenshot', 'qr code', 'barcode only', 'document', 'text message'
  ];
  
  // Count matches
  let foodScore = 0;
  let nonFoodScore = 0;
  
  for (const keyword of strongFoodKeywords) {
    if (text.includes(keyword)) foodScore += 2;
  }
  
  for (const keyword of nonFoodKeywords) {
    if (text.includes(keyword)) nonFoodScore += 3;
  }
  
  const isFoodProduct = foodScore > nonFoodScore + 2 && foodScore >= 4;
  const hasIngredientLabel = foodScore >= 6;
  
  return {
    isFoodProduct,
    hasIngredientLabel,
    confidence: Math.min(100, foodScore * 10),
    foodScore,
    nonFoodScore
  };
}

/**
 * Validate if an image contains food product INGREDIENT LABELS using Gemini Vision API.
 * Falls back to local classifier if Gemini is unavailable.
 * Returns { isFoodProduct: boolean, hasIngredientLabel: boolean, reason: string, detectedProduct: string }
 */
async function validateFoodProductImage(imageBase64, mimeType = 'image/jpeg', ocrTextForFallback = null) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your-gemini-api-key-here') {
    // No API key - use local classifier if OCR text available
    if (ocrTextForFallback) {
      console.log('  🔍 No Gemini API key, using local classifier...');
      const local = localFoodClassifier(ocrTextForFallback);
      return {
        isFoodProduct: local.isFoodProduct,
        hasIngredientLabel: local.hasIngredientLabel,
        detectedProduct: local.isFoodProduct ? 'Food product (local detection)' : 'Non-food item',
        reason: `Local classifier (confidence: ${local.confidence}%)`,
        usedFallback: true
      };
    }
    throw new Error('GEMINI_API_KEY not configured. Add it to backend/.env');
  }

  const prompt = `You are a strict food product label validator. Analyze the image and decide if it is a packaged food or beverage product AND whether a readable ingredient list or nutrition label is present.

Rules — be conservative:
- Return isFoodProduct=false unless you clearly see a packaged food/beverage item.
- Return hasIngredientLabel=false unless you can actually read an "Ingredients" list or a "Nutrition Facts"/"Nutrition Information" panel.
- Generic food photos, cooked meals, raw produce, restaurant dishes, and packaging fronts WITHOUT a visible label are NOT valid.
- If you are uncertain, return isFoodProduct=false.

VALID examples (isFoodProduct: true, hasIngredientLabel: true):
- Back of a snack packet showing "Ingredients: refined wheat flour, palm oil, salt..."
- A nutrition facts panel with calories, fat, sugar, sodium, protein
- A beverage can showing ingredients and nutritional info

INVALID examples (isFoodProduct: false):
- Medicine, tablets, capsules, shampoo, soap, lotion, cosmetics, detergent, cleaning products
- People, pets, scenery, random objects, documents, screenshots, QR codes, receipts
- A logo or product front with no ingredient/nutrition text visible

Return ONLY a valid JSON object (no markdown, no explanation, no extra text):
{
  "isFoodProduct": true | false,
  "hasIngredientLabel": true | false,
  "detectedProduct": "brief description of what you see",
  "reason": "one sentence explanation"
}`;

  const body = {
    contents: [{
      parts: [
        { text: prompt },
        {
          inline_data: {
            mime_type: mimeType,
            data: imageBase64
          }
        }
      ]
    }],
    generationConfig: {
      temperature: 0.1,
      maxOutputTokens: 200,
    },
  };

  try {
    const response = await axios.post(
      `${GEMINI_API_BASE}?key=${apiKey}`,
      body,
      { timeout: 20000 }
    );

    const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    console.log('  🔍 Gemini raw response:', text.substring(0, 200));

    // Try to extract a JSON object, tolerating markdown fences and surrounding text
    let cleaned = text.replace(/```json|```/g, '').trim();
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) cleaned = jsonMatch[0];

    let result;
    try {
      result = JSON.parse(cleaned);
    } catch (parseErr) {
      console.warn('  ⚠️  JSON parse failed, falling back to OCR classifier');
      result = null;
    }

    // Defense-in-depth: if OCR text strongly indicates a food label, accept it even if Gemini is unsure or unparseable
    const local = ocrTextForFallback ? localFoodClassifier(ocrTextForFallback) : null;

    if (!result || !(result.isFoodProduct && result.hasIngredientLabel)) {
      if (local && local.isFoodProduct && local.hasIngredientLabel) {
        console.log(`  ✅ OCR classifier overrode visual check (foodScore=${local.foodScore})`);
        return {
          isFoodProduct: true,
          hasIngredientLabel: true,
          detectedProduct: 'Food product (verified by OCR text)',
          reason: `OCR detected ingredient/nutrition keywords (confidence: ${local.confidence}%).`,
          usedFallback: true
        };
      }
    }

    if (!result) {
      return {
        isFoodProduct: false,
        hasIngredientLabel: false,
        detectedProduct: 'Unrecognized image',
        reason: 'Could not reliably validate the image. Please upload a clear food product label.'
      };
    }

    const validLabel = result.isFoodProduct && result.hasIngredientLabel;
    console.log(`  🔍 Food validation: ${validLabel ? '✅' : '❌'} - ${result.detectedProduct} (ingredients visible: ${result.hasIngredientLabel ? 'yes' : 'no'})`);
    return result;
  } catch (e) {
    console.error('  ⚠️  Food validation API error:', e.message);
    
    // If we have OCR text, use local fallback classifier
    if (ocrTextForFallback) {
      console.log('  🔍 Using local fallback classifier...');
      const local = localFoodClassifier(ocrTextForFallback);
      console.log(`  🔍 Local classifier: foodScore=${local.foodScore}, nonFoodScore=${local.nonFoodScore}, isFoodProduct=${local.isFoodProduct}`);
      return {
        isFoodProduct: local.isFoodProduct,
        hasIngredientLabel: local.hasIngredientLabel,
        detectedProduct: local.isFoodProduct ? 'Food product (local detection)' : 'Non-food item (local detection)',
        reason: `Local classifier used (Gemini unavailable). Confidence: ${local.confidence}%`,
        usedFallback: true
      };
    }
    
    // No fallback available - return error
    if (e.response?.status === 429) {
      return { 
        isFoodProduct: false, 
        hasIngredientLabel: false, 
        detectedProduct: 'Rate limited', 
        reason: 'Too many requests. Please wait a moment and try again.',
        errorCode: 'RATE_LIMITED'
      };
    }
    
    return { 
      isFoodProduct: false, 
      hasIngredientLabel: false, 
      detectedProduct: 'Unknown', 
      reason: 'Could not validate image. Please try again.',
      errorCode: 'VALIDATION_FAILED'
    };
  }
}

module.exports = { callGemini, scoreUnknownIngredient, analyzeWithGemini, validateFoodProductImage };
