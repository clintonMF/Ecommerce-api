const { StatusCodes } = require('http-status-codes');


const errors = require('../errors');
const User = require('../model/userModel');
const {attachCookiesToResponse} = require('../utils');


const getAllUsers = async (req, res) => {
    const users = await User
                        .find({role: "user"})
                        .select('-password');
    res.status(StatusCodes.OK).json(users);
};

const getSingleUser = async (req, res) => {
    const user = await User
                    .findOne({_id: req.params.id })
                    .select('-password');
    if (!user) {
        throw new errors.NotFoundError(`user with id ${req.params.id} not found`)
    }
    res.status(StatusCodes.OK).json(user);
};

const showCurrentUser = (req, res) => {
    res.send("get current user");
};
const updateUser = (req, res) => {
    res.send("update user");
};
const updateUserPassword = (req, res) => {
    res.send("update user password");
};

module.exports = {
    getAllUsers,
    getSingleUser,
    showCurrentUser,
    updateUser,
    updateUserPassword
};