const { selectCommentsByArticleId } = require("../models/comments.model");

const getCommentsByArticleId = (request, response, next) => {
    const { article_id } = request.params;
    const limit = Number(request.query.limit) || 10;
    const page = Number(request.query.p) || 1;

    selectCommentsByArticleId(article_id, limit, page)
        .then((comments) => response.status(200).send({ comments }))
        .catch(next);
};

module.exports = { getCommentsByArticleId };
