const StatusCodes = require('http-status-codes');

const Product = require('../model/productModel');

const createProduct = async (req, res) => {
    req.body.user = req.user.userID;
    const product = await Product.create(req.body);
    res.status(StatusCodes.CREATED).json(product);
};
const getAllProducts = async(req, res) => {
    res.send('getAllProducts')
};
const getSingleProduct = async(req, res) => {
    res.send('getSingleProduct')
};
const updateProduct = async(req, res) => {
    res.send('updateProduct')
};
const deleteProduct = async(req, res) => {
    res.send('deleteProduct')
};
const uploadImage = async(req, res) => {
    res.send('uploadImage')
};

module.exports = {
    createProduct, 
    getAllProducts,
    getSingleProduct, 
    updateProduct, 
    deleteProduct, 
    uploadImage
};