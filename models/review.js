var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var reviewSchema = new Schema({
    numberOfReviews: Number
});

module.exports = mongoose.model('Review', reviewSchema);