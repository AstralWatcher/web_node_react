const { ObjectID } = require('mongodb');
const mongoose = require('mongoose')

const favorite = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true
    },
    dishes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Dish'
        }
    ]
}, { timestamps: true });

var Favorite = mongoose.model('Favorite', favorite);

module.exports = Favorite;