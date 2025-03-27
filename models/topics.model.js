const db = require("../db/connection");

// Task 2, 17
exports.selectTopics = () => {
    return db.query("SELECT * FROM topics;").then(({ rows }) => rows);
};

exports.insertTopic = (slug, description, img_url = "") => {
    if (!slug || !description) {
        return Promise.reject({ status: 400, msg: "Missing required fields" });
    }

    return db.query(
        `INSERT INTO topics (slug, description, img_url)
         VALUES ($1, $2, $3)
             RETURNING *;`,
        [slug, description, img_url || ""]
    ).then(({ rows }) => rows[0]);
};
