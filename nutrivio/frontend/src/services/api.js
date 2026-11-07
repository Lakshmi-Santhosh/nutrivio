// frontend/src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 90000, // OCR + AI can take time
  headers: { 'Content-Type': 'application/json' },
});

export const extractTextFromImage = async (imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);
  const res = await api.post('/ocr', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

export const analyzeIngredients = async (ingredients, productMeta = null) => {
  const res = await api.post('/analyze', { ingredients, productMeta });
  return res.data;
};

export const lookupBarcode = async (barcode) => {
  const res = await api.get(`/barcode/${barcode}`);
  return res.data;
};

export const chatWithAI = async (question, context) => {
  const res = await api.post('/chat', { question, context });
  return res.data;
};

export default api;
