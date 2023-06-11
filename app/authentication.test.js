/*const request  = require('supertest');
const app      = require('./app');
const jwt     = require('jsonwebtoken');
const mongoose = require('mongoose'); */
/*
describe('POST /api/v1/authentications', () => {      //POST per l'autenticazione (login)

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

  test('POST /api/v1/authentications senza nickname e password', () => {
    return request(app)
      .post('/api/v1/authentications')
      .set('Accept', 'application/json')
      .send({nickname: "", password: ""})
      .expect(401, { success: false, message: "Nessun utente trovato!" });
  });

  test('POST /api/v1/authentications con password vuota', () => {
    return request(app)
      .post('/api/v1/authentications')
      .set('Accept', 'application/json')
      .send({nickname: "RedRocco"})
      .expect(401, { success: false, message: "Password errata!" });
  });

  test('POST /api/v1/authentications con nickname non esistente', () => {
    return request(app)
      .post('/api/v1/authentications')
      .set('Accept', 'application/json')
      .send({nickname: "GreenRocco"})
      .expect(401, { success: false, message: "Nessun utente trovato!" });
  });

  test('POST /api/v1/authentications con password errata', () => {
    return request(app)
      .post('/api/v1/authentications')
      .set('Accept', 'application/json')
      .send({nickname: "RedRocco", password: "Password2x"})
      .expect(401, { success: false, message: "Password errata!" });
  });
  
/*
  // crea un token valido
  var payload = {
    email: "redroccoalpha@gmail.com",
    id: "RedRocco"
  }
  var options = {
    expiresIn: 86400 // Scade in 24 ore
  }
  var token = jwt.sign(payload, process.env.SUPER_SECRET, options);

  test('POST /api/v1/authentications con nickname e password validi', () => {
    return request(app)
      .post('/api/v1/authentications')
      .set('Accept', 'application/json')
      .send({nickname: "RedRocco", password: "Password2"})
      .expect(200, {
        success: true,
        message: 'Login avvenuto con successo!',
        token: token,     //Come far combaciare il token?
        email: 'redroccoalpha@gmail.com',
        id: '6482f1f9631e9982b691f781',
        nickname: 'RedRocco'
      });
  }); 

}); //NOTOK
*/