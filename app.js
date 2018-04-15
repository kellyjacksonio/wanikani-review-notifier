var request = require('request');

// my API - https://www.wanikani.com/api/user/dafbfe09d39c7662e5274524b0c05604/study-queue
// geena's API - https://www.wanikani.com/api/user/3dbf079d24812d364c5f2390ce9db4ca/study-queue
// If on vacation mode, next_review_date === NULL
// If you do a review, next_review_date updates to now making timeUntilReview === 0. Notifications should only be sent when timeUntilReview > 0.

var requestLoop = setInterval(function(){
    request('https://www.wanikani.com/api/user/dafbfe09d39c7662e5274524b0c05604/study-queue', (err, res, body) => {
        var parsedBody = JSON.parse(body);
        var username = parsedBody.user_information.username;
        var nextReviewDate = parsedBody.requested_information.next_review_date; // comes back in seconds
        var numberOfReviews = parsedBody.requested_information.reviews_available;
        var now = Math.floor(Date.now() / 1000); // changes to seconds
        var timeUntilReview = nextReviewDate - now;
        var notify = false;
        if(err) {
            console.log(err);
        } else {
            console.log('Your username:', username);
            console.log('Next review date:', nextReviewDate);
            console.log('Now:', now);
            console.log('Minutes until review:', timeUntilReview / 60); // if negative then a review is ready
            console.log('Number of reviews:', numberOfReviews);
            if(numberOfReviews > 0 && timeUntilReview === 0) {
                notify = true;
            } else if (timeUntilReview > 0) {
                notify = false;
            }
            if(notify === true) {
                console.log('send notification');
                // send notification
                notify = false;
            }
        }
    });
}, 10000);

// if current amount > last amount && timeUntilReview === 0
// database only has to store the last amount and compare that amount to the current amount
