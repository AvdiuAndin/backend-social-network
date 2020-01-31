module.exports = {
    dev: {
        debug: true,
        client: 'pg',
        connection: {
            host     : '127.0.0.1',
            user     : 'postgres',
            password : 'postgres',
            database : 'poviodb',
            charset  : 'utf8'
        }
    },
    prod: {}
}
