// backend/middleware/errorHandler.js

const errorHandler = (err, req, res, next) => {
  console.error('🚨 Error:', err.message);

  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ error: 'Image too large. Maximum size is 15MB.' });
  }

  if (err.response?.status === 400 && err.response?.data?.error?.code === 'API_KEY_INVALID') {
    return res.status(500).json({ error: 'Invalid Gemini API key. Check your GEMINI_API_KEY in backend/.env' });
  }

  if (err.response?.status === 429) {
    return res.status(429).json({ error: 'AI rate limit reached. Please wait a moment and try again.' });
  }

  res.status(err.status || 500).json({
    error: err.message || 'Something went wrong. Please try again.',
  });
};

module.exports = errorHandler;
