const bcrypt = require('bcryptjs');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Supprime les données existantes pour éviter de créer des doublons à chaque exécution
  await knex('profs').del();

  // Hacher les mots de passe avant de les insérer (c'est une étape de sécurité cruciale)
  const hashedPassword1 = await bcrypt.hash('password123', 10); // Le 10 est le "coût" du hachage, un bon standard.
  const hashedPassword2 = await bcrypt.hash('azerty456', 10);

  // Insérer les nouveaux professeurs dans la table 'profs'
  await knex('profs').insert([
    { username: 'prof.dupont', password: hashedPassword1 },
    { username: 'prof.durand', password: hashedPassword2 }
  ]);
};