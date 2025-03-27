const { selectAllArticles } = require("../models/articles.model");

const getArticles = (request, response, next) => {
    const { topic, sort_by, order, limit, p, author } = request.query;

    selectAllArticles(topic, sort_by, order, limit, p, author)
        .then(({ articles, total_count }) => {
            response.status(200).send({ articles, total_count });
        })
        .catch(next);
};

module.exports = getArticles;

