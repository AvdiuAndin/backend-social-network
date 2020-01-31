const databaseConnectionConfig = require('./config');
const knex = require('knex')(databaseConnectionConfig.dev);
const bookshelf = require('bookshelf')(knex);

module.exports = bookshelf;
