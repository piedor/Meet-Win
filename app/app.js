const express = require('express');
const app = express();
const cors = require('cors')

const authentication = require('./authentication.js');
const registration = require('./registration.js');
const tokenChecker = require('./tokenChecker.js');
const utenti = require('./utenti.js');

/**
 * Configure Express.js parsing middleware
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


/**
 * CORS requests
 */
app.use(cors())

// Fornisci file html
app.use('/', express.static('static')); 

app.use((req,res,next) => {
    console.log(req.method + ' ' + req.url)
    next()
})

/**
 * Authentication routing and middleware
 */
app.use('/api/v1/authentications', authentication);
app.use('/api/v1/registrations', registration);

// Protect booklendings endpoint
// access is restricted only to authenticated users
// a valid token must be provided in the request
app.use('/api/v1/utenti/me', tokenChecker);



/* Default 404 handler */
app.use((req, res) => {
    res.status(404);
    res.json({ error: 'Not found' });
});



module.exports = app;
