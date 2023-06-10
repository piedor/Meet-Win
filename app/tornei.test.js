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
      .send({})
      .expect(200, {success: true, message: 'Torneo salvato correttamente!', _id: '64844c37c3f62738cf7dd3f9' });
  })

}); //NOTOK

describe('PUT /api/v1/tornei', () => {         //PUT per la modifica dei dati di un torneo - mock function! che non funzia

  // Moking del metodo torneo.findOne
  let torneoSpy;
    
  beforeAll( async () => {
    const Torneo = require('./models/torneo');    //torneo o Torneo?
    torneoSpy = jest.spyOn(Torneo,'findOne.exe()').mockImplementation((criterias) => {
      return {_id:'647de69fca346186e39935e0'};  //Torneo "Patronato school" di RedRocco
    });
  });

  afterAll( () => {
    torneoSpy.mockRestore();
  });
  
  test('PUT /api/v1/tornei Modifica a torneo salvato', () => {  //Questo test si può fare solo una volta e poi va modificato..!
    return request(app)
      .put('/api/v1/tornei')
      .set('Accept', 'application/json')
      .send({nomeTorneo: "Torneo"})
      .expect(200, {success: true, message: 'Torneo salvato correttamente!', _id: '647de69fca346186e39935e0' });
  })
      //ff pls i'm done
}); //NOTOK
