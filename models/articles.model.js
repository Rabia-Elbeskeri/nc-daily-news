const db = require("../db/connection");


exports.selectArticleById = (article_id) => {
    return db.query(
        `SELECT articles.*, COUNT(comments.comment_id)::INT AS comment_count
         FROM articles
                  LEFT JOIN comments ON comments.article_id = articles.article_id
         WHERE articles.article_id = $1
         GROUP BY articles.article_id;`,
        [article_id]
    ).then(({ rows }) => {
        if (rows.length === 0) {
            return Promise.reject({ status: 404, msg: "Article not found" });
        }
        return rows[0];
    });
};


exports.updateArticleVotes = (article_id, inc_votes) => {
    return db.query(
        `UPDATE articles
         SET votes = votes + $1
         WHERE article_id = $2
             RETURNING *;`,
        [inc_votes, article_id]
    ).then(({ rows }) => {
        if (rows.length === 0) {
            return Promise.reject({ status: 404, msg: "Article not found" });
        }
        return rows[0];
    });
};


exports.selectAllArticles = (topic, sort_by = "created_at", order = "desc", limit = 10, p = 1, author) => {
    const validSorts = ["title", "article_id", "votes", "created_at", "comment_count"];
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
    const queryParams = [];
    const conditions = [];

    if (topic) {
        queryParams.push(topic);
        conditions.push(`articles.topic = $${queryParams.length}`);
    }

    if (author) {
        queryParams.push(author);
        conditions.push(`articles.author = $${queryParams.length}`);
    }

    const finalQuery = () => {
        const countQuery = `
            SELECT COUNT(*)::INT AS total_count
            FROM articles
            ${conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : ""}
        `;

        const articlesQuery = `
            SELECT articles.*, COUNT(comments.comment_id)::INT AS comment_count
            FROM articles
            LEFT JOIN comments ON comments.article_id = articles.article_id
            ${conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : ""}
            GROUP BY articles.article_id
            ORDER BY ${sort_by} ${order}
            LIMIT $${queryParams.length + 1}
            OFFSET $${queryParams.length + 2};
        `;

        return Promise.all([
            db.query(articlesQuery, [...queryParams, parsedLimit, offset]),
            db.query(countQuery, queryParams)
        ]).then(([articlesResult, countResult]) => {
            return {
                articles: articlesResult.rows,
                total_count: countResult.rows[0].total_count
            };
        });
    };

    if (topic) {
        return db.query(`SELECT * FROM topics WHERE slug = $1`, [topic])
            .then(({ rows }) => {
                if (rows.length === 0) {
                    return Promise.reject({ status: 404, msg: "Topic not found" });
                }
                return finalQuery();
            });
    }

    return finalQuery();
};


exports.insertArticle = (author, title, body, topic, article_img_url = "") => {
    if (!author || !title || !body || !topic) {
        return Promise.reject({ status: 400, msg: "Missing required fields" });
    }

    return db.query(
        `INSERT INTO articles (author, title, body, topic, article_img_url)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *;`,
        [author, title, body, topic, article_img_url]
    ).then(({ rows }) => rows[0]);
};


exports.selectArticleCommentCount = (article_id) => {
    return db.query(
        `SELECT articles.*, COUNT(comments.comment_id)::INT AS comment_count
         FROM articles
         LEFT JOIN comments ON comments.article_id = articles.article_id
         WHERE articles.article_id = $1
         GROUP BY articles.article_id;`,
        [article_id]
    ).then(({ rows }) => {
        if (rows.length === 0) {
            return Promise.reject({ status: 404, msg: "Article not found" });
        }
        return rows[0];
    });
};


exports.removeArticleById = (article_id) => {
    return db.query(
        `DELETE FROM articles
         WHERE article_id = $1
         RETURNING *;`,
        [article_id]
    ).then(({ rows }) => {
        if (rows.length === 0) {
            return Promise.reject({ status: 404, msg: "Article not found" });
        }
    });
};
