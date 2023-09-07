const mongoose = require('mongoose');
var validator = require('validator'); 

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


userSchema.statics.emailExist = async function(email) {
    const user = await this.findOne({email})
    console.log(user, !!user)
    return !!user
}

module.exports = mongoose.model('User', userSchema);