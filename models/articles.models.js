const db = require('../db/connection.js');

exports.selectArticles = (query) => {
  const sort_by = query.sort_by ? query.sort_by : 'created_at';
  const order = query.order ? query.order.toUpperCase() : 'DESC';
  const topicWhereCondition = query.topic ? `WHERE topic = '${query.topic}'` : "";
  const sqlQuery = `SELECT articles.article_id, articles.author, articles.created_at, articles.title, articles.topic, articles.votes, COUNT(comments.article_id) comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id ${topicWhereCondition} GROUP BY articles.article_id ORDER BY ${sort_by} ${order};` 
  return db.query(sqlQuery)
  .then(({ rows: articleRows }) => {
    return articleRows;
  })
  .catch((error) => {
    if (error.code === '42601') {
      // return Promise.reject({ code: 'sqlSyntaxError'}); // order is not ASC/DESC
      return Promise.reject({ code: 'articleNotFound'}); // order is not ASC/DESC
    } else if (error.code === '42703') {
      // return Promise.reject({ code: 'sqlUndefinedColumn'}); // invalid column name
      return Promise.reject({ code: 'articleNotFound'}); // invalid column name
    }
  })
};

exports.selectArticleById = (articleId) => {
  if (isNaN(articleId)) {
    return Promise.reject({ code: 'articleIdisNaN'});
  } 
  const sqlQuery = 'SELECT articles.*, COUNT(comments.article_id) comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id;';
  return db.query(sqlQuery, [articleId])
  .then(({ rows: articleRows }) => {
    if (articleRows.length) return articleRows[0];
    return Promise.reject({ code: 'articleNotFound'});
  })
  .catch((error) => { 
    if (error.code === 'articleNotFound') return Promise.reject({ code: 'articleNotFound'});
    // return Promise.reject({ code: 'sqlSyntaxError', msg: 'something wrong with above SQL - COUNT statement'});
  })
};

exports.updateArticleById = (articleId, { inc_votes }) => {
  if (isNaN(articleId)) {
    return Promise.reject({ code: 'articleIdisNaN'});
  }
  const sqlQuery = 'UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *';
  return db.query(sqlQuery, [inc_votes, articleId])
    .then(({ rows: articleRows }) => {
      if (articleRows.length) return articleRows[0];
      return Promise.reject({ code: 'articleNotFound' });
    })
};

exports.insertArticle = ({author, title, body, topic}) => {
  if (!title) {
    return Promise.reject({ code: 'ArticleTitleIsFalsy'});
  };
  if (!topic) {
    return Promise.reject({ code: 'ArticleTopicIsFalsy'});
  };
  if (!author) {
    return Promise.reject({ code: 'ArticleAuthorIsFalsy'});
  };
  if (!body) {
    return Promise.reject({ code: 'ArticleBodyIsFalsy'});
  };
  const sqlQuery = 'INSERT INTO articles (author, title, body, topic) VALUES ($1, $2, $3, $4) RETURNING *';
  return db.query(sqlQuery, [author, title, body, topic])
  .then(({ rows }) => {
    if (rows.length) {
      const insertedArticle = {...rows[0], comment_count: 0};
      return insertedArticle;
    }
  // return error promise
  })
  .catch((error) => {
    switch (error.code) {
      case '23503':
        if (error.detail.startsWith('Key (author)=(no_user)')) return Promise.reject({ code: 'authorNotFound'});
        if (error.detail.startsWith('Key (topic)=(no_topic)')) return Promise.reject({ code: 'topicNotFound'});
    };
  })
}