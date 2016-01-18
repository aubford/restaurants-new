require('dotenv').load()

module.exports = {

development: {
client: 'pg',
connection: 'postgres://localhost/restaurants-mig'
},

producton: {
client: 'pg',
connection: process.env.DATABASE_URL + '?ssl=true'
}

}
