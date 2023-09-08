const { StatusCodes } = require('http-status-codes');


const errors = require('../errors');
const User = require('../model/userModel');
const {attachCookiesToResponse} = require('../utils');


const register = async (req, res) => {
    const {name, email, password } = req.body;
    if (!name || !email || !password ) {
        throw new errors.BadRequestError("name, password and email are all required");
    };
    const emailExist = await User.emailExist(email);
    const isFirstUser = await User.countDocuments({}) === 0;

    const role = isFirstUser ? "admin": "user";
    if (emailExist) {
        throw new errors.BadRequestError(
            `user with email ${email} already exist`
        );
    };
    const user = await User.create({name, email, password, role});
    const tokenUser = {userID: user._id, name, email, role};
    attachCookiesToResponse({res, user: tokenUser});
    res.status(StatusCodes.CREATED).json({user: tokenUser});
};

const login = async (req, res) => {
    const {email, password } = req.body;
    if (!email || !password ) {
        throw new errors.BadRequestError("name, password and email are all required");
    };

    const user = await User.findOne({email});
    if (!user) {
        throw new errors.NotFoundError("No user with this email")
    }
    const compPass = await user.comparePassword(password)
    if (!compPass) {
        throw new errors.UnauthenticatedError("wrong password")
    } 

    const tokenUser = {userID: user._id, name, email, role};
    attachCookiesToResponse({res, user: tokenUser});
    res.status(StatusCodes.OK).json({user: tokenUser});
};

const logout = async (req, res) => {
    res.cookie('token', 'logout', {
        expires: new Date(Date.now() + 60 * 1000 * 5),
        httpOnly: true
    });

    res.status(StatusCodes.OK).json({msg: "successfully logged out"})
};

module.exports = {register, login, logout};
