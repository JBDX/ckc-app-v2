if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

// Import des routes
const authRoutes = require('./src/routes/auth');
const teamRoutes = require('./src/routes/teams');
const adminRoutes = require('./src/routes/admin');
const checkAdmin = require('./src/middleware/checkAdmin');

const app = express();
const port = process.env.PORT || 3000;

// --- Middlewares ---
app.use(cors());
app.use(express.json());

// Logs en développement uniquement
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// --- Fichiers Statiques ---
// Frontend (HTML/CSS/JS)
app.use(express.static(path.join(__dirname, '../client/public')));
// Uploads (Images)
app.use(express.static(path.join(__dirname, 'public')));

// --- Routes API ---
app.use('/api/auth', authRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/admin', checkAdmin, adminRoutes);

// --- Fallback (pour renvoyer l'index.html si aucune route ne matche) ---
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/public/index.html'));
});

// --- Démarrage ---
app.listen(port, () => {
  console.log(`🚀 Serveur démarré sur le port ${port}`);
});