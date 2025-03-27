const { insertUser } = require("../models/users.model");

const postUser = (request, response, next) => {
    const { username, name, avatar_url } = request.body;

    insertUser(username, name, avatar_url)
        .then((user) => response.status(201).send({ user }))
        .catch(next);
};

module.exports = { postUser };
