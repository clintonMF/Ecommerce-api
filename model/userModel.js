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
    const salt = await bcrypt.genSaltSync(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.statics.emailExist = async function(email) {
    const user = await this.findOne({email});
    return !!user;
};

userSchema.methods.comparePassword = async function(password) {
    const v = await bcrypt.compare(password, this.password); 
    return v
};

userSchema.methods.generateToken = async function() {
    const token = jwt.sign(
        {userID: this._id, name: this.name}, 
        process.env.JWT_SECRET,
        {expiresIn: process.env.JWT_LIFETIME} 
        );

    return token;
}

module.exports = mongoose.model('User', userSchema);