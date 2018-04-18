const   request     = require('request'),
        mongoose    = require('mongoose'),
        User        = require('./models/user'),
        config      = require('./config.js'),
        client      = require('twilio')(config.accountSid, config.authToken);

// connect to database
mongoose.connect(`mongodb://${config.dbUser}:${config.dbPassword}@ds135800.mlab.com:35800/wanikani-review-notifier`);

var requestLoop = setInterval(function(){
    User.find((err, user) => {
        if(err) return console.error(err);
        user.forEach((user) => {
            if(user.receiveNotifications === true) {
                sendNotification(user.username, user.phoneNumber, user.apiKey, user.storedReview);
            }
        });
    });
}, 60000);


function sendNotification(username, phoneNumber, apiKey, storedReview) {
        request(`https://www.wanikani.com/api/user/${apiKey}/study-queue`, (err, res, body) => {
            var testStoredReview = storedReview;
            var parsedBody = JSON.parse(body);
            var WKusername = parsedBody.user_information.username;
            var nextReviewDate = parsedBody.requested_information.next_review_date; // comes back in seconds
            var numberOfReviews = parsedBody.requested_information.reviews_available;
            var now = Math.floor(Date.now() / 1000); // changes to seconds
            var timeUntilReview = nextReviewDate - now;
            if(err) {
                console.log(err);
            } else {
                console.log('=====');
                console.log('Your username:', WKusername);
                console.log('Minutes until review:', Math.floor(timeUntilReview / 60));
                
                // determining whether to send notification logic
                User.findOne({'username': username}, (err, user) => {
                    console.log(`stored reviews for ${WKusername}: ${storedReview}`);
                    console.log(`current # of reviews for ${WKusername}: ${numberOfReviews}`);
                    
                    if(err) return console.error(err); // error handling
                    if(timeUntilReview === null) {
                        console.log(`vacation mode is on for ${WKusername} - no notification`);
                    } else if(storedReview === undefined || storedReview >= numberOfReviews) {
                        console.log(`don't send notification to ${WKusername}`);
                    } else if(storedReview < numberOfReviews) {
                        console.log(`send notification to ${WKusername}`);
                        client.messages
                          .create({
                            to: `+1${phoneNumber}`,
                            from: config.twilioPhoneNumber,
                            body: `${WKusername}, you have ${numberOfReviews} reviews waiting for you in wanikani! http://www.wanikani.com`,
                          })
                          .then(message => console.log(`message sent to ${WKusername}`));
                    } else {
                        console.log(`notification error for ${username}`);
                    }
                    
                    User.findOneAndUpdate(
                        {username: username}, 
                        {$set:{storedReview: numberOfReviews}},
                        {returnNewDocument: true},
                        (err, updatedReview) => {
                        if(err) return console.error(err);
                        console.log(updatedReview)
                    });
                });
            }
        });
}

exports.module = requestLoop;