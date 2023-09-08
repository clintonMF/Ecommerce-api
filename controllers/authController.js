const User = require('../model/userModel');
const errors = require('../errors');
const validator = require('validator'); 

const register = async (req, res) => {
    const {name, email, password } = req.body;
    if (!name || !email || !password ) {
        throw new errors.BadRequestError("name, password and email are all required");
    };
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

    res.send("login user");
};
const logout = async (req, res) => {
    res.send("logout user");
};

module.exports = {register, login, logout};
