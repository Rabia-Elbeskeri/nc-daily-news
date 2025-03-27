const { selectArticleById } = require("../models/articles.model");

const getArticleById = (request, response, next) => {
    const { article_id } = request.params;

    if (isNaN(article_id)) {
        return next({ status: 400, msg: "Invalid input" });
    }

    selectArticleById(article_id)
        .then((article) => {
            response.status(200).send({ article });
        })
        .catch(next);
};

module.exports = getArticleById;
