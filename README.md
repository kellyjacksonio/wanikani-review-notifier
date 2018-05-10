# WaniKani Review Notifier

RESTful web application that multiple users can use to have either SMS text or email notifications sent when they have new words to review in WaniKani (a spaced repetition Japanese learning web app), as well as the option for users to update settings or delete account. Built with Node.js, Express, EJS, MongoDB, Passport, Amazon SWS, Twilio, and Semantic UI.

## Live Example

Right now, the application is only completely functional for me, as both Twilio and Amazon SES are paid services. However, users can still register, login, change account settings, and delete accounts. Future plans to release application to the public are underway.

[WaniKani Review Notifier](http://wanikani-review-notifier.herokuapp.com)

## Reflection

I recently picked up learning Japanese again and found the website [WaniKani](http://wanikani.com). Learning of user scripts and other user-built sites using the WaniKani public API key given to each other, I became inspired to write my own. The SRS system works by spacing out when the kanji/words exercises are available to you (aka reviews). Initially, I got it functional for just me, but then expanded it to other users. Right now, the only reason that other users cannot use it is that Twilio and Amazon SES are paid services that I have not dedicated any funds. There are still a few kinks that need to be worked out, including middleware and some registration validation logic. 