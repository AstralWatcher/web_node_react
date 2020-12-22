const mongoose = require('mongoose');

const leaders = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true,
    },
    designation: {
        type: String,
        required: true,
    },
    abbr: {
        type: String,
        required: true
    },
    featured: {
        type: Boolean,
        default: false
    },
    description: {
        type: String,
        required:true,
    }
}, {timestamps:true});

var Leaders = mongoose.model('Leaders',leaders)

module.exports = Leaders;