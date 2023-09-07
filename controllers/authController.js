const User = require('../model/user');
const errors = require('../errors');
const validator = require('validator'); 

const register = async (req, res) => {
    const {name, email, passowrd } = req.body;
    const emailExist = await User.emailExist(email)

    if (!validator.isEmail(email)) {
        throw new errors.BadRequestError(
            `${email} is not a valid email`
        );
    };
    if (emailExist) {
        throw new errors.BadRequestError(
            `user with email ${email} already exist`
        );
    };
    const user = await User.create(req.body);
    res.json({user})
};

const login = async (req, res) => {
    res.send("login user");
};
const logout = async (req, res) => {
    res.send("logout user");
};

module.exports = {register, login, logout};
