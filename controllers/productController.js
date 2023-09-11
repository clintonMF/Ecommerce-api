const StatusCodes = require('http-status-codes');

const Product = require('../model/productModel');
const errors = require('../errors');

const createProduct = async (req, res) => {
    req.body.user = req.user.userID;
    console.log(req.body.user);
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
        throw new errors.NotFoundError(`No product with id ${req.params.id}`);
    };
    res.status(StatusCodes.OK).json({product});
};

const updateProduct = async(req, res) => {
    const product = await Product.findOneAndUpdate(
        {_id: req.params.id}, 
        req.body, 
        {new: true, runValidators: true}
    );
    if (!product) {
        throw new errors.NotFoundError(`No product with id ${req.params.id}`);
    };
    res.status(StatusCodes.OK).json({product});
};
const deleteProduct = async(req, res) => {
    const product = await Product.findOneAndDelete({_id: req.params.id});
    if (!product) {
        throw new errors.NotFoundError(`No product with id ${req.params.id}`);
    };
    res.status(StatusCodes.OK).json({product});
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