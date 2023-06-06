// FUNZIONI DI INTRO... cosa va messo?

// Questi richiami di libreria van sempre
const request  = require('supertest'); // npm install supertest // utile per richiamare le api con metodi GET SET PUT ecc...
const app      = require('./app'); // Questo fa partire l'app principale sennò non funzia nulla
const jwt     = require('jsonwebtoken'); // Per creare i token
const mongoose = require('mongoose'); // libreria per collegarsi al db

/*
POST -> crea nuovo oggetto di quel tipo
PUT -> mette dati, se codice corrisponde aggiorna altrimenti crea nuovo
GET -> cerca dati e li resituisce

// Descrivi l'API che vuoi testare: 1) Che metodo usa? Es: POST, GET, PUT, DELETE ecc... 2) Qual'è il link per raggiungere l'API? Noi usiamo sempre /api/v1/...
describe('COSA METTERE QUI?', () => {

    BEFORE ALL... cosa sta succedendo qui? apre connessione con il db e poi la chiude?
    {
        // Prima che avvenga il test: Connetti al DB
    }
    AFTER ALL...
    {
        // Quando finisci chiudi la connessione al DB
    }

    test(' ... registration con campo nickname vuoto', () => {
        return request(app)
          .post('/api/v1/registrations') // Qua in base al metodo della API (post, get, put ecc...)
          .set('Accept', 'application/json') Questa va sempre siccome le risposte delle API sono sempre in JSON
          .send({nickname: "", password: "Password2", bio: "La mia bio" ecc...}) // Questo se si ha bisogno di inviare valori
          .expect(200, { success: false, message: "Controlla di aver inserito tutti i dati richiesti!" }); // Risultato atteso
    })

});
*/

// Esempio prima API in utenti.js
// Da utenti.js: // Se app.js capta una GET verso /api/v1/utenti/me allora ritorna i dati del profilo
// I dati del profilo vengono inviati solo se l'utente è autenticato (possiede il token)
describe('GET /api/v1/utenti/me', () => {

    let connection;
  
    beforeAll( async () => {
      jest.unmock('mongoose');
      connection = await  mongoose.connect(process.env.DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});
      console.log('Database connected!');
      //return connection; // Need to return the Promise db connection?
    });
  
    afterAll( () => {
      mongoose.connection.close(true);
      console.log("Database connection closed");
    });
  
    test('GET /api/v1/utenti/me senza token', () => {
      return request(app)
        .get('/api/v1/utenti/me')
        .set('Accept', 'application/json')
        .expect(401, { success: false, message: "No token provided."}); // Vedi tokenChecker
        // 401 codice non autorizzato
    });

    // test con token
    // crea un token valido
    var payload = {
        email: "rocco01@gmail.com",
        id: "RedRocco"
    }
    var options = {
        expiresIn: 86400 // Scade in 24 ore
    }
    var token = jwt.sign(payload, process.env.SUPER_SECRET, options);
    // test GET con .send({token:token})
});
