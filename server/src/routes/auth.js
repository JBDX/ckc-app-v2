const express = require('express');
const { Client } = require('pg');
const jwt = require('jsonwebtoken'); // Outil pour créer les jetons de session
const router = express.Router();

// Route pour gérer la connexion
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const client = new Client({ connectionString: process.env.DATABASE_URL });

    // Vérification simple que les champs ne sont pas vides
    if (!username || !password) {
        return res.status(400).json({ message: "L'identifiant et le mot de passe sont requis." });
    }

    try {
        await client.connect();

        // 1. Chercher le professeur par son identifiant
        const result = await client.query('SELECT * FROM profs WHERE username = $1', [username]);
        const prof = result.rows[0];

        // 2. Vérifier si le professeur existe ET si le mot de passe correspond (en clair)
        if (!prof || prof.password !== password) {
            return res.status(401).json({ message: "Identifiant ou mot de passe incorrect." });
        }

        // 3. Préparer les informations à inclure dans le jeton
        const tokenPayload = {
            id: prof.id,
            username: prof.username,
            isAdmin: prof.is_admin // <<<=== L'information cruciale est ajoutée ici
        };

        // 4. Créer le jeton de connexion (valide pour 1 heure)
        const token = jwt.sign(
            tokenPayload,
            process.env.JWT_SECRET, // IMPORTANT: À changer pour une phrase secrète plus complexe !
            { expiresIn: '1h' }
        );
        
        // 5. Envoyer la réponse de succès avec le jeton
        res.status(200).json({ message: "Connexion réussie !", token });

    } catch (error) {
        console.error("Erreur lors de la connexion:", error);
        res.status(500).json({ message: "Erreur du serveur." });
    } finally {
        await client.end();
    }
});

module.exports = router;

