var jwt = require('jsonwebtoken');
// Usually this is set via environment variable
let secretKey = process.env.SECRET || 'deathIsALie';

JwtService = {
    generateToken: (data) => {
        return jwt.sign(data, secretKey, { expiresIn: 60 * 60 * 24 * 2 })
    },
    decodeToken: (jwtToken) => {
        try {
            return jwt.verify(jwtToken, secretKey);
        } catch(err) {
            return null;
        }
    },
    readTokenFromHeader: (authorizationTokenString) => {
        try {
            return authorizationTokenString.split('Bearer ')[1];
        } catch {
            return '';
        }
    }
};
module.exports = JwtService;
