const {validateJWT, attachCookiesToResponse } = require('./jwt');

const createTokenUser = (user) => {
    return {userID: user._id, email:user.email, name: user.name, role:user.role};
};

module.exports = {
    validateJWT,
    attachCookiesToResponse,
    createTokenUser
};