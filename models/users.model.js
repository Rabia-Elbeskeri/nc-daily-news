const db = require("../db/connection");

// Task 5, 11, 18, 19

exports.selectAllUsers = () => {
    return db.query("SELECT * FROM users;").then(({ rows }) => rows);
};

exports.selectUserByUsername = (username) => {
    return db.query("SELECT * FROM users WHERE username = $1;", [username])
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({ status: 404, msg: "User not found" });
            }
            return rows[0];
        });
};

exports.insertUser = (username, name, avatar_url) => {
    return db.query(
        `INSERT INTO users (username, name, avatar_url)
         VALUES ($1, $2, $3)
             RETURNING *;`,
        [username, name, avatar_url]
    ).then(({ rows }) => rows[0]);
};

exports.updateUser = (username, name, avatar_url) => {
    return db.query(
        `UPDATE users
         SET name = COALESCE($1, name),
             avatar_url = COALESCE($2, avatar_url)
         WHERE username = $3
             RETURNING *;`,
        [name, avatar_url, username]
    ).then(({ rows }) => {
        if (rows.length === 0) {
            return Promise.reject({ status: 404, msg: "User not found" });
        }
        return rows[0];
    });
};
