const express = require('express');
const hbs = require('hbs');
const fs = require('fs');
const port = process.env.PORT || 3000;

var app = express(); //create a new expres

//configuration for express
hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');

//register static middleware
app.use(express.static(__dirname + '/public'));

//logger middleware
app.use((req, res, next) => {
    let now = new Date().toString();
    let log = `${now}: ${req.method} ${req.url}`;
    //logger in console
    console.log(log);

    //logger in file 
    fs.appendFile('server.log', log + '\n', (err) => {
        if (err) {
            console.log('Unable to append to server.log');
        }
    });
    next();
});

//maintanence middleware
app.use((req, res, next) => {
    res.render('maintenance');
    //no next 
});

//hbs helpers
hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear();
});
//helper with arguments
hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase();
});


//index get request
app.get('/', (req, res) => {
    //res.send('<h1>Hello Express!</h1>');
    res.render('home', {
        name: 'home page',
        message: 'Welcome to the shiny site',
    })
});

//new route
app.get('/about', (req, res) => {
    res.render('about.hbs', { name: 'About name' });
});

//bad route
app.get('/bad', (req, res) => {
    res.send({
        errorMessage: 'Unable to fulfill request'
    });
});

//app.disable('x-powered-by');

//bind our app to listen to port
//listens until you tell it to stop
app.listen(port, () => {
    console.log('app is listening on 3000');
});