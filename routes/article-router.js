const articleRouter = require("express").Router();
const { getArticles, getArticleById, patchArticleById } = require("../controllers/articles.controllers");
const { getCommentsByArticleId, postCommentByArticleId } = require("../controllers/comments.controllers");

articleRouter
.route("/")
.get(getArticles);

articleRouter
.route("/:article_id/comments")
.get(getCommentsByArticleId)
.post(postCommentByArticleId);

articleRouter
.route("/:article_id")
.get(getArticleById)
.patch(patchArticleById)

module.exports = articleRouter;