/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('profs', function(table) {
    table.increments('id').primary(); // Un ID unique pour chaque prof
    table.string('username', 255).notNullable().unique(); // L'identifiant, qui doit être unique
    table.string('password', 255).notNullable(); // Le mot de passe haché
    table.timestamps(true, true); // Ajoute les colonnes created_at et updated_at
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('profs');
};