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

describe('GET /api/articles/:article_id', () => {
  test('responds the article with an id of 1', () => {
    return request(app)
      .get('/api/articles/1')
      .expect(200)
      .then(({ body }) => { // destructure body from the response
        expect(body).toBeInstanceOf(Object);
        expect(body).toEqual(
          expect.objectContaining({
            'author': expect.any(String),
            'title': expect.any(String),
            'article_id': 1,
            'body': expect.any(String),
            'topic': expect.any(String),
            'created_at': expect.anything(),
            'votes': expect.any(Number)
          })
        );
      });
  });
  test('404: responds with message \'Not found\' when the article with article_id doesn\'t exist', () => {
    return request(app)
      .get('/api/articles/666')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('The article not found');
      })
  });
  test('400: responds with message \'Bad request\' when the article id is not valid', () => {
    return request(app)
      .get('/api/articles/not_valid_request')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Not valid request');
      })
  });
});

describe('PATCH /api/articles/:article_id', () => {
  test('check if an input is an object', () => {
    return request(app)
      .patch('/api/articles/3')
      .then(({ body }) => {
        expect(body).toBeInstanceOf(Object);
      });
  });
  test('positive number of votes increments the votes', () => {
    return request(app)
      .patch('/api/articles/3')
      .send({ inc_votes : 10 })
      .expect(201)
      .then(({ body }) => {
        expect(body.votes).toBe(10);
      });
  });
  test('negative number of votes decrements the votes', () => {
    return request(app)
      .patch('/api/articles/3')
      .send({ inc_votes : -10 })
      .expect(201)
      .then(({ body }) => {
        expect(body.votes).toBe(-10);
      });
  });
  test('returns the updated article object', () => {
    const updatedArticle = {
      article_id: 9,
      title: "They're not exactly dogs, are they?",
      topic: "mitch",
      author: "butter_bridge",
      body: "Well? Think about it.",
      created_at: 1591438200000, //2020-06-06 10:10:00
      votes: 20,
    };
    return request(app)
      .patch('/api/articles/9')
      .send({ inc_votes : 20 })
      .expect(201)
      .then(({ body }) => {
        expect(body).toEqual(updatedArticle);
      });
  });
  

})