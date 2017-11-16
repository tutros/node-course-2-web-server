const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const port = process.env.PORT || 3000;

var app = express();

// - set up handlebar partials middleware (binding)
hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');

// - set up logger middleware
app.use((req, res, next) => {
    var now = new Date().toString();
    var log = `${now}: ${req.method} ${req.url}`

    console.log(log);
    fs.appendFile('server.log', log + '\n', (err) => {
        if (err) {
            console.log('Unable to append to server.log');
        }
    });
    next();
});

// - set up maintainence page middleware -- will display instead of any other page
// app.use((req, res, next) => {
//     res.render('maintenance.hbs');
//});

// - define static file location middleware
app.use(express.static(__dirname + '/public'));

// handlebar helper pages (templates)
hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear();
});
hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase();
});

// set up handler for get requests
app.get('/', (req, res) => {
    res.render('home.hbs', {
        pageTitle: 'Home Page',
        welcomeMessage: 'Welcome to my website!'
    });
});
app.get('/about', (req, res) => {
    res.render('about.hbs', {
        pageTitle: 'About Page',
    });
    // res.send('About Page');
});
app.get('/bad', (req, res) => {
    res.send({
       errorMessage: 'Error processing request.'
    });
});
app.get('/projects', (req, res) => {
    res.render('projects.hbs', {
        pageTitle: 'Projects Page'
    });
});

// have to listen if we want to be able to respond to requets
app.listen(port, () => { 
    console.log(`Server is up on port ${port}`);
});
