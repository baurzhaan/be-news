exports.getApi = (_request, response, next) => {
  result = {
    "GET /api": {
      "description": "serves up a json representation of all the available endpoints of the api"
    },
    "GET /api/topics": {
      "description": "serves an array of all topics",
      "queries": [],
      "exampleResponse": {
        "topics": [{ "slug": "football", "description": "Footie!" }]
      }
    },
    "GET /api/articles": {
      "description": "serves an array of all articles",
      "queries": ["title", "topic", "author", "body", "created_at", "votes"],
      "exampleResponse": {
        "articles": [
          {
            "title": "Living in the shadow of a great man",
            "topic": "mitch",
            "author": "butter_bridge",
            "body": "I find this existence challenging",
            "created_at": 1594329060000,
            "votes": 100
          }
        ]
      }
    },
    "GET /api/users": {
      "description": "serves an array of all users",
      "queries": ["username", "name", "avatar_url"],
      "exampleResponse": {
        "users": [
          {
            "username": "butter_bridge",
            "name": "jonny",
            "avatar_url":
      "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg"
          }
        ]
      }
    },
    "GET /api/articles/:article_id": {
      "description": "gets an article by it's id",
      "queries": ["title", "topic", "author", "body", "created_at", "votes"],
      "exampleResponse": {
        "article": [
          {
            "title": "Living in the shadow of a great man",
            "topic": "mitch",
            "author": "butter_bridge",
            "body": "I find this existence challenging",
            "created_at": 1594329060000,
            "votes": 100
          }
        ]
      }
    },
    "GET /api/articles/:article_id/comments": {
      "description": "gets a comment by article's id",
      "queries": ["body", "votes", "author", "article_id", "created_at"],
      "exampleResponse": {
        "comment": [
          {
            "body": "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
            "votes": 16,
            "author": "butter_bridge",
            "article_id": 9,
            "created_at": 1586179020000
          }
        ]
      }
    },
    "PATCH /api/articles/:article_id": {
      "description": "updates an article by it's id",
      "queries": ["title", "topic", "author", "body", "created_at", "votes"],
      "exampleResponse": {
        "article": [
          {
            "title": "Living in the shadow of a great man",
            "topic": "mitch",
            "author": "butter_bridge",
            "body": "I find this existence challenging",
            "created_at": 1594329060000,
            "votes": 100
          }
        ]
      }
    },
    "POST api/articles/:article_id/comments": {
      "description": "inserts an article by it's id",
      "queries": ["title", "topic", "author", "body", "created_at", "votes"],
      "exampleResponse": {
        "article": [
          {
            "title": "Living in the shadow of a great man",
            "topic": "mitch",
            "author": "butter_bridge",
            "body": "I find this existence challenging",
            "created_at": 1594329060000,
            "votes": 100
          }
        ]
      }
    },
    "DELETE /api/comments/:comment_id": {
      "description": "deletes a comment by it's id",
      "queries": ["body", "votes", "author", "article_id", "created_at"],
      "exampleResponse": ""
    }
  }

  response.status(200).send( JSON.stringify(JSON.parse({ msg: result }), null, 2) );
}
