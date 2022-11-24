const db = require('knex')({
  client: 'postgresql',
  connection: {
    user : process.env.PGUSERNAME,
    password : process.env.PGPASSWORD,
    database : process.env.PGDATABASE
  }
});

module.exports = db;