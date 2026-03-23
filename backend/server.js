/**
 * server.js
 * Entry point del backend — Express + rutas modulares
 */

// Cargar variables de entorno desde .env (si existe)
require('dotenv').config();
const express = require('express');
const path    = require('path');
const cors    = require('cors');

// Routes
const productsRoutes = require('./routes/products.routes');
const coursesRoutes  = require('./routes/courses.routes');
const chatbotRoutes  = require('./routes/chatbot.routes');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// Servir frontend estático en producción
app.use(express.static(path.join(__dirname, '../frontend')));

// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/products', productsRoutes);
app.use('/api/courses',  coursesRoutes);
app.use('/api/chatbot',  chatbotRoutes);

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── Fallback SPA ──────────────────────────────────────────────────────────────
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 MusaCreativa server running on http://localhost:${PORT}`);
});

module.exports = app;
