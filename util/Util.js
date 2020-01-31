const bcrypt = require('bcryptjs');

const Util = {
    generatePassword: async (phrase) => {
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(phrase, salt);

        return hash;
    }
};
module.exports = Util;
