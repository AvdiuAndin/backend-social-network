const jwtService = require('../../api/Jwt/Service/JwtService');
const HTTP_CODES = require('http-status-codes');
const UserService = require('../../api/User/Service/UserService')

module.exports = {
    authenticateRequest: async (req, res, next) => {
        if(req.headers.authorization != undefined){
            let token = jwtService.readTokenFromHeader(req.headers.authorization);
            console.log(token);
            let decodedToken = jwtService.decodeToken(token);
            if(!decodedToken){
                return res.status(HTTP_CODES.FORBIDDEN).json({
                    error: true,
                    message: "Token is not verified"
                });
            }

            // check if the user exists
            let fetchedUser = await UserService.readById(decodedToken.id);
            if(fetchedUser == null){
                return res.status(HTTP_CODES.NOT_FOUND).json({ error: true, message: `User with id ${res.user.id} does not exists`});
            }
            // set user to request so it can be used in the controller
            req.user = fetchedUser;

            next();
        } else {
            return res.status(HTTP_CODES.UNAUTHORIZED).json({
                error: true,
                message: "Authorization token is required"
            });
        }

    }
};
