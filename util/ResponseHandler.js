const HTTP_CODES = require("http-status-codes");
module.exports = {
    badRequest: function(response, message){
        return response.status(HTTP_CODES.BAD_REQUEST).json({ error: true, message});
    },
    ok: function(response, data){
        return response.json({ error: false, data});
    },
    notFound: function(response, message){
        return response.status(HTTP_CODES.NOT_FOUND).json({
            error: true,
            message
        });
    }
}