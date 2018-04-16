var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var requestLoop = require('../app.js');

var userSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    apiKey: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    receiveNotifications: {
        type: Boolean,
        default: true,
        required: true
    }
});

userSchema.static.runScript = requestLoop;

module.export = mongoose.model('User', userSchema);