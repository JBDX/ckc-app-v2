require('dotenv').config();
const { parse } = require('pg-connection-string');

// Configuration dynamique de la connexion BDD
const getConnectionParams = () => {
  const connectionString = process.env.DATABASE_URL;
  
  // En production (Railway), on doit parser l'URL pour ajouter le paramètre SSL
  if (process.env.NODE_ENV === 'production' && connectionString) {
    const config = parse(connectionString);
    return {
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
      database: config.database,
      ssl: { rejectUnauthorized: false } // Indispensable pour Railway
    };
  }

  // En local, on utilise l'URL telle quelle
  return connectionString;
};

module.exports = {
  development: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    migrations: { directory: './database/migrations' },
    seeds: { directory: './database/seeds' }
  },
  production: {
    client: 'pg',
    connection: getConnectionParams(),
    pool: { min: 2, max: 10 },
    migrations: { directory: './database/migrations' },
    seeds: { directory: './database/seeds' }
  }
};