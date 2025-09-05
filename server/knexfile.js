require('dotenv').config(); // Charge les variables d'environnement du fichier .env

module.exports = {
  development: {
    client: 'pg', // On spécifie qu'on utilise PostgreSQL
    connection: process.env.DATABASE_URL, // On utilise l'URL de connexion depuis les variables d'environnement
    migrations: {
      directory: './database/migrations'
    },
    seeds: {
      directory: './database/seeds'
    }
  },
  // Vous pouvez ajouter des configurations pour la production ici plus tard
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: './database/migrations'
    },
    seeds: {
      directory: './database/seeds'
    }
  }
};