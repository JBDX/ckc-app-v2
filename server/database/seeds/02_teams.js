/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  // Supprime les données existantes
  await knex('teams').del();

  // Insère les nouvelles équipes
  await knex('teams').insert([
    { name: 'verts', logo: '/uploads/verts-1757078918224.png', members: ['Alice', 'Bob', 'Charlie'] },
    { name: 'jaunes', logo: '/uploads/jaunes-1757078876680.png', members: ['David', 'Eve', 'Frank'] },
    { name: 'bleus', logo: '/uploads/bleus-1757078891298.png', members: ['Grace', 'Heidi', 'Ivan'] },
    { name: 'rouges', logo: '/uploads/rouges-1757078904257.png', members: ['Judy', 'Mallory', 'Oscar'] }
  ]);
};
