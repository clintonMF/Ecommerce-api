const jwt = require('jsonwebtoken');

const validateJWT = (token) => {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded
}