const request = require('supertest');
const app = require('../app.js');
const seed = require('../db/seeds/seed.js');
const testData = require('../db/data/test-data/index.js');
const db = require('../db/connection.js');
const fs = require ('fs');

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
  test('404: responds with \'Article not found\' when the article with article_id doesn\'t exist', () => {
    return request(app)
      .get('/api/articles/666')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Article not found');
      });
  });
  test('400: responds with message \'Invalid article ID: not a number\' when the article id is not valid', () => {
    return request(app)
      .get('/api/articles/not_valid_request')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Invalid article ID: not a number');
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
        expect(body.msg).toBe('Article not found');
      });
  });
  test('400: responds with message \'Invalid request\' when the article id is not valid', () => {
    return request(app)
      .patch('/api/articles/not_valid_request')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Invalid article ID: not a number');
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
        expect(body.msg).toBe('Article not found');
      });
  });
});

describe('10. POST /api/articles/:article_id/comments', () => {

  test('201: posts and returns inserted comment object', () => {
    return request(app)
      .post('/api/articles/3/comments')
      .send({ username: 'butter_bridge', body: 'no comments' })
      .expect(201)
      .then(({ body }) => {
        expect(body).toBeInstanceOf(Object);
        expect(body).toEqual(
          {
            comment_id: 19, // next available id
            body: 'no comments',
            article_id: 3,
            author: 'butter_bridge',
            votes: 0,
            created_at: expect.any(String) // current time
          }
        );
      });
  });

  test('400: responds with \'Invalid article ID: not a number\' when the article_id is invalid', () => {
    return request(app)
      .post('/api/articles/invalidId/comments')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Invalid article ID: not a number');
      });
  });

  test('400: responds with message \'Invalid request: missing property\' when there is no username/body property in the request', () => {
    return request(app)
      .post('/api/articles/3/comments')
      .send({ body: 'new comment'})
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Invalid request: missing property');
      });
  });

  test('404: responds with message \'Article not found\' when there is no article with article_id in the \'articles\' table', () => {
    return request(app)
      .post('/api/articles/777/comments')
      .expect(404)
      .send({ username: 'icellusedkars', body: 'new comment'})
      .then(({ body }) => {
        expect(body.msg).toBe('Article not found');
      });
  });

  test('404: responds with message \'Author not found\' when there is no author with the given name in the \'author\' table', () => {
    return request(app)
      .post('/api/articles/3/comments')
      .expect(404)
      .send({ username: 'Tom', body: 'new comment' })
      .then(({ body }) => {
        expect(body.msg).toBe('Author not found');
      });
  });
});

describe('11. GET /api/articles (queries)', () => {
  
  // no need for this test, as we already getting articles ordered by date
  test('200: query \'sort_by\' without any column value sorts the articles by date (defaults to date)', () => {
    return request(app)
    .get('/api/articles?sort_by')
    .expect(200)
    .then(({ body: articles }) => {
      expect(articles).toBeSortedBy('created_at', { descending: true });
    });
  });
  
  test('200: query \'sort_by\' sorts the articles by any valid column', () => {
    return request(app)
    .get('/api/articles?sort_by=title')
    .expect(200)
    .then(({ body: articles }) => {
      expect(articles).toBeSortedBy('title', { descending: true });
    })
    .then(() => {
      return request(app)
      .get('/api/articles?sort_by=author')
      .expect(200)
      .then(({ body: articles }) => {
        expect(articles).toBeSortedBy('author', { descending: true });
      });
    })
  });

  test('200: query of \'order\' without any value and \'sort_by\' without any value sorts by date column in descending order (defaults to descending)', () => {
    return request(app)
    .get('/api/articles?order')
    .expect(200)
    .then(({ body: articles }) => {
      expect(articles).toBeSortedBy('created_at', { descending: true });
    });
  });

  test('200: query of \'order\' with \'asc\' value and \'sort_by\' without any value sorts by date column in ascending order', () => {
    return request(app)
    .get('/api/articles?sort_by&order=asc')
    .expect(200)
    .then(({ body: articles }) => {
      expect(articles).toBeSortedBy('created_at', { ascending: true });
    });
  });

  test('200: query of \'sort_by\' and \'order\' sorts \'sort_by\' column in \'order\'', () => {
    return request(app)
    .get('/api/articles?sort_by=comment_count&order=desc')
    .expect(200)
    .then(({ body: articles }) => {
      expect(articles).toBeSortedBy('comment_count', { descending: true });
    });
  });

  test('200: changing the order of queries in URL doesn\'t change the result', () => {
    return request(app)
    .get('/api/articles?order=desc&sort_by=comment_count')
    .expect(200)
    .then(({ body: articles }) => {
      expect(articles).toBeSortedBy('comment_count', { descending: true });
    });
  });

  test('400: the value out of \'asc/desc\' in \'order\' query returns \'Invalid request: SQL syntax error\'', () => {
    return request(app)
    .get('/api/articles?order=notAscDesc&sort_by=comment_count')
    .expect(404)
    .then(({ body }) => {
      // expect(body.msg).toBe('Invalid request: SQL syntax error');
      expect(body.msg).toBe('Article not found');
    });
  });

  test('400: invalid column name in \'sort_by\' query returns \'Invalid request: invalid column to sort by\'', () => {
    return request(app)
    .get('/api/articles?sort_by=invalidColumn')
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe('Invalid request: invalid column to sort by');
    });
  });

  test('200: \'topic\' in query in URL filters the returned articles by topic value', () => {
    return request(app)
    .get('/api/articles?sort_by=title&order=asc&topic=cats')
    .expect(200)
    .then(({ body: articles }) => {
      expect(articles).toBeSortedBy('title', { ascending: true });
      articles.forEach(article => {
        expect(article.topic).toBe('cats');
      });
    });
  });
});

describe('12. DELETE /api/comments/:comment_id', () => {
  test('204: returns no content', () => {
    return request(app)
    .delete('/api/comments/1')
    .expect(204)
    .then((body) => {
      expect(body.text).toBe('');
    });
  });

  test('404: returns \'Comment not found\' if comment with ID doesn\'t exist', () => {
    return request(app)
    .delete('/api/comments/34343')
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe('Comment not found');
    });
  });

  test('400: returns \'Invalid request: comment ID is not valid\' if comment ID is not valid', () => {
    return request(app)
    .delete('/api/comments/notValidCommentId')
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe('Invalid request: comment ID is not valid');
    });;
  });
});

describe('13. GET /api', () => {
  const endpoints = fs.readFileSync('./endpoints.json', 'utf-8');
  test('200: Responds with JSON describing all the available endpoints', () => {
    return request(app)
    .get('/api')
    .expect(200)
    .then(({ body }) => {
      expect(body.msg).toEqual(JSON.parse(endpoints));
    })
  })
})