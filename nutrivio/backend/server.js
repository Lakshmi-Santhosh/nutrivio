// backend/server.js
// Nutrivio — Main Express server entry point

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const ocrRoutes = require("./routes/ocr");
const analyzeRoutes = require("./routes/analyze");
const barcodeRoutes = require("./routes/barcode");
const chatRoutes = require("./routes/chat");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 5000;

// ─── MIDDLEWARE ────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "http://localhost:4173",
      "http://192.168.0.200:5174",
      ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),
    ],
    credentials: true,
  }),
);

app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));

// ─── ROUTES ───────────────────────────────────────────────────────────────────
app.use("/api/ocr", ocrRoutes);
app.use("/api/analyze", analyzeRoutes);
app.use("/api/barcode", barcodeRoutes);
app.use("/api/chat", chatRoutes);

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    app: "Nutrivio",
    timestamp: new Date().toISOString(),
  });
});

// ─── ERROR HANDLER ────────────────────────────────────────────────────────────
app.use(errorHandler);

// ─── START ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ Nutrivio API running → http://localhost:${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV}`);
  console.log(
    `   Gemini key:  ${process.env.GEMINI_API_KEY ? "✓ set" : "✗ MISSING"}`,
  );
});
