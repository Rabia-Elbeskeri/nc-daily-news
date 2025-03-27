const { insertArticle } = require("../models/articles.model");

const postArticle = (request, response, next) => {
    const { author, title, body, topic } = request.body;
    insertArticle(author, title, body, topic)
        .then((article) => response.status(201).send({ article }))
        .catch(next);
};

module.exports = { postArticle };
