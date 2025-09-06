/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  // Supprime les données existantes
  await knex('profs').del();

  // Insère les professeurs avec les mots de passe en clair et le statut admin
  // IMPORTANT: Ceci correspond à votre logique de connexion actuelle.
  // Pour une meilleure sécurité, vous devriez utiliser bcrypt pour vérifier les mots de passe.
  await knex('profs').insert([
    { username: 'prof.dupont', password: 'password123', is_admin: true },
    { username: 'prof.durand', password: 'azerty456', is_admin: false }
  ]);
};
