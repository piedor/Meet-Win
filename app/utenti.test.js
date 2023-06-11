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

  let connection;

  beforeAll( async () => {
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
      .expect(401, { success: false, message: 'Errore durante il salvataggio dell\'utente' });
  })   

  test('POST api/v1/utenti registrazione con campo password vuoto', () => {   //? - connessione viene chiusa
    return request(app)
      .post('/api/v1/utenti')             
      .set('Accept', 'application/json') 
      .send({nickname: "Gianpierluca", password: "", email: "gianpierluca01@gmail.com"})
      .expect(401, { success: false, message: 'Errore durante il salvataggio dell\'utente' });
  })   

  test('POST api/v1/utenti registrazione con campo email vuoto', () => {   //? - connessione viene chiusa
    return request(app)
      .post('/api/v1/utenti')             
      .set('Accept', 'application/json') 
      .send({nickname: "Gianpierluca", password: "Password2", email: ""})
      .expect(401, { success: false, message: 'Errore durante il salvataggio dell\'utente' });
  })   

  test('POST api/v1/utenti registrazione con nickname già utilizzato', () => {   //? - connessione viene chiusa
    return request(app)
      .post('/api/v1/utenti')            
      .set('Accept', 'application/json') 
      .send({nickname: "RedRocco", password: "Password2", email: "gianpierluca01@gmail.com"}) 
      .expect(200, { success: false, message: 'Nickname già utilizzato!' });   
  })

  test('POST api/v1/utenti registrazione campi validi', () => {   //? - connessione viene chiusa
    //const salt = await bcrypt.genSalt(10);
    //const hashedPassword = await bcrypt.hash("Password2", salt);
    return request(app)
      .post('/api/v1/utenti')            
      .set('Accept', 'application/json') 
      .send({nickname: "TestXX",
        email: "testxxx@gmail.com",
        password: "Password2",
        cellulare: 0,
        verificato: false,
        bloccato: false,
        limitato: false,
        bio: "",
        preferenze: ['103'],
        piattaforme: ['104'],
        id_img: 104,
        zona: "Casa di Leo",
        privato: false}) 
      .expect(200, { success: true, message: 'Nuovo utente salvato con successo' });   
  })

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

describe('PUT /api/v1/utenti', () => {           // PUT per la modifica della password

  let connection;

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

  test('PUT /api/v1/utenti Modifica password con campi corretti', () => {   // ? - forse può essere utile funzione mock?
    return request(app)
      .put('/api/v1/utenti')
      .set('Accept', 'application/json')
      .send({nickname: "RedRocco", email: "redroccoalpha@gmail.com", password: "Password2"})
      .expect(200, { success: true, message: 'Utente modificato correttamente' }); // Risultato atteso
  })

  test('PUT /api/v1/utenti Modifica password con errore nei campi', () => { //? - errore 
    return request(app)
      .get('/api/v1/utenti/me')           
      .set('Accept', 'application/json')  
      .send({nickname: "RedRocco", email: "redroccoalpha@gmail.com", password: "PasswordX"})              
      .expect(200, {success: false, message: "Errore nella modifica dei dati"}); 
  })  

}); //NOTOK

describe('PUT /api/v1/utenti', () => {           // PUT per la modifica dei dati dell'utente

  let connection;

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

  test('PUT /api/v1/utenti Modifica dati utenti', () => {   // ? 
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

}); ////NOTOK

describe('GET /api/v1/utenti/me', () => {        //GET per la visualizzazione del mio profilo utente

  beforeAll( async () => {
    jest.unmock('mongoose');
    connection = await  mongoose.connect(process.env.DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});
    console.log('Database connected!');
  });

  afterAll( () => {
    mongoose.connection.close(true);
    console.log("Database connection closed");
  });

  test('GET api/v1/utenti/me Visualizza le mie informazioni utente', () => {
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
      .get('/api/v1/utenti/me') 
      .set('Accept', 'application/json') 
      .send({email: 'redroccoalpha@gmail.com', token: token})
      .expect(200, {
        email: 'redroccoalpha@gmail.com',
        nickname: 'RedRocco',
        bio: 'Rosso di rabbia.',
        preferenze: [
          '103', '105',
          '107', '109',
          '206', '207',
          '301', '307'
        ],
        piattaforme: [ '104' ],
        zona: 'Bassano del Grappa',
        avatar: 104,
        privato: false
      });
  })

}); //NOTOK -  - eseguito singolarmente funziona, se insieme ad altri casi di test no..

describe('GET /api/v1/utenti/list', () => {      //GET per ottenere l'elenco degli utenti

  beforeAll( async () => {
    jest.unmock('mongoose');
    connection = await  mongoose.connect(process.env.DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});
    console.log('Database connected!');
  });

  afterAll( () => {
    mongoose.connection.close(true);
    console.log("Database connection closed");
  });

  test('GET /api/v1/utenti/list Elenco utenti registrati', () => {  //questo test smette di funzionare se vengono aggiunti o rimossi utenti dal database. Risolvibile con delle funzioni mock.
    return request(app)
      .get('/api/v1/utenti/list') 
      .set('Accept', 'application/json')
      .expect(200, {
        success: true,
        users: [
          'prova2',        'Tmao2',
          'Cecio',         'prova',
          'Tmao',          'alessia',
          'LeoMortadella', 'Rocco',
          'Siuuum',        'AleSalame',
          'Chefbaucco',    'Niknik',
          'Black_leo',     'galbatorix1243',
          'silvi',         'RedRocco' ],
      });
  })

}); //NOTOK - eseguito singolarmente funziona, se insieme ad altri casi di test no..

describe('GET /api/v1/utenti/:nickname', () => {        //GET per la visualizzazione del profilo di un utente

  beforeAll( async () => {
    jest.unmock('mongoose');
    connection = await  mongoose.connect(process.env.DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});
    console.log('Database connected!');
  });

  afterAll( () => {
    mongoose.connection.close(true);
    console.log("Database connection closed");
  });

  test('GET api/v1/utenti/:nickname Visualizza il profilo di un utente', () => {  //resituisce "utente non trovato!"
    return request(app)
      .get('/api/v1/utenti/:nickname') 
      .set('Accept', 'application/json') 
      .send({nickname: "RedRocco"})
      .expect(200, {  });
  })

}); //NOTOK