const   express = require('express'),
        app     = express(),
        requestLoop = require('./app.js'),
        port = process.env.PORT || 8080;
        
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('home');
});

app.listen(port, () => { // port set for heroku
    console.log('listening :)');
});