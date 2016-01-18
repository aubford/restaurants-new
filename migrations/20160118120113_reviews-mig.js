
exports.up = function(knex, Promise) {
  return knex.schema.createTable('reviews',function(table){
    table.increments()
    table.string('name')
    table.integer('rating')
    table.string('review')
    table.string('date')
    table.integer('rest_id')
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('reviews')
};
