// frontend/src/hooks/useAnalyze.js
import { useState, useCallback } from 'react';
import { extractTextFromImage, analyzeIngredients, lookupBarcode } from '../services/api';

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = (e) => resolve(e.target.result.split(',')[1]);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });

export const useAnalyze = () => {
  const [loading,     setLoading]     = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result,      setResult]      = useState(null);
  const [error,       setError]       = useState(null);

  const analyze = useCallback(async (input) => {
    setLoading(true);
    setLoadingStep(0);
    setError(null);
    setResult(null);

    try {
      let analysisResult;

      if (input.type === 'image') {
        // Step 1: OCR
        setLoadingStep(0);
        const { text, confidence } = await extractTextFromImage(input.data);

        // Step 2: Analyze
        setLoadingStep(2);
        if (text && text.trim().length > 20) {
          const { analysis } = await analyzeIngredients(text);
          analysisResult = analysis;
        } else {
          throw new Error('Could not extract enough text from the image. Please ensure the ingredients list is clearly visible, or try manual entry.');
        }

      } else if (input.type === 'barcode') {
        // Step 1: Fetch product
        setLoadingStep(1);
        const { product } = await lookupBarcode(input.data);

        if (!product.ingredients) {
          throw new Error(`Found "${product.name}" but it has no ingredients data. Try entering ingredients manually.`);
        }

        // Step 2: Analyze
        setLoadingStep(2);
        const { analysis } = await analyzeIngredients(product.ingredients, {
          name:     product.name,
          brand:    product.brand,
          calories: product.calories,
          sugar:    product.sugar,
          fat:      product.fat,
          sodium:   product.sodium,
          protein:  product.protein,
          imageUrl: product.imageUrl,
        });
        analysisResult = analysis;
        analysisResult._productImageUrl = product.imageUrl;

      } else if (input.type === 'text') {
        setLoadingStep(2);
        const { analysis } = await analyzeIngredients(input.data);
        analysisResult = analysis;
      }

      setLoadingStep(3);
      await sleep(400);
      setResult(analysisResult);
      return true;

    } catch (err) {
      let msg;
      const errorCode = err.response?.data?.error;
      
      // Handle validation errors specifically
      if (errorCode === 'RATE_LIMITED') {
        msg = 'Too many requests. Please wait a moment and try again.';
      } else if (errorCode === 'NOT_FOOD_PRODUCT') {
        msg = err.response.data.message || 'This does not appear to be a food product. Please upload a food or beverage package image.';
      } else if (errorCode === 'NO_INGREDIENT_LABEL') {
        msg = err.response.data.message || 'No ingredient label visible. Please upload an image showing the ingredient list on the back of the package.';
      } else {
        msg = err.response?.data?.message || err.response?.data?.error || err.message || 'Analysis failed. Please try again.';
      }
      
      setError(msg);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
    setLoading(false);
    setLoadingStep(0);
  }, []);

  return { loading, loadingStep, result, error, analyze, reset };
};
