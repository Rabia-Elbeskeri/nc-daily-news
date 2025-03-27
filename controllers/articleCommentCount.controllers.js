const { selectArticleCommentCount } = require("../models/articles.model");

const getArticleCommentCount = (request, response, next) => {
    const { article_id } = request.params;

    selectArticleCommentCount(article_id)
        .then((article) => response.status(200).send({ article }))
        .catch(next);
};

module.exports = { getArticleCommentCount };
