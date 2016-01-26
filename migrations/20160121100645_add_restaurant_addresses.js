
exports.up = function(knex, Promise) {
  return knex.schema.table('rests',function(t){
    t.string('street1')
    t.string('street2')
    t.integer('zip')
    t.integer('neighborhood_id')
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.table('rests', function(t){
    t.dropColumn('street1')
    t.dropColumn('street2')
    t.dropColumn('zip')
    t.dropColumn('neighborhood_id')
  })
};
