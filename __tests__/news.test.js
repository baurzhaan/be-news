const request = require('supertest');
const app = require('../app.js');
const seed = require('../db/seeds/seed.js');
const testData = require('../db/data/test-data/index.js');
const db = require('../db/connection.js');

// afterAll(() => {
//   if (db.end) db.end();
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
        response.body.forEach((topic) => {
          expect(topic).toHaveProperty('slug');
          expect(topic).toHaveProperty('description');
        });
      })
      .catch((error) => {
        if (error) throw error;
      });
  });
});

// describe('GET /api/articles/:article_id', () => {
//   test('responds with article with aricle_id', () => {
//     return request(app)
//       .get('/api/articles/1')
//       .expect(200)
//       .then((response) => {
//         expect(response.body).toHaveLength(1);
//         expect(response.body).toHaveProperty('author');
//         expect(response.body).toHaveProperty('title');
//         expect(response.body).toHaveProperty('article_id');
//         expect(response.body).toHaveProperty('body');
//         expect(response.body).toHaveProperty('topic');
//         expect(response.body).toHaveProperty('created_at');
//         expect(response.body).toHaveProperty('votes');
//       })
//       .catch((error) => {
//         console.log('catched error');
//         if (error) throw error;
//       })
//   })
// })