const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    title: { 
        type: String, 
        trim: true,
        required: [true, 'review title is required'],
        maxLength: [100, 'title cannot have more than 100 characters']
    },
    rating: { 
        type: Number, 
        required: [true, 'rating is required'],
        default: 0,
    },
    comment: { 
        type: String, 
        // required: [true, 'comment is required'],
        required: false,
        maxLength: 
            [1000, 'review comment cannot have more than 1000 characters']
    },
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    }, 
    product: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product',
        required: true
    }, 
}, { 
    timestamps: true, 
    toJSON: { virtuals: true }, 
    toObject: { virtuals: true }
});

module.exports =  mongoose.model('Review', reviewSchema);
