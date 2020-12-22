const mongoose = require('mongoose')

require('mongoose-currency').loadType(mongoose);

const Currency = mongoose.Types.Currency;

const promotions = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    label: {
        type: String,
        default: ''
    },
    price: {
        type: Currency,
        required: true
    },
    featured:{
        type:Boolean,
        default: false
    },
    description:{
        type: String,
        required: true
    }
}, {timestamps:true});

var Promotions = mongoose.model('Promotions',promotions);

module.exports = Promotions;