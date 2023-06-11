const request  = require('supertest');    // utile per richiamare le api con metodi GET SET PUT ecc...
const app      = require('./app');        // Questo fa partire l'app principale altrimenti non funziona nulla
const jwt     = require('jsonwebtoken');  // Per creare i token
const mongoose = require('mongoose');     // libreria per collegarsi al db
const torneo = require('./models/torneo');

describe('POST /api/v1/tornei', () => {         //POST per la creazione e il salvataggio di un torneo

  beforeAll( async () => {
    jest.unmock('mongoose');
    connection = await  mongoose.connect(process.env.DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});
    console.log('Database connected!');
  });
  
  afterAll( () => {
    mongoose.connection.close(true);
    console.log("Database connection closed");
  });
  
  test('POST /api/v1/tornei Creazione torneo incompleto e salvataggio', () => {  //L'id del torneo cambia sempre, come fare? -> mock function? Inoltre, questo test si può fare solo una volta e poi va modificato il nome o eliminato dal db..
    return request(app)
      .post('/api/v1/tornei')
      .set('Accept', 'application/json')
      .send({nomeTorneo: 'Torneo dei test'})
      .expect(200, {success: true, message: 'Torneo salvato correttamente!', _id: '6485951c8e42dc216932a92a'});
  })

}); //NOTOK

describe('PUT /api/v1/tornei', () => {         //PUT per la modifica dei dati di un torneo - mock function da sistemare!

  // Moking del metodo torneo.findOne
  let torneoSpy;
    
  beforeAll( async () => {
    const Torneo = require('./models/torneo');
    torneoSpy = jest.spyOn(Torneo,'find').mockImplementation((criterias) => {  //Mi da un errore che non capisco come risolvere!
      return {_id:'647de69fca346186e39935e0'};  //Torneo "Patronato school" di RedRocco
    });
  });

  afterAll( () => {
    torneoSpy.mockRestore();
  });
  
  test('PUT /api/v1/tornei Modifica a torneo salvato', () => {  //Questo test scritto così è valido solo una volta e poi va modificato!
    return request(app)
      .put('/api/v1/tornei')
      .set('Accept', 'application/json')
      .send({nomeTorneo: "TorneoX"})
      .expect(200, {success: true, message: 'Torneo salvato correttamente!', _id: '647de69fca346186e39935e0' });
  })

}); //NOTOK

describe('GET /api/v1/tornei/list', () => {         //GET per ottenere l'elenco dei tornei

  beforeAll( async () => {
    jest.unmock('mongoose');
    connection = await  mongoose.connect(process.env.DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});
    console.log('Database connected!');
  });
  
  afterAll( () => {
    mongoose.connection.close(true);
    console.log("Database connection closed");
  });
  
  test('GET /api/v1/tornei/list Restituisce un array di tornei', async () => {
    return request(app)
      .get('/api/v1/tornei/list')
      .expect('Content-Type', /json/)
      .expect(res.body[0]).toEqual({
        success: true,
        idTorneo: '647cbe409722939a7a15cee6'
      });     
  });

}); //NOTOK

describe('GET /api/v1/tornei/:id', () => {         //GET restituisce json

  beforeAll( async () => {
    jest.unmock('mongoose');
    connection = await  mongoose.connect(process.env.DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});
    console.log('Database connected!');
  });
  
  afterAll( () => {
    mongoose.connection.close(true);
    console.log("Database connection closed");
  });
  
  test('GET /api/v1/tornei/:id Restituisce json', async () => {
    return request(app)
      .get('/api/v1/tornei/647cbe409722939a7a15cee6')
      .expect('Content-Type', /json/)
      .expect(200, {
        success: true, 
        organizzatore:'Tmao',
        nomeTorneo: 'Winners here',
        argomento: 'Magic',
        id_img: 104,
        zona: 'Pove del Grappa',
        bio: 'Ciao a tutti, sto organizzando un torneo di Magic a Pove del Grappa, vi aspetto tutti!!',
        regolamento: 'Regolamento legacy standard ',
        numeroSquadre: 8,
        numeroGiocatori: 1,
        formatoT: 'eliminazione',
        numeroGironi: null,
        formatoP: 'bo1',
        pubblicato: true,
        tags: [307],
        piattaforma: '0',
        dataInizio: '10/07/2023',
        terminato: false,
        fasi: 1,
        faseAttuale: 0,
        });
  });

}); //NOTOK

describe('GET verso /api/v1/tornei/:idTorneo', () => {         //GET per ottenere i dati di un torneo

  beforeAll( async () => {
    jest.unmock('mongoose');
    connection = await  mongoose.connect(process.env.DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});
    console.log('Database connected!');
  });
  
  afterAll( () => {
    mongoose.connection.close(true);
    console.log("Database connection closed");
  });
  
  test('GET /api/v1/tornei/:idTorneo Restituisce i dati di un torneo', () => { 
    return request(app)
      .get('/api/v1/:idTorneo')
      .set('Accept', 'application/json')
      .send({_id: '647de69fca346186e39935e0'})
      .expect(200, {  });
  })

}); //NOTOK
