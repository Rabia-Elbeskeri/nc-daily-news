const { insertTopic } = require("../models/topics.model");

const postTopic = (request, response, next) => {
    const { slug, description } = request.body;

    insertTopic(slug, description)
        .then((topic) => response.status(201).send({ topic }))
        .catch(next);
};

module.exports = { postTopic };
