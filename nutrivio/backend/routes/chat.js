// backend/routes/chat.js
// AI Chat endpoint - answers nutrition questions about analyzed products

const express = require('express');
const router = express.Router();
const { callGemini } = require('../utils/geminiClient');

/**
 * POST /api/chat
 * Body: { question: string, context: { productName, brand, healthScore, ingredients, warnings, aiSummary } }
 */
router.post('/', async (req, res, next) => {
  try {
    const { question, context } = req.body;

    if (!question || question.trim().length < 3) {
      return res.status(400).json({ error: 'Question is required (min 3 characters).' });
    }

    console.log(`💬 Chat question: "${question}"`);

    const systemInstruction = `You are Nutrivio AI, a friendly and knowledgeable nutrition assistant.
You have just analyzed a food product and the user is asking follow-up questions about it.
Be concise (2-4 sentences), accurate, and helpful. Use simple language.
If the question is unrelated to food/nutrition, politely redirect to nutrition topics.`;

    const contextStr = context
      ? `Product: ${context.productName || 'Unknown'}
Brand: ${context.brand || 'Unknown'}
Health Score: ${context.healthScore || '?'}/100
Ingredients: ${context.ingredients || 'Not available'}
Warnings: ${context.warnings || 'None'}
AI Summary: ${context.aiSummary || 'Not available'}`
      : 'No product context available.';

    const prompt = `Product Context:
${contextStr}

User Question: ${question}

Provide a helpful, concise answer (2-4 sentences):`;

    const reply = await callGemini(prompt, systemInstruction);

    console.log(`✅ Chat reply generated (${reply.length} chars)`);
    res.json({ reply });

  } catch (error) {
    console.error('❌ Chat error:', error.message);
    if (error.message.includes('GEMINI_API_KEY')) {
      return res.status(500).json({ error: 'AI service not configured.' });
    }
    next(error);
  }
});

module.exports = router;
