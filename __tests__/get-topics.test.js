const request = require('supertest');
const app = require('../app.js');
const seed = require('../db/seeds/seed.js');
const testData = require('../db/data/test-data/index.js');
const db = require('../db/connection.js');

// afterAll( () => {
//   db.end();
// });

beforeEach(() => {
  seed(testData);
});

describe('GET /api/topics', () => {

  test('responds with object containing all items', () => {
    return request(app)
      .get('/api/topics')
      .expect(200)
      .then((response) => {
        expect(response.body).toHaveLength(3);
        response.body.forEach(topic => {
          expect(topic).toHaveProperty('slug');
          expect(topic).toHaveProperty('description');
        });
      })
      .catch((error) => {
        if (error) throw error;
      });
  });
});