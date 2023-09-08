const jwt = require('jsonwebtoken');


const createJWT = ({payload}) => {
    const token = jwt.sign(
        {payload}, 
        process.env.JWT_SECRET,
        {expiresIn: process.env.JWT_LIFETIME} 
        );

    return token;
}
const validateJWT = (token) => {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded
}

const attachCookiesToResponse = ({res, user}) => {
    const token = createJWT({payload: user})
    res.cookie('token', token, {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        httpOnly: true
    })
} 

module.exports = {
    validateJWT,
    attachCookiesToResponse,
}
