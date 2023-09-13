const StatusCodes = require('http-status-codes');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

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
    const product = await Product.findOne({_id: req.params.id}).populate('reviews');
    if (!product) {
        throw new errors.NotFoundError(
            `No product with id ${req.params.id}`);
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
    const product = await Product.findOne({_id: req.params.id});
    if (!product) {
        throw new errors.NotFoundError(`No product with id ${req.params.id}`);
    };
    await product.remove();
    res.status(StatusCodes.OK).json({msg:"success, product deleted"});
};

const uploadImage = async(req, res) => {
    const productImage = req.files.image
    if (!productImage) {
        throw new cusErr.BadRequestError("Image is required");
    };

    if (!productImage.mimetype.startsWith('image')) {
        throw new cusErr.BadRequestError(`File type ${productImage.mimetype} not supported`);
    };

    const size = 1024 * 1024
    if (size < productImage.size) {
        throw new cusErr.BadRequestError(`File size should not be greater than ${size}`);
    };

    const result = await cloudinary.uploader.upload(
        productImage.tempFilePath,
        { use_filename: true, folder:'file-uploads'}
    );

    await fs.unlinkSync(productImage.tempFilePath);

    res.status(StatusCodes.OK)
        .json({ image: `${result.secure_url}` });
};

module.exports = {
    createProduct, 
    getAllProducts,
    getSingleProduct, 
    updateProduct, 
    deleteProduct, 
    uploadImage
};