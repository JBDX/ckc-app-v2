const express = require('express');
const { Client } = require('pg');
const router = express.Router();

// --- Route pour récupérer toutes les équipes et leurs scores ---
router.get('/', async (req, res) => {
    // ... (cette route ne change pas)
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    try {
        await client.connect();
        const result = await client.query('SELECT * FROM teams ORDER BY name');
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ message: "Erreur du serveur." });
    } finally {
        await client.end();
    }
});

// --- Route pour ajouter des points à une équipe ---
router.post('/points', async (req, res) => {
    // ... (cette route ne change pas)
    const { teamName, points, reason, prof } = req.body;
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    try {
        await client.connect();
        await client.query('UPDATE teams SET score = score + $1 WHERE name = $2', [points, teamName]);
        await client.query(
            'INSERT INTO point_history (team_name, points_change, reason, prof_username) VALUES ($1, $2, $3, $4)',
            [teamName, points, reason, prof]
        );
        res.status(200).json({ message: 'Points ajoutés avec succès.' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur du serveur.' });
    } finally {
        await client.end();
    }
});

// --- Route pour l'historique récent (pour la page d'accueil) ---
router.get('/history', async (req, res) => {
    // ... (cette route ne change pas)
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    try {
        await client.connect();
        const result = await client.query('SELECT * FROM point_history ORDER BY created_at DESC LIMIT 5');
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ message: "Erreur du serveur." });
    } finally {
        await client.end();
    }
});

// --- NOUVELLE ROUTE POUR L'HISTORIQUE COMPLET (POUR LA PAGE ADMIN) ---
router.get('/history/full', async (req, res) => {
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    try {
        await client.connect();
        // On sélectionne toutes les actions, de la plus récente à la plus ancienne
        const result = await client.query('SELECT * FROM point_history ORDER BY created_at DESC');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Erreur lors de la récupération de l'historique complet:", error);
        res.status(500).json({ message: "Erreur du serveur." });
    } finally {
        await client.end();
    }
});

module.exports = router;