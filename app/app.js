// Web app
const express = require('express');
const app = express();
// CORS
const cors = require('cors');
// Gestore cookie browser
const cookieParser = require('cookie-parser');

const authentication = require('./authentication.js');
const tokenChecker = require('./tokenChecker.js');
const utenti = require('./utenti.js');
const mailInterface = require ('./mailInterface.js');
const tornei = require('./tornei.js');

// Configurazione Express.js per middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser semplifica la vita con i cookie
app.use(cookieParser())

// Richieste CORS
app.use(cors())

// Fornisci files html
app.use('/', express.static('static')); 

// Serve come debug (stampa il tipo di richieste ricevute)
app.use((req,res,next) => {
    console.log(req.method + ' ' + req.url)
    next()
})

/**
 * Authentication routing and middleware
 */
app.use('/api/v1/authentications', authentication);

// Usando tokenChecker si protegge la risorsa
// L'accesso è consentito solo agli utenti autenticati
// Il token può essere sia passato che salvato nei cookie
// Informazioni sul mio profilo (Accesso ristretto)
app.use('/api/v1/utenti/me', tokenChecker);

// Vedi utenti.js
app.use('/api/v1/utenti', utenti);

// Vedi mailInterface.js
app.use('/api/v1/mails', mailInterface);    //bisogna chiamarlo mails

app.use('/api/v1/tornei', tornei);

// Se viene richiesta una risorsa non gestita allora ritorna 404 NOT FOUND
app.use((req, res) => {
    res.status(404);
    res.json({ error: 'Not found' });
});

module.exports = app;
