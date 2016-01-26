exports.up = function(knex, Promise) {
  return knex.schema.createTable('neighborhoods',function(t){
    t.increments()
    t.string('name')
    t.float('lat')
    t.float('lng')
    t.string('address')
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('neighborhoods')
};
