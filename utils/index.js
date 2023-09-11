const { request } = require('express');
const {validateJWT, attachCookiesToResponse } = require('./jwt');

const errors = require('../errors');
const createTokenUser = (user) => {
    return {userID: user._id, email:user.email, name: user.name, role:user.role};
};

const checkPermission = (requestUser, resourceUserID) => {
    if (requestUser.role === "admin") return;
    if (requestUser.userID === resourceUserID.toString()) return;
    throw new errors.UnauthorizedError(
        "You are not authorized to access this route"
    )
}

module.exports = {
    validateJWT,
    attachCookiesToResponse,
    createTokenUser,
    checkPermission
};