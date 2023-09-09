const errors = require('../errors');
const {validateJWT} = require('../utils');

const authenticateUser = async (req, res, next) => {
    const token = req.signedCookies.token;

    if (!token) {
        throw new errors.UnauthenticatedError("Invalid token");
    };
    
    try {
        const { userID, name, role } = validateJWT(token).payload;
        req.user = { userID, name, role };
        next();
    } catch (error) {
        throw new errors.UnauthenticatedError("Invalid token");
    }

};

const authorizePermission = ( ...roles ) => {
    return (req, res, next ) => {
        if (!roles.includes(req.user.role)) {
            throw new errors.UnauthorizedError(
                "You are not authorized to perform this action");
        };
        console.log("you have permission");
        next();
    }
}

module.exports = { 
    authenticateUser,
    authorizePermission
};