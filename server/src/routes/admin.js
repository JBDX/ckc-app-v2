const express = require('express');
const { Client } = require('pg');
const multer = require('multer');
const path = require('path');
const router = express.Router();

// ... (la configuration de multer et la route pour mettre à jour l'équipe ne changent pas) ...
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req, file, cb){
        cb(null, req.params.name + '-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

router.put('/teams/:name', upload.single('logoFile'), async (req, res) => {
    // ... (cette route reste identique)
    const { name } = req.params;
    const { members } = req.body;
    const logoPath = req.file ? `/uploads/${req.file.filename}` : null;
    const membersArray = members.split(',').map(m => m.trim());
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    try {
        await client.connect();
        if (logoPath) {
            await client.query('UPDATE teams SET logo = $1, members = $2 WHERE name = $3', [logoPath, membersArray, name]);
        } else {
            await client.query('UPDATE teams SET members = $1 WHERE name = $2', [membersArray, name]);
        }
        res.status(200).json({ message: 'Équipe mise à jour avec succès.' });
    } catch (error) {
        console.error("Erreur lors de la mise à jour de l'équipe:", error);
        res.status(500).json({ message: 'Erreur du serveur.' });
    } finally {
        await client.end();
    }
});


// --- ROUTE "REMISE À ZÉRO" MISE À JOUR ---
router.put('/teams/:name/reset-score', async (req, res) => {
    const { name } = req.params;
    const adminUsername = req.user.username; // On récupère le nom de l'admin
    const client = new Client({ connectionString: process.env.DATABASE_URL });

    try {
        await client.connect();
        await client.query('BEGIN'); // Démarre une transaction pour la sécurité

        // 1. On récupère le score actuel de l'équipe
        const teamResult = await client.query('SELECT score FROM teams WHERE name = $1', [name]);
        const currentScore = teamResult.rows[0].score;

        // 2. On insère l'événement "Remise à zéro" dans l'historique
        await client.query(
            `INSERT INTO point_history (team_name, points_change, reason, prof_username) 
             VALUES ($1, $2, $3, $4)`,
            [name, -currentScore, "Remise à zéro des points", adminUsername]
        );
        
        // 3. On met le score de l'équipe à 0
        await client.query('UPDATE teams SET score = 0 WHERE name = $1', [name]);
        
        await client.query('COMMIT'); // On valide toutes les opérations
        res.status(200).json({ message: 'Les points ont été remis à zéro.' });

    } catch (error) {
        await client.query('ROLLBACK'); // En cas d'erreur, on annule tout
        console.error("Erreur lors de la réinitialisation des points:", error);
        res.status(500).json({ message: 'Erreur du serveur.' });
    } finally {
        await client.end();
    }
});

module.exports = router;