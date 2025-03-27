const { insertCommentByArticleId } = require("../models/comments.model");

const postCommentByArticleId = (request, response, next) => {
    const { article_id } = request.params;
    const { username, body } = request.body;

    insertCommentByArticleId(article_id, username, body)
        .then((comment) => response.status(201).send({ comment }))
        .catch(next);
};

module.exports = { postCommentByArticleId };
