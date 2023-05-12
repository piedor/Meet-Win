const express = require('express');
const app = express();


/**
 * Configure Express.js parsing middleware
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use((req,res,next) => {
    console.log(req.method + ' ' + req.url)
    next()
})



app.get('/api/v1/hello', (req, res) => {
    res.json( {msg: "Hello world!"} );
} );



/* Default 404 handler */
app.use((req, res) => {
    res.status(404);
    res.json({ error: 'Not found' });
});



module.exports = app;
