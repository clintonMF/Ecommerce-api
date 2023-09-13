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
        min: 1,
        max: 5,
    },
    comment: { 
        type: String, 
        // required: [true, 'comment is required'],
        required: false,
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

reviewSchema.statics.calculateAverageRating = async (productID) => {
    console.log(productID)
};

reviewSchema.post('save', async function(){
    await this.constructor.calculateAverageRating(this.product)
});

reviewSchema.post('remove', async function(){
    await this.constructor.calculateAverageRating(this.product)
});

module.exports =  mongoose.model('Review', reviewSchema);
