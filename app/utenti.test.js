// Questi richiami di libreria vanno sempre
const request  = require('supertest');    // utile per richiamare le api con metodi GET SET PUT ecc...
const app      = require('./app');        // Questo fa partire l'app principale altrimenti non funziona nulla
const jwt     = require('jsonwebtoken');  // Per creare i token
const mongoose = require('mongoose');     // libreria per collegarsi al db

//POST -> crea nuovo oggetto di quel tipo
//PUT -> mette dati, se codice corrisponde aggiorna altrimenti crea nuovo
//GET -> cerca dati e li resituisce

//Descrivi l'API che vuoi testare: 1) Che metodo usa? Es: POST, GET, PUT, DELETE ecc... 2) Qual'è il link per raggiungere l'API? Noi usiamo sempre /api/v1/...
describe('GET api/v1/utenti/me', () => {         //GET per il controllo del token

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
      email: 'redroccoalpha@gmail.com',
      id: 'RedRocco'
    }
    // Tempo di vita: 24 ore (millisecondi)
    var options = {
      expiresIn: 86400 
    }
    var token = jwt.sign(payload, process.env.SUPER_SECRET, options);   //generazione del token
    return request(app)
      .get('/api/v1/utenti/me')           //In base al metodo della API (post, get, put ecc...)
      .set('Accept', 'application/json')  //Risposte delle API sono sempre in JSON
      .send({token: token})               //Invio dati del token
      .expect(200, {                      // Risultato atteso
        email: 'redroccoalpha@gmail.com',
        nickname: 'RedRocco',
        bio: 'Rosso di rabbia',
        preferenze: ['103', '105', '107', '109', '206', '207', '301', '307'],
        piattaforme: [ '104' ],
        zona: 'Bassano del Grappa',
        avatar: 104,
        privato: false
      }); 
  })
// 200 - tutto ok   404 - pagina non trovata    403 - non autorizzato (non dovrebbe servirmi molto oltre a 200)
}); //OK

describe('POST api/v1/utenti', () => {           //POST per la registrazione

  beforeAll( async () => {
    jest.unmock('mongoose');
    connection = await  mongoose.connect(process.env.DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});
    console.log('Database connected!');
  });

  afterAll( () => {
    mongoose.connection.close(true);
    console.log("Database connection closed");
  });
/*          QUESTO CASO DI TEST VIENE ESEGUITO PRIMA ANCORA DI PERMETTERE DI PROVARE L'ISCRIZIONE, no?
  test('POST api/v1/utenti registrazione con campo nickname vuoto', () => {
    return request(app)
      .post('/api/v1/utenti')             // Qua in base al metodo della API (post, get, put ecc...)
      .set('Accept', 'application/json')  //Questa va sempre siccome le risposte delle API sono sempre in JSON
      .send({nickname: "", password: "Password2", email: "gianpierluca01@gmail.com"}) // Valori da fornire per il caso di test
      .expect(401, { success: false, message: 'No token provided.' });               // Risultato atteso
  })  */  
/*          NON SO QUALE SIA IL PROBLEMA ?
  test('POST api/v1/utenti registrazione campi validi', () => {
    return request(app)
      .post('/api/v1/utenti')             // Qua in base al metodo della API (post, get, put ecc...)
      .set('Accept', 'application/json')  //Questa va sempre siccome le risposte delle API sono sempre in JSON
      .send({nickname: "TestX", password: "TestTest1", email: "gianpierluca01@gmail.com"}) // Valori da fornire per il caso di test
      .expect(200, { success: false, message: 'No token provided.' });   // Risultato atteso
    })    */

}); //NOTOK

describe('GET /api/v1/utenti/logout', () => {    //GET per il logout

  beforeAll( async () => {
    jest.unmock('mongoose');
    connection = await  mongoose.connect(process.env.DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});
    console.log('Database connected!');
  });

  afterAll( () => {
    mongoose.connection.close(true);
    console.log("Database connection closed");
  });

  test('GET /api/v1/utenti/logout Logout da anonimo', () => {    //? Non dovrebbe funzionare così..
    var payload = {
      email: 'redroccoalpha@gmail.com',
      id: 'RedRocco'
    }
    // Tempo di vita: 24 ore (millisecondi)
    var options = {
      expiresIn: 86400 
    }
    var token = jwt.sign(payload, process.env.SUPER_SECRET, options);
    return request(app)
      .get('/api/v1/utenti/logout')       // Qua in base al metodo della API (post, get, put ecc...)
      .set('Accept', 'application/json')  //Questa va sempre siccome le risposte delle API sono sempre in JSON
      .send({token: token})               // Valori da fornire per il caso di test
      .expect(200, { success: false, message: 'Non sei loggato!'});   // Risultato atteso
})

//    COME INDICO CHE SONO LOGGATO AD UN ACCOUNT?
test('GET /api/v1/utenti/logout Logout da loggato ad account', () => {
  var payload = {
    email: 'redroccoalpha@gmail.com',
    id: 'RedRocco'
  }
  // Tempo di vita: 24 ore (millisecondi)
  var options = {
    expiresIn: 86400 
  }
  var token = jwt.sign(payload, process.env.SUPER_SECRET, options);
  return request(app)
    .get('/api/v1/utenti/logout')             // Qua in base al metodo della API (post, get, put ecc...)
    .set('Accept', 'application/json')  //Questa va sempre siccome le risposte delle API sono sempre in JSON
    .send({nickname: "RedRocco", token: token}) // Valori da fornire per il caso di test
    .expect(200, { success: true, message: 'Logout effettuato con successo!'});   // Risultato atteso
  })

}); //NOTOK

describe('??', () => {         // ? per il recupero della password dimenticata

  beforeAll( async () => {    //forse posso evitare di ripetere ogni volta?
    jest.unmock('mongoose');
    connection = await  mongoose.connect(process.env.DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});
    console.log('Database connected!');
  });

  afterAll( () => {
    mongoose.connection.close(true);
    console.log("Database connection closed");
  });

  test('? ? Richiesta con identificativo non riconosciuto dal sistema', () => {
    return request(app)
      .get('/api/v1/utenti/me') // Qua in base al metodo della API (post, get, put ecc...)    ?
      .set('Accept', 'application/json') //Questa va sempre siccome le risposte delle API sono sempre in JSON
      .send({nickname: "GreenRocco"}) // Questo se si ha bisogno di inviare valori
      .expect(401, { success: false, message: 'Utente non riconosciuto.' }); // Risultato atteso
  })

  test('? ? Richietsa con identificativo riconosciuto dal sistema', () => {
    return request(app)
      .get('/api/v1/utenti/me')           //In base al metodo della API (post, get, put ecc...)   ?
      .set('Accept', 'application/json')  //Risposte delle API sono sempre in JSON
      .send({nickname: "RedRocco"})               //Invio dati del token
      .expect(200, {success: true, message: "?"}); 
  })
}); //NOTOK

describe('PUT /api/v1/utenti', () => {         // PUT per la modifica della password

  beforeAll( async () => {  
    jest.unmock('mongoose');
    connection = await  mongoose.connect(process.env.DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});
    console.log('Database connected!');
  });

  afterAll( () => {
    mongoose.connection.close(true);
    console.log("Database connection closed");
  });

  test('PUT /api/v1/utenti Modifica password con campo "vecchia password" sbagliato', () => {
    return request(app)
      .put('/api/v1/utenti') // Qua in base al metodo della API (post, get, put ecc...)
      .set('Accept', 'application/json') //Questa va sempre siccome le risposte delle API sono sempre in JSON
      .send({nickname: "RedRocco", email: "redroccoalpha@gmail.com", vecchiapassword: "Password1"}) // Questo se si ha bisogno di inviare valori   ?
      .expect(401, { success: false, message: 'Vecchia password sbagliata' }); // Risultato atteso
  })

  /*test('? ? Richietsa con identificativo riconosciuto dal sistema', () => {
    return request(app)
      .get('/api/v1/utenti/me')           //In base al metodo della API (post, get, put ecc...)   ?
      .set('Accept', 'application/json')  //Risposte delle API sono sempre in JSON
      .send({nickname: "RedRocco"})               //Invio dati del token
      .expect(200, {success: true, message: "?"}); 
  })  */
}); //NOTOK

