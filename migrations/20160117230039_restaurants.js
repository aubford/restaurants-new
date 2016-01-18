exports.up = function(knex, Promise){
     return knex.schema.createTable('rests', function(table){
          table.increments()
          table.text('name')
          table.text('location')
          table.text('state')
          table.text('cuisine')
          table.integer('rating')
          table.text('image')
          table.text('bio')
})

exports.down = function(knex, Promise){
     return knex.schema.dropTable('rests')
}
