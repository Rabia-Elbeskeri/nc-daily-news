const { updateUser } = require("../models/users.model");

const patchUser = (request, response, next) => {
    const { username } = request.params;
    const { name, avatar_url } = request.body;

    updateUser(username, name, avatar_url)
        .then((user) => response.status(200).send({ user }))
        .catch(next);
};

module.exports = { patchUser };
