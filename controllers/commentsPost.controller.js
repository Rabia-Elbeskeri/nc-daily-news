const { insertCommentByArticleId } = require("../models/commentsPost.model");


exports.postCommentByArticleId = (req, res, next) => {
    const { article_id } = req.params;
    const { username, body } = req.body;

    if (!username || !body) {
        return next({ status: 400, msg: "Missing required fields" });
    }
    insertCommentByArticleId(article_id, username, body)
        .then((newComment) => {
            res.status(201).send({ comment: newComment });
        })
        .catch(next);
};


