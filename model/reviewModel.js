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

reviewSchema.statics.calculateAverageRating = async function(productID) {
    const result = await this.aggregate([
        { $match: { product: productID } },
        {
          $group: {
            _id: null,
            averageRating: { $avg: '$rating' },
            numOfReviews: { $sum: 1 },
          },
        },
    ]);
    
    try {
        await this.model('Product').findOneAndUpdate(
            {_id: productID},
            {
                averageRating: Math.ceil(result[0]?.averageRating || 0),
                numOfReviews: result[0]?.numOfReviews || 0,
            }
        );
    } catch (error) {
        console.log(error);
    }
};

reviewSchema.post('save', async function(){
    await this.constructor.calculateAverageRating(this.product);
});

reviewSchema.post('remove', async function(){
    await this.constructor.calculateAverageRating(this.product);
});

module.exports =  mongoose.model('Review', reviewSchema);
