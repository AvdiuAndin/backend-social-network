let config = {
    dev: {
        client: 'pg',
        connection: {
            host     : '127.0.0.1',
            user     : 'postgres',
            password : 'postgres',
            database : 'dbname',
            charset  : 'utf8'
        }
    },
    test:{
        client: 'pg',
        connection: {
            host     : '127.0.0.1',
            user     : 'postgres',
            password : 'postgres',
            database : 'testing_dbname',
            charset  : 'utf8'
        }
    },
    prod: {
        client: 'pg',
        connection: {
            host     : '127.0.0.1',
            user     : 'postgres',
            password : 'postgres',
            database : 'dbname',
            charset  : 'utf8'
        }
    }
}

module.exports = config[process.env.NODE_ENV || 'dev'];