const commentRouter = require("express").Router();
const { deleteCommentById, patchCommentById } = require("../controllers/comments.controllers");

commentRouter
.route("/:comment_id")
.delete(deleteCommentById);

commentRouter
.route("/:comment_id")
.patch(patchCommentById);

module.exports = commentRouter;