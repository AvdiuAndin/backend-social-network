const databaseConnectionConfig = require('./config');
const knex = require('knex')(databaseConnectionConfig);
const bookshelf = require('bookshelf')(knex);

module.exports = bookshelf;
