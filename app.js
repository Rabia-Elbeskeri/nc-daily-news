const express = require("express");
const app = express();


const getEndpoints = require("./controllers/api.controllers");
const getTopics = require("./controllers/topics.controllers");
const getArticleById = require("./controllers/articleById.controllers");
const  getArticles  = require("./controllers/articles.controllers");





const {
    handleNonExistantEndpoint,
    handlePSQLErrors,
    handleCustomErrors,
    handleServerErrors
} = require("./controllers/errors.controllers");



app.use(express.json());



app.get("/api", getEndpoints);
app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles", getArticles);

app.all("*", handleNonExistantEndpoint);

app.use(handlePSQLErrors);


app.use(handleCustomErrors);


app.use(handleServerErrors);



module.exports = app;









