const { updateCommentVotes } = require("../models/comments.model");

const patchCommentVotes = (request, response, next) => {
    const { comment_id } = request.params;
    const { inc_votes } = request.body;

    updateCommentVotes(comment_id, inc_votes)
        .then((comment) => response.status(200).send({ comment }))
        .catch(next);
};

module.exports = { patchCommentVotes };
