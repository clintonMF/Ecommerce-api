const StatusCodes = require('http-status-codes');

const Review = require('../model/reviewModel');
const Product = require('../model/productModel');
const errors = require('../errors');
const {checkPermission} = require('../utils');


const createReview = async (req, res) => {
    const product = await Product.findOne({ _id: req.body.product });
    if (!product) {
        throw new errors.NotFoundError(
            "Product with id ${productID} does not exist");
    };

    req.body.user = req.user.userID;
    const review = await Review.create(req.body);
    res.status(StatusCodes.CREATED).json(review);
};

const getAllReviews = async (req, res) => {
    const reviews = await Review.find({}).populate({
        path: 'product',
        select: 'name price company'
    });
    res.status(StatusCodes.OK)
        .json({ reviews, count: reviews.length });
};

const getSingleReview = async (req, res) => {
    const review = await Review.findOne({ _id: req.params.id })
        .populate({
            path: 'product',
            select: 'name price company'
        });
    if (!review) {
        throw new CustomError.NotFoundError(
            `No review with id ${req.params.id}`);
    };
    res.status(StatusCodes.OK).json({review});  
};

const updateReview = async (req, res) => {
    const review = await Review.findOne({ _id: req.params.id });
    if (!review) {
        throw new CustomError.NotFoundError(
            `No review with id ${req.params.id}`);
    };

    const { title, rating, comment } = req.body;
    
    review.title = title;
    review.rating = rating;
    review.rating = rating;
    
    await review.save();
    res.status(StatusCodes.OK).json({review});
};

const deleteReview = async (req, res) => {
    const review = await Review.findOne({ _id: req.params.id });
    if (!review) {
        throw new CustomError.NotFoundError(
            `No review with id ${req.params.id}`);
    };

    checkPermission(req.user, review.user);
    await review.remove();
    res.status(StatusCodes.OK).json({msg: "successfully deleted"});
};

const getSingleProductReviews = async (req, res) => {
    const reviews = await Review.find({ product: req.params.id });
    console.log(reviews.length);
    res.status(StatusCodes.OK).json({reviews, count: reviews.length});
}

module.exports = {
    createReview, 
    getAllReviews, 
    getSingleReview, 
    updateReview, 
    deleteReview,
    getSingleProductReviews
};