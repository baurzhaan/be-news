const request = require('supertest');
const app = require('../app.js');
const seed = require('../db/seeds/seed.js');
const testData = require('../db/data/test-data/index.js');
const db = require('../db/connection.js');

afterAll(() => db.end());
beforeEach(() => seed(testData));

describe('3. GET /api/topics', () => {
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

describe('4. GET /api/articles/:article_id', () => {
  test('responds the article with an id of 1', () => {
    return request(app)
      .get('/api/articles/1')
      .expect(200)
      .then(({ body }) => {
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
        expect(body.msg).toBe('Not found');
      });
  });
  test('400: responds with message \'Bad request\' when the article id is not valid', () => {
    return request(app)
      .get('/api/articles/not_valid_request')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Invalid request');
      });
  });
});

describe('5. PATCH /api/articles/:article_id', () => {
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
      votes: 20
    };
    return request(app)
      .patch('/api/articles/9')
      .send({ inc_votes : 20 })
      .expect(201)
      .then(({ body }) => {
        expect(body).toEqual(updatedArticle);
      });
  });
  test('404: responds with message \'Not found\' when the article with article_id doesn\'t exist', () => {
    return request(app)
      .patch('/api/articles/666')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Not found');
      });
  });
  test('400: responds with message \'Bad request\' when the article id is not valid', () => {
    return request(app)
      .patch('/api/articles/not_valid_request')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Invalid request');
      });
  });
});

describe('6. GET /api/users', () => {
  test('responds with an array of objects, each of each has \'username\' property', () => {
    return request(app)
      .get('/api/users')
      .expect(200)
      .then(({ body }) => {
        expect(body).toHaveLength(4);
        expect(body).toBeInstanceOf(Array);
        body.forEach((topic) => {
          expect(topic).toHaveProperty('username');
          expect(Object.keys(topic).length).toBe(3);
        });
      });
  });
});

describe('7. GET /api/articles/:article_id (comment count)', () => {
  test('returns the updated article object with the \'comment_count\' property', () => {
    return request(app)
      .get('/api/articles/3')
      .expect(200)
      .then(({ body }) => {
        expect(body.comment_count).toBe(2);
    });
  });
});

describe('8. GET /api/articles', () => {
  test('responds with array, which contains appropriate properties', () => {
    return request(app)
    .get('/api/articles')
    .expect(200)
    .then(({ body: articles }) => {
      expect(articles).toBeInstanceOf(Array);
      articles.forEach(article => {
        expect(article).toEqual(expect.any(Object));
        expect(article).toEqual({
            article_id: expect.any(Number),
            author: expect.any(String),
            title: expect.any(String),
            topic: expect.any(String),
            created_at: expect.any(Number),
            votes: expect.any(Number),
            comment_count: expect.any(Number)
        });
      });
    });
  });
  test('specific article has correct comment_count', () => {
    return request(app)
    .get('/api/articles')
    .expect(200)
    .then(({ body: articles }) => {
      const specificArticle = articles.find(article => article.title === 'They\'re not exactly dogs, are they?');
      expect(specificArticle.comment_count).toBe(2);
    });
  });
  test('objects are sorted by \'date\' property in descending order', () => {
    return request(app)
    .get('/api/articles')
    .expect(200)
    .then(({ body: articles }) => {
      expect(articles).toBeSortedBy('created_at', { descending: true });
    });
  });
});

describe('9. GET /api/articles/:article_id/comments', () => {
  test('responds with an array of comments for the given article_id', () => {
    return request(app)
      .get('/api/articles/1/comments')
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeInstanceOf(Array);
        body.forEach(comment => {
          expect(comment).toEqual(expect.any(Object));
          expect(comment).toEqual({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(Number),
              author: expect.any(String),
              body: expect.any(String)
          });
        });
    });
  });
  test('404: responds with message \'Not found\' when the article with article_id doesn\'t exist', () => {
    return request(app)
      .get('/api/articles/666/comments')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Not found');
      });
  });
});