
exports.up = function(knex, Promise) {
  return knex.schema.createTable('employees', function(table){
    table.increments()
    table.integer('rest_id')
    table.string('first_name')
    table.string('last_name')
    table.string('position')
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('employees')
};
