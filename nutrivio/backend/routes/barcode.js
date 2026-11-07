// backend/routes/barcode.js
// Fetches product data from Open Food Facts (free, no API key needed)

const express = require('express');
const axios   = require('axios');
const router  = express.Router();

/**
 * GET /api/barcode/:code
 */
router.get('/:code', async (req, res, next) => {
  try {
    const { code } = req.params;

    if (!/^\d{8,14}$/.test(code)) {
      return res.status(400).json({ error: 'Invalid barcode. Must be 8–14 digits.' });
    }

    console.log(`🔢 Barcode lookup: ${code}`);

    const response = await axios.get(
      `https://world.openfoodfacts.org/api/v0/product/${code}.json`,
      {
        timeout: 12000,
        headers: { 'User-Agent': 'Nutrivio/1.0 (educational project; contact@nutrivio.app)' },
      }
    );

    const data = response.data;

    if (data.status !== 1) {
      return res.status(404).json({
        error: 'Product not found. Try scanning the label or entering ingredients manually.',
      });
    }

    const p          = data.product;
    const nutriments = p.nutriments || {};

    const product = {
      name:        p.product_name          || p.product_name_en || 'Unknown Product',
      brand:       p.brands                || '',
      imageUrl:    p.image_url             || null,
      ingredients: p.ingredients_text      || p.ingredients_text_en || '',
      calories:    nutriments['energy-kcal_100g'] || 0,
      sugar:       nutriments['sugars_100g']       || 0,
      fat:         nutriments['fat_100g']          || 0,
      sodium:      (nutriments['sodium_100g'] || 0) * 1000, // g → mg
      protein:     nutriments['proteins_100g']     || 0,
      fiber:       nutriments['fiber_100g']        || 0,
      nutriscore:  p.nutriscore_grade              || null,
    };

    console.log(`✅ Found: "${product.name}" by ${product.brand || 'Unknown brand'}`);
    res.json({ product });

  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      return res.status(408).json({ error: 'Open Food Facts timed out. Try again.' });
    }
    next(error);
  }
});

module.exports = router;
