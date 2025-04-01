const { insertTopic } = require("../models/topics.model");

const postTopic = (request, response, next) => {
    const { slug, description, img_url } = request.body;

    insertTopic(slug, description, img_url)
        .then((topic) => response.status(201).send({ topic }))
        .catch(next);
};

module.exports = { postTopic };




