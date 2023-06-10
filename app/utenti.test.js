const request  = require('supertest');    // utile per richiamare le api con metodi GET SET PUT ecc...
const app      = require('./app');        // Questo fa partire l'app principale altrimenti non funziona nulla
const jwt     = require('jsonwebtoken');  // Per creare i token
const mongoose = require('mongoose');     // libreria per collegarsi al db

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
        bio: 'Rosso di rabbia.',
        preferenze: ['103', '105', '107', '109', '206', '207', '301', '307'],
        piattaforme: [ '104' ],
        zona: 'Bassano del Grappa',
        avatar: 104,
        privato: false
      }); 
  })
}); //OK

describe('POST api/v1/utenti', () => {           //POST per la registrazione

  beforeAll( async () => {
    jest.setTimeout(8000);
    jest.unmock('mongoose');
    connection = await  mongoose.connect(process.env.DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});
    console.log('Database connected!');
  });

  afterAll( () => {
    mongoose.connection.close(true);
    console.log("Database connection closed");
  });

  test('POST api/v1/utenti registrazione con campo nickname vuoto', () => {   //? - connessione viene chiusa
    return request(app)
      .post('/api/v1/utenti')             
      .set('Accept', 'application/json') 
      .send({nickname: "", password: "Password2", email: "gianpierluca01@gmail.com"})
      .expect(401, { success: false, message: 'No token provided.' });
  })   

  test('POST api/v1/utenti registrazione campi validi', () => {   //? - connessione viene chiusa
    return request(app)
      .post('/api/v1/utenti')             // Qua in base al metodo della API (post, get, put ecc...)
      .set('Accept', 'application/json')  //Questa va sempre siccome le risposte delle API sono sempre in JSON
      .send({nickname: "TestX", password: "TestTest1", email: "gianpierluca01@gmail.com"}) // Valori da fornire per il caso di test
      .expect(200, { success: false, message: 'No token provided.' });   // Risultato atteso
    })

  // mancano gli altri casi della tabella!
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

  test('GET /api/v1/utenti/logout Logout da anonimo', () => {    
    return request(app)
      .get('/api/v1/utenti/logout')       // Qua in base al metodo della API (post, get, put ecc...)
      .set('Accept', 'application/json')  //Questa va sempre siccome le risposte delle API sono sempre in JSON
      .expect(200, { success: false, message: 'Non sei loggato!'});   // Risultato atteso
})

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
    .set('Cookie', ['token='+token])
    .expect(200, { success: true, message: 'Logout effettuato con successo!'});   // Risultato atteso
  })

}); //OK

describe('? ?', () => {                          // per il recupero della password dimenticata

  beforeAll( async () => {    
    jest.setTimeout(8000);
    jest.unmock('mongoose');
    connection = await  mongoose.connect(process.env.DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});
    console.log('Database connected!');
  });

  afterAll( () => {
    mongoose.connection.close(true);
    console.log("Database connection closed");
  });

  test('?  ? Richiesta con identificativo non riconosciuto dal sistema', () => {
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

describe('PUT /api/v1/utenti', () => {           // PUT per la modifica della password

  beforeAll( async () => {  
    jest.setTimeout(8000);
    jest.unmock('mongoose');
    connection = await  mongoose.connect(process.env.DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});
    console.log('Database connected!');
  });

  afterAll( () => {
    mongoose.connection.close(true);
    console.log("Database connection closed");
  });

  test('PUT /api/v1/utenti Modifica password campi corretti', () => {   // ? - forse può essere utile funzione mock?
    return request(app)
      .put('/api/v1/utenti')
      .set('Accept', 'application/json')
      // Non capisco cosa dovrei fornire per modificare la password con successo!
      .send({nickname: "RedRocco", email: "redroccoalpha@gmail.com", vecchiapassword: "Password2"})
      .expect(200, { success: true, message: 'Utente modificato correttamente' }); // Risultato atteso
  })

  /*test('? ? Modifica password con identificativo riconosciuto dal sistema', () => {
    return request(app)
      .get('/api/v1/utenti/me')           //In base al metodo della API (post, get, put ecc...)   ?
      .set('Accept', 'application/json')  //Risposte delle API sono sempre in JSON
      .send({nickname: "RedRocco"})               //Invio dati del token
      .expect(200, {success: true, message: "?"}); 
  })  */

  // mancano gli altri casi previsti nella tabella
}); //NOTOK

describe('PUT /api/v1/utenti', () => {           // PUT per la modifica dei dati dell'utente

  beforeAll( async () => {  
    jest.setTimeout(8000);
    jest.unmock('mongoose');
    connection = await  mongoose.connect(process.env.DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});
    console.log('Database connected!');
  });

  afterAll( () => {
    mongoose.connection.close(true);
    console.log("Database connection closed");
  });

  test('PUT /api/v1/utenti Modifica dati utenti valida', () => {   // ? 
    return request(app)
      .put('/api/v1/utenti')
      .set('Accept', 'application/json')
      // Non capisco cosa dovrei fornire per modificare i dati con successo !
      .send({                
        email: 'redroccoalpha@gmail.com',
        nickname: 'RedRocco',
        bio: 'Rosso di rabbia.',
        preferenze: ['103', '104', '107', '109', '206', '207', '301', '307'],
        piattaforme: [ '104' ],
        zona: 'Bassano del Grappa',
        avatar: 104,
        privato: false
      })
      .expect(200, { success: true, message: 'Utente modificato correttamente' }); // Risultato atteso
  })

}); //NOTOK