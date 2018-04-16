const   express     = require('express'),
        app         = express(),
        requestLoop = require('./app.js'),
        User        = require('./models/User.js'),
        port        = process.env.PORT || 8080;
        
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', (req, res) => {
    var newUser = new User({email: req.body.email, apiKey: req.body.apiKey});
    User.register(newUser, req.body.password, (err, user) => {
        if(err) {
            console.log(err);
        } else {
            res.redirect('/');
        }
    });
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', (req, res) => {
    //
});

app.listen(port, () => { // port set for heroku
    console.log('listening :)');
});