const express = require('express');
const router = express.Router();

const { authenticateUser, authorizePermission } = require('../middleware/authentication');
const { getAllUsers,
    getSingleUser,
    showCurrentUser,
    updateUser,
    updateUserPassword} = require('../controllers/userController');



router.route('/').get(authenticateUser, authorizePermission("admin"), getAllUsers);
router.route('/:id').get(authenticateUser, getSingleUser);

module.exports = router