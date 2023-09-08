
const getAllUsers = (req, res) => {
    res.send("get all user");
};
const getSingleUser = (req, res) => {
    res.send("get single user");
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