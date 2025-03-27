const express = require("express");
const app = express();

const getEndpoints = require("./controllers/api.controller");
const getTopics = require("./controllers/topics.controller");
const getArticleById = require("./controllers/articleById.controllers");
const getArticles = require("./controllers/articles.controller");
const { getCommentsByArticleId } = require("./controllers/comments.controller");
const { postCommentByArticleId } = require("./controllers/commentsPost.controller");
const { patchArticleById } = require("./controllers/articlesPatch.controller");
const { deleteCommentById } = require("./controllers/deleteComment.controller");

const { getUsers, getUserByUsername } = require("./controllers/users.controller");
const { getArticleCommentCount } = require("./controllers/articleCommentCount.controllers");
const { postArticle } = require("./controllers/articlesPost.controller");
const { patchCommentVotes } = require("./controllers/commentsPatch.controller");

const { deleteArticleById } = require("./controllers/articlesDelete.controller");
const { getAllComments } = require("./controllers/commentsAll.controller");
const { postTopic } = require("./controllers/topicsPost.controller");
const { postUser } = require("./controllers/usersPost.controller");
const { patchUser } = require("./controllers/usersPatch.controller");

const {
    handleNonExistentEndpoint,
    handlePSQLErrors,
    handleCustomErrors,
    handleServerErrors,
} = require("./controllers/errors.controller");

app.use(express.json());

// API routes
app.get("/api", getEndpoints);
app.get("/api/topics", getTopics);
// Task 17
app.post("/api/topics", postTopic);
app.get("/api/users", getUsers);
// Task 18
app.post("/api/users", postUser);
app.get("/api/users/:username", getUserByUsername);
// Task 19
app.patch("/api/users/:username", patchUser);
// Task 15, 20, 22 included
app.get("/api/articles", getArticles);
app.post("/api/articles", postArticle);
app.get("/api/articles/:article_id", getArticleById);
app.patch("/api/articles/:article_id", patchArticleById);
app.delete("/api/articles/:article_id", deleteArticleById); // Task 14
app.get("/api/articles/:article_id/comment-count", getArticleCommentCount);
// Task 16
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.post("/api/articles/:article_id/comments", postCommentByArticleId);
// Task 21
app.get("/api/comments", getAllComments);
app.patch("/api/comments/:comment_id", patchCommentVotes);
app.delete("/api/comments/:comment_id", deleteCommentById);


app.all("*", handleNonExistentEndpoint);
app.use(handlePSQLErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;









