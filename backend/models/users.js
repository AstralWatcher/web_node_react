const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

var user = new mongoose.Schema({
    firstName: {
        type: String,
        default: ''
    },
    lastName: {
        type: String,
        default: ''
    },
    admin: {
        type:Boolean,
        default:false
    }
}, 
{timestamps:true}
)
user.plugin(passportLocalMongoose);

var Users = mongoose.model('User', user);

module.exports = Users