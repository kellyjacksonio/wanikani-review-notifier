var express = require('express');
var app = express();
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.send('this is the home page');
});

app.listen(process.env.PORT, process.env.IP, () => { // port set for c9.io
    console.log('listening :)');
});
