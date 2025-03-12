const db = require("../db/connection");

exports.updateArticleVotes = (article_id, inc_votes) => {
    if (!Number.isInteger(Number(article_id))) {
        return Promise.reject({ status: 400, msg: "Invalid input" });
    }

    return db
        .query(
            `UPDATE articles
             SET votes = votes + $1
             WHERE article_id = $2
                 RETURNING *;`,
            [inc_votes, article_id]
        )
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({ status: 404, msg: "Article not found" });
            }
            return rows[0];
        });
};


