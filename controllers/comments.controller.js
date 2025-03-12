
const { fetchCommentsByArticleId } = require("../models/comments.model");

exports.getCommentsByArticleId = (req, res, next) => {
    const { article_id } = req.params;

    if (isNaN(article_id)) {
        return next({ status: 400, msg: "Invalid article ID" });
    }

    fetchCommentsByArticleId(article_id)
        .then((comments) => {
            res.status(200).send({ comments: comments || [] });
        })
        .catch(next);
};


// const { fetchCommentsByArticleId } = require("../models/comments.model");
// const { fetchArticleById } = require("../models/articlesById.models");
// // const { insertCommentByArticleId } = require("../models/comments.model");
//
// exports.getCommentsByArticleId = (req, res, next) => {
//     const { article_id } = req.params;
//
//     if (Number.isNaN(Number(article_id))) {
//         return next({ status: 400, msg: "Invalid article ID" });
//     }
//     fetchArticleById(article_id)
//         .then(() => {
//             return fetchCommentsByArticleId(article_id);
//         })
//         .then((comments) => {
//
//             res.status(200).send({ comments: comments || [] });
//         })
//         .catch(next);
// };









