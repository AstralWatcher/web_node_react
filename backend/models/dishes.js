const mongoose = require('mongoose');

require('mongoose-currency').loadType(mongoose);

const Currency = mongoose.Types.Currency;

const Schema = mongoose.Schema;


const dishSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        required:true,
    },
    category: {
        type: String,
        required: true
    },
    label: {
        type: String,
        default: false,
    },
    price: {
        type: Currency,
        required:true,
        min:0,
    },
    featured:{
        type: Boolean,
        default: false,
    },
    description: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

var Dishes = mongoose.model('Dish', dishSchema);

module.exports = Dishes;
