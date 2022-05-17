const request = require('supertest');
const app = require('../app.js');
const seed = require('../db/seeds/seed.js');
const testData = require('../db/data/test-data/index.js');
const db = require('../db/connection.js');

afterAll(() => db.end());
beforeEach(() => seed(testData));

describe('GET /api/topics', () => {
  test('responds with object containing all items', () => {
    return request(app)
      .get('/api/topics')
      .expect(200)
      .then(({ body }) => {
        expect(body).toHaveLength(3);
        body.forEach((topic) => {
          expect(topic).toHaveProperty('slug');
          expect(topic).toHaveProperty('description');
        });
      });
  });
  test('404: Returns \'Route not found\' when the route doesn\'t exist', () => {
    return request(app)
    .get('/api/nothing')
    .expect(404)
    .then((response) => {
      expect(response.body.msg).toBe('Route not found');
    });
  });
});

// describe('GET /api/articles/:article_id', () => {
//   test('responds with article with aricle_id', () => {
//     return request(app)
//       .get('/api/articles/1')
//       .expect(200)
//       .then(({body}) => { // destructure body from the response
//         expect(body).toBeInstanceOf(Object);
//         expect(body).toHaveProperty('author');
//         expect(body.author).toBe('butter_bridge');
//         expect(body).toHaveProperty('title');
//         expect(body.title).toBe('Living in the shadow of a great man');
//         expect(body).toHaveProperty('article_id');
//         expect(body).toHaveProperty('body');
//         expect(body.body).toBe('I find this existence challenging');
//         expect(body).toHaveProperty('topic');
//         expect(body.topic).toBe('mitch');
//         expect(body).toHaveProperty('created_at');
//         expect(body).toHaveProperty('votes');
//         expect(body.votes).toBe(100);
//       })
//       .catch((error) => {
//         console.log('catched error');
//         if (error) throw error;
//       })
//   })
// })