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
        validate: {
            validator: validator.isEmail,
            message: props => `${props.value} is not a valid email`
        }
    },
    password: {
        type: String,
        required: [true, 'password is required'],
        minlength: 6
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: 'user'
    },
});


userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return 
    const salt = await bcrypt.genSaltSync(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.statics.emailExist = async function(email) {
    const user = await this.findOne({email});
    return !!user;
};

userSchema.methods.comparePassword = async function(password) {
    const isMatch = await bcrypt.compare(password, this.password); 
    return isMatch;
};

module.exports = mongoose.model('User', userSchema);