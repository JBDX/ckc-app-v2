// Importe les outils nécessaires
require('dotenv').config();
const { Client } = require('pg');

// Fonction principale qui va tout exécuter
async function setupDatabase() {
    console.log("Démarrage de la configuration de la base de données avec les rôles admin...");
    const client = new Client({ connectionString: process.env.DATABASE_URL });

    try {
        await client.connect();
        console.log("Connecté à la base de données PostgreSQL !");

        // Supprime les anciennes tables
        console.log("Suppression des anciennes tables...");
        await client.query('DROP TABLE IF EXISTS point_history;');
        await client.query('DROP TABLE IF EXISTS teams;');
        await client.query('DROP TABLE IF EXISTS profs;');

        // --- CRÉATION DE LA TABLE 'PROFS' AVEC LE RÔLE ADMIN ---
        console.log("Création de la table 'profs' avec la colonne 'is_admin'...");
        await client.query(`
            CREATE TABLE profs (
                id SERIAL PRIMARY KEY,
                username VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                is_admin BOOLEAN DEFAULT FALSE, -- <<<=== 1. COLONNE AJOUTÉE
                created_at TIMESTAMPTZ DEFAULT NOW()
            );
        `);

        // Insertion des professeurs, en spécifiant qui est admin
        await client.query(
            // <<<=== 2. MISE À JOUR DE L'INSERTION
            "INSERT INTO profs (username, password, is_admin) VALUES ('prof.dupont', 'password123', TRUE), ('prof.durand', 'azerty456', FALSE);"
        );
        console.log("- Table 'profs' et utilisateurs (dont un admin) créés.");

        // --- CRÉATION DES AUTRES TABLES (INCHANGÉ) ---
        console.log("Création de la table 'teams'...");
        await client.query(`
            CREATE TABLE teams (
                id SERIAL PRIMARY KEY,
                name VARCHAR(50) NOT NULL UNIQUE,
                logo VARCHAR(255),
                members TEXT[],
                score INT DEFAULT 0
            );
        `);
        const teamsData = [
            { name: 'verts', logo: 'bi bi-tree-fill', members: ['Alice', 'Bob', 'Charlie'] },
            { name: 'jaunes', logo: 'bi bi-sun-fill', members: ['David', 'Eve', 'Frank'] },
            { name: 'bleus', logo: 'bi bi-droplet-fill', members: ['Grace', 'Heidi', 'Ivan'] },
            { name: 'rouges', logo: 'bi bi-heart-fill', members: ['Judy', 'Mallory', 'Oscar'] }
        ];
        for (const team of teamsData) {
            await client.query(
                'INSERT INTO teams (name, logo, members, score) VALUES ($1, $2, $3, $4)',
                [team.name, team.logo, team.members, 0]
            );
        }
        console.log("- Table 'teams' et équipes initiales créées.");

        console.log("Création de la table 'point_history'...");
        await client.query(`
            CREATE TABLE point_history (
                id SERIAL PRIMARY KEY,
                team_name VARCHAR(50) NOT NULL,
                points_change INT NOT NULL,
                reason VARCHAR(255),
                prof_username VARCHAR(255),
                created_at TIMESTAMPTZ DEFAULT NOW()
            );
        `);
        console.log("- Table 'point_history' créée.");

        console.log("\n✅ Configuration de la base de données terminée avec succès !");

    } catch (err) {
        console.error("\n❌ Erreur lors de la configuration de la base de données:", err);
    } finally {
        await client.end();
        console.log("Déconnecté de la base de données.");
    }
}

// Lance la fonction
setupDatabase();
