// backend/routes/ocr.js
// Handles image uploads and extracts ingredient text via Tesseract.js

const express = require('express');
const multer  = require('multer');
const Tesseract = require('tesseract.js');
const { validateFoodProductImage } = require('../utils/geminiClient');
const router  = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed'), false);
  },
});

/**
 * POST /api/ocr
 * Accepts an image, returns extracted text.
 */
router.post('/', upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    console.log(`🔍 OCR processing: ${req.file.originalname} (${(req.file.size / 1024).toFixed(0)} KB)`);

    // Step 1: Run OCR first (needed for fallback classification)
    console.log('  📝 Running OCR...');
    const ocrResult = await Tesseract.recognize(req.file.buffer, 'eng', {
      logger: (m) => {
        if (m.status === 'recognizing text') {
          process.stdout.write(`\r  OCR: ${Math.round(m.progress * 100)}%`);
        }
      },
    });

    process.stdout.write('\n');
    const text       = ocrResult.data.text;
    const confidence = ocrResult.data.confidence;
    console.log(`  ✅ OCR done. Confidence: ${confidence.toFixed(1)}% | Chars: ${text.length}`);

    // Step 2: Validate if image is a food product (with OCR text as fallback)
    console.log('  🔍 Validating if image is a food product...');
    const imageBase64 = req.file.buffer.toString('base64');
    const validation = await validateFoodProductImage(imageBase64, req.file.mimetype, text);

    // Handle rate limiting error (only if no fallback was used)
    if (validation.errorCode === 'RATE_LIMITED') {
      console.log(`  ⚠️ Rate limited by Gemini API (no fallback available)`);
      return res.status(429).json({
        error: 'RATE_LIMITED',
        message: 'Too many requests. Please wait a moment and try again.',
        reason: validation.reason,
      });
    }

    if (!validation.isFoodProduct) {
      console.log(`  ❌ Not a food product: ${validation.detectedProduct}`);
      return res.status(400).json({
        error: 'NOT_FOOD_PRODUCT',
        message: `This appears to be ${validation.detectedProduct}, not a food product. Please upload an image of a food or beverage package with visible ingredient labels.`,
        detectedProduct: validation.detectedProduct,
        reason: validation.reason,
      });
    }

    if (!validation.hasIngredientLabel) {
      console.log(`  ❌ No nutrition/ingredient label visible: ${validation.detectedProduct}`);
      return res.status(400).json({
        error: 'NO_INGREDIENT_LABEL',
        message: `This appears to be a food product (${validation.detectedProduct}), but the nutrition label or ingredient list is not visible. Please upload an image showing the back of the package with nutrition information or ingredients.`,
        detectedProduct: validation.detectedProduct,
        reason: validation.reason,
      });
    }

    const fallbackNote = validation.usedFallback ? ' (using local classifier)' : '';
    console.log(`  ✅ Food product validated: ${validation.detectedProduct}${fallbackNote}`);

    res.json({
      text,
      confidence,
      wordCount: text.split(/\s+/).filter(Boolean).length,
    });

  } catch (error) {
    console.error('❌ OCR error:', error.message);
    next(error);
  }
});

module.exports = router;
