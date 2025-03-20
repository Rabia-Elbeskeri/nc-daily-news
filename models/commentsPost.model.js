const db = require("../db/connection");

exports.insertCommentByArticleId = (article_id, username, body) => {
    if (!Number.isInteger(Number(article_id))) {
        return Promise.reject({ status: 400, msg: "Invalid input" });
    }

    return db
        .query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({ status: 404, msg: "Article not found" });
            }
        })
        .then(() => {
            return db.query(`SELECT * FROM users WHERE username = $1;`, [username]);
        })
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({ status: 404, msg: "User not found" });
            }
        })
        .then(() => {
            return db.query(
                `INSERT INTO comments (article_id, author, body, votes, created_at)
                 VALUES ($1, $2, $3, 0, NOW()) RETURNING *;`,
                [article_id, username, body]
            );
        })
        .then(({ rows }) => {
            return rows[0];
        });
};
