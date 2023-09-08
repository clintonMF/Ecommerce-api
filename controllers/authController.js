const User = require('../model/userModel');
const errors = require('../errors');
const validator = require('validator');
const {attachCookiesToResponse} = require('../utils')

const register = async (req, res) => {
    const {name, email, password } = req.body;
    if (!name || !email || !password ) {
        throw new errors.BadRequestError("name, password and email are all required");
    };
    const emailExist = await User.emailExist(email);
    const isFirstUser = await User.countDocuments({}) === 0;

    const role = isFirstUser ? "admin": "user";
    // if (!validator.isEmail(email)) {
    //     throw new errors.BadRequestError(
    //         `${email} is not a valid email`
    //     );
    // };
    if (emailExist) {
        throw new errors.BadRequestError(
            `user with email ${email} already exist`
        );
    };
    const user = await User.create({name, email, password, role});
    attachCookiesToResponse({res, user});
    res.json({user})
};

const login = async (req, res) => {
    const {email, password } = req.body;
    if (!email || !password ) {
        throw new errors.BadRequestError("name, password and email are all required");
    };

    const user = await User.findOne({email});
    if (!user) {
        throw errors.NotFoundError("No user with this email")
    }
    const compPass = await user.comparePassword(password)
    if (!compPass) {
        throw errors.UnauthenticatedError("wrong password")
    } 

    attachCookiesToResponse({res, user});
    res.json({user});
};
const logout = async (req, res) => {
    res.cookie('token', 'logout', {
        expires: new Date(Date.now() + 60 * 1000 * 5),
        httpOnly: true
    });

    res.status(200).json({msg: "successfully logged out"})
};

module.exports = {register, login, logout};
