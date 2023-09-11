const StatusCodes = require('http-status-codes');

const Product = require('../model/productModel');
const errors = require('../errors');

const createProduct = async (req, res) => {
    req.body.user = req.user.userID;
    const product = await Product.create(req.body);
    res.status(StatusCodes.CREATED).json(product);
};
const getAllProducts = async(req, res) => {
    const products = await Product.find({});
    res.status(StatusCodes.OK).json({products});
};
const getSingleProduct = async(req, res) => {
    const product = await Product.findOne({_id: req.params.id});
    if (!product) {
        throw new errors.NotFoundError(`product with id ${req.params.id}`);
    };
    res.status(StatusCodes.OK).json({product});
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