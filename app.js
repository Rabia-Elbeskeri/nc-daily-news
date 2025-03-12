const express = require("express");
const app = express();

const getEndpoints = require("./controllers/api.controllers");
const getTopics = require("./controllers/topics.controllers");
const getArticleById = require("./controllers/articleById.controllers");
const getArticles = require("./controllers/articles.controllers");
const { getCommentsByArticleId } = require("./controllers/comments.controller");
const { postCommentByArticleId } = require("./controllers/commentsPost.controller");
const  { patchArticleById }  = require("./controllers/articlesPatch.controller");
const { deleteCommentById } = require("./controllers/deleteComment.controller");

const {
    handleNonExistantEndpoint,
    handlePSQLErrors,
    handleCustomErrors,
    handleServerErrors,
} = require("./controllers/errors.controllers");

app.use(express.json());

app.get("/api", getEndpoints);
app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.post("/api/articles/:article_id/comments", postCommentByArticleId );
app.patch("/api/articles/:article_id",   patchArticleById  );
app.delete("/api/comments/:comment_id", deleteCommentById);


app.all("*", handleNonExistantEndpoint);

app.use(handlePSQLErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);
app.use(handleNonExistantEndpoint);


module.exports = app;










