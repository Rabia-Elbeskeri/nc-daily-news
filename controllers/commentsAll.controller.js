const { selectAllComments } = require("../models/comments.model");

const getAllComments = (request, response, next) => {
    const { sort_by, order, limit, p } = request.query;

    selectAllComments(sort_by, order, limit, p)
        .then((comments) => response.status(200).send({ comments }))
        .catch(next);
};

module.exports = { getAllComments };
