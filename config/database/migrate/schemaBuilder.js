const bookshelf = require("../Bookshelf");
const knex = bookshelf.knex;
const pubilcSchema = knex.schema.withSchema("public");

module.exports = {
    createTables: async () => {
        tableExistsBool = await pubilcSchema.hasTable("users");
        if (!tableExistsBool) {
          await knex.schema.createTable("users", function (table) {
            table.increments("id").primary();
            table.string("username").unique();
            table.string("password");
          });
          await knex.schema.createTable("user_likes", function (table) {
            table.increments("id").primary();
            table.integer("user_id");
            table.integer("liked_user_id");
          });
        }
    }
};
