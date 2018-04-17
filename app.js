const   express         = require('express'),
        app             = express(),
        passport        = require('passport'),
        mongoose        = require('mongoose'),
        bodyParser      = require('body-parser'),
        LocalStrategy   = require('passport-local'),
        config          = require('./config'),
        requestLoop     = require('./requestLoop'),
        User            = require('./models/user'),
        port            = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({extended: true}));       
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public/'));

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

// MONGOOSE 
mongoose.connect(`mongodb://${config.dbUser}:${config.dbPassword}@ds135800.mlab.com:35800/wanikani-review-notifier`);

// ROUTES
app.get('/', (req, res) => {
    var user = req.user;
    res.render('home', {user: user});
});

// AUTH ROUTES

//show register form
app.get('/register', (req, res) => {
    res.render('register');
});

// handle sign up logic
app.post('/register', (req, res) => {
    var newUser = new User({username: req.body.username, apiKey: req.body.apiKey, phoneNumber: req.body.phoneNumber});
    User.register(newUser, req.body.password, (err, user) => {
        if(err) {
            console.log(err);
            return res.render('register');
        }
        passport.authenticate("local")(req, res, () => {
            console.log('user created ' + newUser.username);
            res.redirect('/');
        });
    });
});

// show login form
app.get('/login', (req, res) => {
    res.render('login');
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

// MIDDLEWARE
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

app.listen(port, () => { // port set for heroku
    console.log('listening :)');
});