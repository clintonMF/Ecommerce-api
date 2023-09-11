const { StatusCodes } = require('http-status-codes');

const errors = require('../errors');
const User = require('../model/userModel');
const {checkPermission, createTokenUser} = require('../utils');

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
        throw new errors.NotFoundError(
            `user with id ${req.params.id} not found`);
    };
        
    checkPermission(req.user, user._id)
    res.status(StatusCodes.OK).json(user);
};

const showCurrentUser = (req, res) => {
    res.status(StatusCodes.OK).json({user:req.user});
};

const updateUser = async (req, res) => {
    const {email, name } = req.body 
    if (!email || !name) {
        throw new errors.BadRequestError(
                "please provide email and name"); 
    };
    /**
     * if findOneAndUpdate is used then we will not need to 
     * implement chnages to our pre(save) function in models
     */
    // const user = await User.findOneAndUpdate(
    //                 {_id: req.user.userID},
    //                 {email, name},
    //                 {new: true, runValidators: true}
    //             );
    
                    
    const user = await User.findOne({_id: req.user.userID});

    user.email = email;
    user.name = name;
    await user.save();

    const tokenUser = createTokenUser(user);
    attachCookiesToResponse({res, user: tokenUser});
    res.status(StatusCodes.OK).json({user: tokenUser});
};

const updateUserPassword = async (req, res) => {
    const user = await User.findOne({_id: req.user.userID});
    const {oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
        throw new errors.BadRequestError(
                "please provide old and new password");
    };
    
    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
        throw new errors.BadRequestError("password does not match");
    }
    
    user.password = newPassword;
    await user.save();
    res.status(StatusCodes.OK).json({msg:"success!! password updated"});
};

module.exports = {
    getAllUsers,
    getSingleUser,
    showCurrentUser,
    updateUser,
    updateUserPassword
};