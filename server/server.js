// Fichier: ckc-app-v2/server/server.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path'); // On importe le module 'path'

// On importe tous nos fichiers de routes et notre gardien
const authRoutes = require('./src/routes/auth');
const teamRoutes = require('./src/routes/teams');
const adminRoutes = require('./src/routes/admin');
const checkAdmin = require('./src/middleware/checkAdmin');

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// --- LIGNE IMPORTANTE ---
// On dit à Express que le dossier 'public' contient des fichiers accessibles publiquement (nos logos)
app.use(express.static(path.join(__dirname, 'public')));

// Configuration des routes
app.use('/api/auth', authRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/admin', checkAdmin, adminRoutes);

app.listen(port, () => {
  console.log(`✅ Serveur démarré et à l'écoute sur http://localhost:${port}`);
});