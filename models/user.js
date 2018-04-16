var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var requestLoop = require('../app.js');

var userSchema = new Schema({
    email: String,
    password: String,
    apiKey: String,
    receiveNotifications: Boolean
});

userSchema.static.runScript = requestLoop;


module.export = mongoose.model('User', userSchema);