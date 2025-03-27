const { updateArticleVotes } = require("../models/articles.model");

const patchArticleById = (request, response, next) => {
    const { article_id } = request.params;
    const { inc_votes } = request.body;


    if (inc_votes === undefined || typeof inc_votes !== "number") {
        return response.status(400).send({ msg: "Invalid input" });
    }

    updateArticleVotes(article_id, inc_votes)
        .then((article) => {
            response.status(200).send({ article });
        })
        .catch(next);
};

module.exports = { patchArticleById };
