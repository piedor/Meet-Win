const request = require('supertest');
const jwt     = require('jsonwebtoken');
const app     = require('./app');

test('Modulo app definito', () => {
  expect(app).toBeDefined();
});

test('GET / ritorna 200', () => {
  return request(app)
    .get('/')
    .expect(200);
}); 