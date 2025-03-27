const { removeCommentById } = require("../models/comments.model");

const deleteCommentById = (request, response, next) => {
    const { comment_id } = request.params;
    removeCommentById(comment_id)
        .then(() => response.status(204).send())
        .catch(next);
};

module.exports = { deleteCommentById };
