const express = require('express');
const router = express.Router();


const { 
    authenticateUser, 
    authorizePermission 
} = require('../middleware/authentication');
const { createProduct, 
    getAllProducts, 
    getSingleProduct, 
    updateProduct, 
    deleteProduct, 
    uploadImage 
} = require('../controllers/productController');

router
    .route('/')
    .get(getAllProducts)
    .post(authenticateUser, authorizePermission("admin"), createProduct);
    
router
    .route('/:id')
    .get(getSingleProduct)
    .patch(authenticateUser, authorizePermission("admin"), updateProduct)
    .delete(authenticateUser, authorizePermission("admin"), deleteProduct);

router
    .route('/uploadImage')
    .post(authenticateUser, authorizePermission("admin"),uploadImage);


module.exports = router;