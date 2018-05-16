const   express         = require('express'),
        app             = express(),
        passport        = require('passport'),
        mongoose        = require('mongoose'),
        bodyParser      = require('body-parser'),
        LocalStrategy   = require('passport-local'),
        methodOverride  = require('method-override'),
        request         = require('request'),
        config          = require('./config'),
        requestLoop     = require('./requestLoop'),
        isLoggedIn      = require('./middleware/isLoggedIn'),
        User            = require('./models/user'),
        port            = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({extended: true}));       
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public/'));
app.use(methodOverride("_method"));

// PASSPORT CONFIGURATION
app.use(require('express-session')({
    secret: ':)))))',
    resave: false,
    saveOnInitialize: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// make user a global variable

// MONGOOSE 
mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@ds135800.mlab.com:35800/wanikani-review-notifier`);

// ROUTES
app.get('/', (req, res) => {
    if(req.isAuthenticated()) {
        return res.redirect('/account');
    }
    res.render('home', {user: req.user});
});

app.get('/account', (req, res) => {
    // add middleware
    res.render('account', {user: req.user});
});

// AUTH ROUTES

//show register form
app.get('/register', (req, res) => {
    res.render('register', {user: req.user});
});

// handle sign up logic
app.post('/register', (req, res) => {
    var newUser = new User({username: req.body.username, apiKey: req.body.apiKey, phoneNumber: req.body.phoneNumber});
    // apiKey validation logic
    if(req.body.apiKey.match((/[a-z]|[0-9]{32}/))) { // if it's 32 digits long
        request(`https://www.wanikani.com/api/user/${req.body.apiKey}`, (err, response, body) => {
            if(err) return console.log(err);
            var parsedBody = JSON.parse(body);
            if(parsedBody.user_information) {
                console.log('valid api');
            } else {
                console.log('invalid api');
                // figure out error handling logic
            }
        });
    } else {
        console.log('should be 32 num/digits');
        // figure out error handling logic
    }
    
    // email validation logic - username should be an email
    if(req.body.username.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
        console.log('valid email');
    } else {
        console.log('invalid email');
        // figure out error handling logic
    }
    
    // phone number validation logic
    
    User.register(newUser, req.body.password, (err, user) => {
        if(err) {
            console.log(err);
            return res.render('register', {user: req.user});
        }
        passport.authenticate("local")(req, res, () => {
            console.log('user created ' + newUser.username);
            res.redirect('/');
        });
    });
});

// show login form
app.get('/login', (req, res) => {
    res.render('login', {user: req.user});
});

// handle login logic
app.post('/login', passport.authenticate('local', 
    {
        successRedirect: '/',
        failureRedirect: '/login',
    }), (req, res) => {
});

// logout route
app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

// ACCOUNT SETTINGS ROUTES
app.put('/account', (req, res) => {
    var receiveEmail;
    var receiveText;
    
    if(req.body.receiveText === 'on') { // toggle notification logic
        receiveEmail = true;
    } else {
        receiveEmail = false;
    }
    
    if(req.body.receiveEmail === 'on') {
        receiveText = true;
    } else {
        receiveText = false;
    }
    
    User.findOneAndUpdate(
        {username: req.user.username},
        {$set:
            {
                // username: req.body.username, --- if you change username, it logs you out
                apiKey: req.body.apiKey,
                phoneNumber: req.body.phoneNumber,
                receiveText: receiveText,
                receiveEmail: receiveEmail
            },
        }, {
            returnNewDocument: true
        },
        (err, updatedReview) => {
            if(err) return console.error(err);
            console.log(updatedReview);
        }
    ).then(res.redirect('/'));
});

// delete account
app.delete('/account', (req, res) => {
    User.findOneAndRemove(
        {username: req.user.username},
        (err, deletedUser) => {
            if(err) return console.error(err);
            console.log('Deleted:', deletedUser.username);
        }
    ).then(res.redirect('/'));
});

// FAQ page
app.get('/faq', (req, res) => {
    res.render('faq', {user: req.user});
});

app.listen(port, () => { // port set for heroku
    console.log('listening :)');
});