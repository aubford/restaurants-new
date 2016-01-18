require('dotenv').load()

module.exports = {
development: {
client: pg,
connection: 'localDBLocation'
},

producton: {
client:pg,
connection: process.env.DATABASE_URL + ‘?ssl=true'
}
