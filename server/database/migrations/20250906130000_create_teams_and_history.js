/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
    .createTable('teams', function(table) {
      table.increments('id').primary();
      table.string('name', 50).notNullable().unique();
      table.string('logo', 255);
      table.specificType('members', 'TEXT[]');
      table.integer('score').defaultTo(0);
    })
    .createTable('point_history', function(table) {
      table.increments('id').primary();
      table.string('team_name', 50).notNullable();
      table.integer('points_change').notNullable();
      table.string('reason', 255);
      table.string('prof_username', 255);
      table.timestamp('created_at').defaultTo(knex.fn.now());
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('point_history')
    .dropTableIfExists('teams');
};
