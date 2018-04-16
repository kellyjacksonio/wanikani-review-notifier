var request     = require('request'),
    mongoose    = require('mongoose'),
    Review      = require('./models/review'),
    config      = require('./config.js');

// database - mongodb://<dbuser>:<dbpassword>@ds135800.mlab.com:35800/wanikani-review-notifier
// my API - https://www.wanikani.com/api/user/dafbfe09d39c7662e5274524b0c05604/study-queue
// geena's API - https://www.wanikani.com/api/user/3dbf079d24812d364c5f2390ce9db4ca/study-queue
// If on vacation mode, next_review_date === NULL

mongoose.connect(`mongodb://${config.dbUser}:${config.dbPassword}@ds135800.mlab.com:35800/wanikani-review-notifier`);

var requestLoop = setInterval(function(){
    request('https://www.wanikani.com/api/user/dafbfe09d39c7662e5274524b0c05604/study-queue', (err, res, body) => {
        var parsedBody = JSON.parse(body);
        var username = parsedBody.user_information.username;
        var nextReviewDate = parsedBody.requested_information.next_review_date; // comes back in seconds
        var numberOfReviews = parsedBody.requested_information.reviews_available;
        var now = Math.floor(Date.now() / 1000); // changes to seconds
        var timeUntilReview = nextReviewDate - now;
        if(err) {
            console.log(err);
        } else {
            //console.log('Your username:', username);
            //console.log('Next review date:', nextReviewDate);
            //console.log('Now:', now);
            console.log('Minutes until review:', timeUntilReview / 60); // if negative then a review is ready
            // console.log('Number of reviews:', numberOfReviews);
            
            // determining whether to send notification logic
            Review.find(function(err, dbReview) {
                var storedReview = dbReview[0].numberOfReviews;
                console.log('Stored review:', storedReview);
                console.log('Current # of reviews', numberOfReviews);
                if(err) return console.error(err); // error handling
                if(storedReview === undefined || storedReview >= numberOfReviews) {
                    console.log('dont send notification');
                } else if(storedReview < numberOfReviews) {
                    console.log('send notification');
                    console.log(`you have ${numberOfReviews} number of reviews waiting for you!`);
                } else {
                    console.log('wtf happened');
                }
                
                Review.remove({}, function(err) {
                    if(err) {
                        console.error(err);
                    } else {
                        console.log('cleared db');
                    }
                }); 
                var review = new Review({numberOfReviews: numberOfReviews, now: now}); // create review object
                review.save(function (err, storedReview) { // store numberOfReviews to review object
                    if(err) return console.error(err);
                    console.log('New stored review', storedReview);                    
                });
            });
        }
    });
}, 10000);

// if current amount > last amount && timeUntilReview === 0
// database only has to store the last amount and compare that amount to the current amount
