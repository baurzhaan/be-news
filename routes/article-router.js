const articleRouter = require("express").Router();
const { getArticles, getArticleById, patchArticleById } = require("../controllers/articles.controllers");
const { getCommentsByArticleId, postCommentByArticleId } = require("../controllers/comments.controllers");


articleRouter.get("/", getArticles);
articleRouter.get("/:article_id", getArticleById);
articleRouter.get("/:article_id/comments", getCommentsByArticleId);
articleRouter.patch('/:article_id', patchArticleById);
articleRouter.post('/:article_id/comments', postCommentByArticleId);

module.exports = articleRouter;