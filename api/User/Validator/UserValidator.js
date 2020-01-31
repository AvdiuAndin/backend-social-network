const Joi = require("joi");

UserValidator = {
    userCreateValidator: (body) => {
        const schema = Joi.object().keys({
            password: Joi.string().required().min(6),
            username: Joi.string().required().min(3)
        });
        return Joi.validate(body, schema);
    },
    updatePasswordValidator: (body) => {
        const schema = Joi.object().keys({
            oldPassword: Joi.string().required().min(6),
            newPassword: Joi.string().required().min(6)
        });
        return Joi.validate(body, schema);
    }
};

module.exports = UserValidator
