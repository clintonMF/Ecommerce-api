const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { 
        type: String, 
        trim: true,
        required: [true, 'Product name is required'],
        maxLength: [100, 'name cannot have more than 100 characters']
    },
    price: { 
        type: Number, 
        required: [true, 'Product price is required'],
        default: 0,
    },
    description: { 
        type: String, 
        required: [true, 'Product description is required'],
        maxLength: [100, 'product description cannot have more than 100 characters']
    },
    image: {
        type: String,
        default: '/uploads/example.jpeg',
    },
    category: { 
        type: String, 
        required: [true, 'Product category is required'],
        enum: ['office', 'kitchen', 'bedroom'],
    },
    company: { 
        type: String, 
        required: [true, 'Product company is required'],
        enum: {
            values: ['ikea', 'liddy', 'marcos'],
            message: `${value} not supported`
        }
    },
    colors: {
        type: [String],
        default: '#222',
        required: true,
    },
    featured: { 
        type: Boolean, 
        default: false 
    },
    freeShipping: { 
        type: Boolean, 
        default: false 
    },
    inventory: { 
        type: Number, 
        required: [true, 'Product inventory is required'] 
    },
    averageRating: { 
        type: Number,
        default: 0
    },
    numOfReviews: { 
        type: Number,
        default: 0
    },
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    }, 
}, { 
    timestamps: true, 
    toJSON: { virtuals: true }, 
    toObject: { virtuals: true }
});


module.exports =  mongoose.model('Product', productSchema);
