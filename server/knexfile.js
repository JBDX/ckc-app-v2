if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

// Outil pour décomposer l'URL de la base de données
const { parse } = require('pg-connection-string');

// Par défaut, la connexion est l'URL simple
let connection = process.env.DATABASE_URL;

// Pour la production, nous décomposons l'URL et ajoutons la configuration SSL
if (process.env.NODE_ENV === 'production' && process.env.DATABASE_URL) {
  const dbConfig = parse(process.env.DATABASE_URL);
  connection = {
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.database,
    ssl: { rejectUnauthorized: false },
  };
}

module.exports = {
  development: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: './database/migrations'
    },
    seeds: {
      directory: './database/seeds'
    }
  },
  production: {
    client: 'pg',
    connection: connection, // On utilise notre objet de connexion dynamique
    migrations: {
      directory: './database/migrations'
    },
    seeds: {
      directory: './database/seeds'
    }
  }
};

