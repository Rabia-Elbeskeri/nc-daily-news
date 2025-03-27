const db = require("../db/connection");
//Task 7,8, 9,10, 16,21
exports.selectCommentsByArticleId = (article_id, limit = 10, p = 1) => {
    if (isNaN(article_id)) {
        return Promise.reject({ status: 400, msg: "Invalid input" });
    }

    const offset = (p - 1) * limit;

    return db.query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({ status: 404, msg: "Article not found" });
            }

            return db.query(
                `SELECT * FROM comments
                 WHERE article_id = $1
                 ORDER BY created_at DESC
                     LIMIT $2 OFFSET $3;`,
                [article_id, limit, offset]
            );
        })
        .then(({ rows }) => rows);
};



exports.insertCommentByArticleId = (article_id, username, body) => {
    if (!username || !body) {
        return Promise.reject({ status: 400, msg: "Missing required fields" });
    }

    return db.query(
        `INSERT INTO comments (author, article_id, body)
         VALUES ($1, $2, $3)
             RETURNING *;`,
        [username, article_id, body]
    ).then(({ rows }) => rows[0]);
};


exports.updateCommentVotes = (comment_id, inc_votes) => {
    if (typeof inc_votes !== "number") {
        return Promise.reject({ status: 400, msg: "Invalid input" });
    }

    return db.query(
        `UPDATE comments
         SET votes = votes + $1
         WHERE comment_id = $2
             RETURNING *;`,
        [inc_votes, comment_id]
    ).then(({ rows }) => {
        if (rows.length === 0) {
            return Promise.reject({ status: 404, msg: "Comment not found" });
        }
        return rows[0];
    });
};


exports.removeCommentById = (comment_id) => {
    if (isNaN(comment_id)) {
        return Promise.reject({ status: 400, msg: "Invalid input" });
    }

    return db.query(
        `DELETE FROM comments
         WHERE comment_id = $1
             RETURNING *;`,
        [comment_id]
    ).then(({ rows }) => {
        if (rows.length === 0) {
            return Promise.reject({ status: 404, msg: "Comment not found" });
        }
    });
};


exports.selectAllComments = (sort_by = "created_at", order = "desc", limit = 10, p = 1) => {
    const validSorts = ["created_at", "votes", "comment_id"];

    if (!validSorts.includes(sort_by)) {
        return Promise.reject({ status: 400, msg: "Invalid sort_by query" });
    }

    if (!["asc", "desc"].includes(order)) {
        return Promise.reject({ status: 400, msg: "Invalid order" });
    }

    const parsedLimit = parseInt(limit, 10);
    const parsedPage = parseInt(p, 10);

    if (isNaN(parsedLimit) || parsedLimit <= 0) {
        return Promise.reject({ status: 400, msg: "Invalid limit query" });
    }

    if (isNaN(parsedPage) || parsedPage <= 0) {
        return Promise.reject({ status: 400, msg: "Invalid page query" });
    }

    const offset = (parsedPage - 1) * parsedLimit;

    return db.query(
        `SELECT * FROM comments
         ORDER BY ${sort_by} ${order}
         LIMIT $1 OFFSET $2;`,
        [parsedLimit, offset]
    ).then(({ rows }) => rows);
};

