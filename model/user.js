const mongoose = require('mongoose');
var validator = require('validator'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'name is required'],
        minlength: 2,
    },
    email: {
        type: String,
        required: [true, 'email is required'],
        unique: true,
        // validate: {
        //     validator: validator.isEmail(),
        //     message: props => `${props.value} is not a valid email`
        // }
    },
    password: {
        type: String,
        required: [true, 'password is required'],
        minlength: 6
    },
});


userSchema.pre('save', async function(next) {
    const salt = bcrypt.genSaltSync(10);
    this.password = bcrypt.hashSync(this.password, salt);
    next();
});

userSchema.statics.emailExist = async function(email) {
    const user = await this.findOne({email});
    return !!user;
};

userSchema.methods.comparePassword = async function(password) {
    return bcrypt.compareSync(password, this.password); 
};


module.exports = mongoose.model('User', userSchema);