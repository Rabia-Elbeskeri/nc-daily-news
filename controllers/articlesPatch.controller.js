const { updateArticleVotes } = require("../models/articlesPatch.model");

exports.patchArticleById = (req, res, next) => {
    const { article_id } = req.params;
    const { inc_votes } = req.body;

    if (typeof inc_votes !== "number") {
        return next({ status: 400, msg: "Invalid input" });
    }

    updateArticleVotes(article_id, inc_votes)
        .then((updatedArticle) => {
            res.status(200).send({ article: updatedArticle });
        })
        .catch(next);
};
