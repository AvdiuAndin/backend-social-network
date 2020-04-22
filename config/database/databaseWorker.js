const schemaBuilder = require('./migrate/schemaBuilder');
module.exports = {
    runDatabaseTasks: function(){
        schemaBuilder.createTables();
    }
};