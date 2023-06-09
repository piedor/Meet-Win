// Questi richiami di libreria vanno sempre
const request  = require('supertest');    // utile per richiamare le api con metodi GET SET PUT ecc...
const app      = require('./app');        // Questo fa partire l'app principale altrimenti non funziona nulla
const jwt     = require('jsonwebtoken');  // Per creare i token
const mongoose = require('mongoose');     // libreria per collegarsi al db

//POST -> crea nuovo oggetto di quel tipo
//PUT -> mette dati, se codice corrisponde aggiorna altrimenti crea nuovo
//GET -> cerca dati e li resituisce

//Descrivi l'API che vuoi testare: 1) Che metodo usa? Es: POST, GET, PUT, DELETE ecc... 2) Qual'è il link per raggiungere l'API? Noi usiamo sempre /api/v1/...
describe('GET /api/v1/utenti/me', () => {

  beforeAll( async () => {
    jest.unmock('mongoose');
    connection = await  mongoose.connect(process.env.DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});
    console.log('Database connected!');
  });

  afterAll( () => {
    mongoose.connection.close(true);
    console.log("Database connection closed");
  });

  test('GET api/v1/utenti/me Token mancante', () => {
    return request(app)
      .get('/api/v1/utenti/me') // Qua in base al metodo della API (post, get, put ecc...)
      .set('Accept', 'application/json') //Questa va sempre siccome le risposte delle API sono sempre in JSON
       // .send({nickname: "", password: "Password2", bio: "La mia bio" ecc...}) // Questo se si ha bisogno di inviare valori, qui non serve
      .expect(401, { success: false, message: 'No token provided.' }); // Risultato atteso
  })

  test('GET api/v1/utenti/me Token presente', () => {
    var payload = {
      email: 'rocco01@gmail.com',
      id: 'RedRocco'
    }
    // Tempo di vita: 24 ore (millisecondi)
    var options = {
      expiresIn: 86400 
    }
    var token = jwt.sign(payload, process.env.SUPER_SECRET, options);
    return request(app)
      .get('/api/v1/utenti/me')           //In base al metodo della API (post, get, put ecc...)
      .set('Accept', 'application/json')  //Risposte delle API sono sempre in JSON
      .send({token: token})               //Invio dati del token
      .expect(200, {                                                        
         email: 'rocco01@gmail.com',                                                                                                         
         nickname: 'RedRocco',                                                                                                               
         bio: 'La bio di RedRocco',                                                                                                          
         preferenze: [ '100', '104', '201', '204', '304' ],                                                                                  
         piattaforme: []}); // Risultato atteso
  })
// 200 - tutto ok   404 - pagina non trovata    403 - non autorizzato (non dovrebbe servirmi molto oltre a 200)
});

describe('POST /api/v1/utenti', () => {     //POST per la registrazione

  beforeAll( async () => {
    jest.unmock('mongoose');
    connection = await  mongoose.connect(process.env.DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});
    console.log('Database connected!');
  });

  afterAll( () => {
    mongoose.connection.close(true);
    console.log("Database connection closed");
  });

  test('POST api/v1/utenti registrazione con campo nickname vuoto', () => {
    return request(app)
      .post('/api/v1/utenti')             // Qua in base al metodo della API (post, get, put ecc...)
      .set('Accept', 'application/json')  //Questa va sempre siccome le risposte delle API sono sempre in JSON
      .send({nickname: "", password: "Password2", email: "redroccoalpha@gmail.com"}) // Valori da fornire per il caso di test
      .expect(401, { success: false, message: 'No token provided.' });               // Risultato atteso
  })
});
