const { removeArticleById } = require("../models/articles.model");

const deleteArticleById = (request, response, next) => {
    const { article_id } = request.params;

    removeArticleById(article_id)
        .then(() => response.status(204).send())
        .catch(next);
};

module.exports = { deleteArticleById };
