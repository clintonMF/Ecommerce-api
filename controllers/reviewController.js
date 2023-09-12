const StatusCodes = require('http-status-codes');

const Product = require('../model/productModel');
const errors = require('../errors');

const createReview = async (req, res) => {
    res.send("createReview");
};
const getAllReviews = async (req, res) => {
    res.send("createReview");
};
const getSingleReview = async (req, res) => {
    res.send("createReview");
};
const updateReview = async (req, res) => {
    res.send("createReview");
};
const deleteReview = async (req, res) => {
    res.send("createReview");
};

module.exports = {
    createReview, 
    getAllReviews, 
    getSingleReview, 
    updateReview, 
    deleteReview
};