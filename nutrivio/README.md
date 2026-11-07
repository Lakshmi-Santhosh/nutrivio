# 🌿 Nutrivio — AI Food Label Analyzer

A Progressive Web App (PWA) that analyzes food product ingredients using a 3-phase engine:

- **Phase 1** — Local ingredient database (instant, covers 80%+ of common packaged foods)
- **Phase 2** — Category-based grouping (sweeteners, unhealthy fats, preservatives, etc.)
- **Phase 3** — Gemini AI fallback for unknown ingredients + rich full analysis

---

## Tech Stack

| Layer     | Technology |
|-----------|------------|
| Frontend  | React 18 + Vite + Tailwind CSS |
| PWA       | vite-plugin-pwa (installable on iPhone/Android) |
| Backend   | Node.js + Express |
| OCR       | Tesseract.js (reads food label photos) |
| AI        | Google Gemini 1.5 Flash |
| Food DB   | Open Food Facts (free, no key needed) |

---

## Quick Start

### 1. Get a Gemini API Key (Free)

1. Go to [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click **Create API key**
4. Copy the key

### 2. Configure Backend

```bash
cd backend
cp .env.example .env
# Open .env and paste your Gemini key:
# GEMINI_API_KEY=AIza...your-key-here
```

### 3. Install & Run Backend

```bash
cd backend
npm install
npm run dev
# Backend running at http://localhost:5000
```

### 4. Install & Run Frontend

```bash
cd frontend
npm install
npm run dev
# Frontend running at http://localhost:5173
```

### 5. Open in Browser

Visit **http://localhost:5173**

---

## Install as Mobile App (PWA)

### iPhone / iPad
1. Open `http://your-deployed-url` in **Safari**
2. Tap the **Share** button (box with arrow)
3. Tap **Add to Home Screen**
4. Tap **Add**

### Android
1. Open in **Chrome**
2. Tap the **⋮ menu → Add to Home Screen**

---

## Project Structure

```
nutrivio/
├── backend/
│   ├── server.js                  ← Express entry point
│   ├── routes/
│   │   ├── ocr.js                 ← Tesseract.js image OCR
│   │   ├── analyze.js             ← 3-phase analysis engine
│   │   └── barcode.js             ← Open Food Facts lookup
│   ├── middleware/
│   │   └── errorHandler.js
│   └── utils/
│       ├── ingredientRules.js     ← Phase 1 & 2 scoring DB
│       └── geminiClient.js        ← Gemini AI integration
│
└── frontend/
    ├── vite.config.js             ← Vite + PWA config
    ├── src/
    │   ├── App.jsx                ← Root component
    │   ├── components/
    │   │   ├── layout/            ← Header
    │   │   ├── upload/            ← Camera, Text, Barcode inputs
    │   │   ├── results/           ← Score ring, nutrient bars, etc.
    │   │   └── ui/                ← Shared UI primitives
    │   ├── hooks/
    │   │   └── useAnalyze.js      ← Analysis workflow hook
    │   ├── services/
    │   │   └── api.js             ← Axios API layer
    │   └── utils/
    │       └── constants.js       ← Score thresholds, samples
    └── public/
        ├── icons/                 ← PWA icons (replace with your logo)
        └── favicon.svg
```

---

## How the 3-Phase Engine Works

```
Ingredient List
      │
      ▼
Phase 1: Check local DB (~50 ingredients)
      │
      ▼
Phase 2: Category matching (sweeteners, fats, colors…)
      │
      ▼
Phase 3: Unknown ingredients → Gemini AI → Cache result
      │
      ▼
Full Gemini Analysis (uses local score as hint)
      │
      ▼
Structured JSON → UI
```

---

## Deployment

### Backend → Railway or Render
1. Push `backend/` to GitHub
2. Connect to [Railway](https://railway.app) or [Render](https://render.com)
3. Set env var: `GEMINI_API_KEY=your-key`
4. Deploy

### Frontend → Vercel
1. Update `vite.config.js` proxy target to your backend URL
2. Push `frontend/` to GitHub
3. Import to [Vercel](https://vercel.com)
4. Deploy

---

## Customizing the Ingredient Database

Open `backend/utils/ingredientRules.js` and add/edit entries:

```js
const ingredientRules = {
  'your-ingredient': { score: -2, category: 'sweetener', label: 'Display Name' },
  // score: -4 (very bad) to +3 (excellent)
};
```

The more entries you add, the less Gemini API calls you need (Phase 3 is only for unknowns).

---

*Built with React, Node.js, Tesseract.js, and Google Gemini*
