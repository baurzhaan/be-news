const apiRouter = require("express").Router();
const topicRouter = require("./topic-router");
const userRouter = require("./user-router");
const articleRouter = require("./article-router");
const commentRouter = require("./comment-router");
const { getApi } = require("../controllers/get-api.controller");

apiRouter.get("/", getApi);
apiRouter.use("/topics", topicRouter);
apiRouter.use("/users", userRouter);
apiRouter.use("/articles", articleRouter);
apiRouter.use("/comments", commentRouter);

module.exports = apiRouter;