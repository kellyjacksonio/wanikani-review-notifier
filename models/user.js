var mongoose                = require('mongoose'),
    Schema                  = mongoose.Schema,
    passportLocalMongoose   = require('passport-local-mongoose'),
    requestLoop             = require('../requestLoop.js');

var userSchema = new Schema({
    username: { // which must be an email - figure out this logic
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password: {
        type: String,
        select: false
    },
    apiKey: {
        type: String,
        unique: true,
        required: true,
        trim: true,
    },
    phoneNumber: {
        type: Number,
        required: true,
        trim: true,
        // select: false - prevents from showing up in queries...but i think i want it to? 
    },
    receiveNotifications: {
        type: Boolean,
        default: true
    },
    storedReview: {
        type: Number,
        default: 0
    }
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);