const Order = require('../model/orderModel');
const Product = require('../model/productModel');
const errors = require('../errors');
const {checkPermission} = require('../utils');
const { StatusCodes } = require('http-status-codes');

const fakeStripeApi = async ({amount, currency}) => {
    const client_secret = "someClientSecrete";
    return { client_secret, amount };
}

const createOrder = async (req, res) => {
    const { items:cartItems, tax, shippingFee } = req.body;
    if (!cartItems || cartItems.length < 1) {
        throw new errors.BadRequestError(
            "No cart items provided"
        );
    };
    if (!tax || !shippingFee) {
        throw new errors.BadRequestError(
            "Please provide tax and shipping fee"
        );
    };

    let orderItems = [];
    let subTotal = 0;

    for (const item of cartItems) {
        const dbProduct = await Product.findOne({_id: item.product});
        if (!dbProduct) {
            throw new errors.NotFoundError(
                "Product not found"
            );
        };
        const {name, price, image, _id} = dbProduct;
        const orderItem = {
            name,
            price,
            image,
            product:_id,
            amount: item.amount
        }

        orderItems.push(orderItem);
        subTotal += price * orderItem.amount;
    }

    const total = shippingFee + tax + subTotal;
    const paymentIntent = await fakeStripeApi({
        amount: total,
        currency: "usd"
    });

    const order = await Order.create({
        tax,
        shippingFee,
        subtotal:subTotal,
        total,
        orderItems,
        clientSecret: paymentIntent.client_secret,
        user: req.user.userID
    })
    res
        .status(StatusCodes.CREATED)
        .json({order, clientSecret: order.clientSecret});
};

const getAllOrders = async (req, res) => {
    const orders = await Order.find({})
    res.status(StatusCodes.OK).json({orders, count:orders.length});
};
const getSingleOrder = async (req, res) => {
    const order = await Order.findOne({_id:req.params.id});

    if (!order) {
        throw new errors.NotFoundError(
            "Order not found"
        );
    };

    checkPermission(req.user, order.user);

    res.status(StatusCodes.OK).json({order});
};
const getCurrentUserOrders = async (req, res) => {
    const orders = await Order.find({user:req.user.userID});
    res.status(StatusCodes.OK).json({orders, count:orders.length});
};
const updateOrder = async (req, res) => {
    const paymentIntent = "clinton is here"
    const order = await Order.findOne({_id:req.params.id});

    if (!order) {
        throw new errors.NotFoundError(
            "Order not found"
        );
    }; 

    checkPermission(req.user, order.user);
    order.paymentIntent = paymentIntent;
    order.status = 'paid';
    await order.save(); 
};


module.exports = {
    getAllOrders, 
    getSingleOrder, 
    getCurrentUserOrders,
    createOrder, 
    updateOrder
}