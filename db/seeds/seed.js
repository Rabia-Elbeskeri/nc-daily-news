const db = require("../connection");
const format = require("pg-format");

const { convertTimestampToDate } = require("./utils");
const { articleData, commentData, topicData, userData } = require('../data/test-data/index.js');
console.log(articleData.length, commentData.length, topicData.length, userData.length);
const data = require('../data/test-data');
console.log("Loaded test-data keys:", Object.keys(data));

const seed = ({ topicData, userData, articleData, commentData }) => {
    return db
        .query("DROP TABLE IF EXISTS comments;")
        .then(() => db.query("DROP TABLE IF EXISTS articles;"))
        .then(() => db.query("DROP TABLE IF EXISTS users;"))
        .then(() => db.query("DROP TABLE IF EXISTS topics;"))
        .then(() => {
            return db.query(`CREATE TABLE topics
                (
                    slug        VARCHAR(50) PRIMARY KEY,
                    description VARCHAR(1000) NOT NULL,
                    img_url VARCHAR(1000) NOT NULL
                             );`);
        })
        .then(() => {
            return db.query(`
                CREATE TABLE users
                (
                    username   VARCHAR(50) PRIMARY KEY,
                    name VARCHAR(100) NOT NULL,
                    avatar_url VARCHAR(1000) NOT NULL
                );`);
        })
        .then(() => {
            return db.query(`
                CREATE TABLE articles
                (
                    article_id      SERIAL PRIMARY KEY,
                    title VARCHAR(255) NOT NULL,
                    topic    VARCHAR(50) REFERENCES topics (slug) ON DELETE CASCADE,
                    author      VARCHAR(50) REFERENCES users (username) ON DELETE CASCADE,
                    body            TEXT NOT NULL,
                    created_at    TIMESTAMP DEFAULT NOW(),
                    votes           INT       DEFAULT 0,        
                    article_img_url VARCHAR(1000) NOT NULL

                );`);
        })

        .then(() => {
            return db.query(`
                CREATE TABLE comments
                (
                    comment_id SERIAL PRIMARY KEY,
                    article_id INT REFERENCES articles (article_id) ON DELETE CASCADE,
                    body       TEXT NOT NULL,
                    votes      INT       DEFAULT 0,
                    author     VARCHAR(50) REFERENCES users (username) ON DELETE CASCADE,
                    created_at TIMESTAMP DEFAULT NOW()
                );`);
        })
        .then(() => {
            const topicValues = topicData.map(({ slug, description, img_url }) => [slug, description, img_url]);
            const topicQuery = format(`INSERT INTO topics (slug, description, img_url) VALUES %L RETURNING *;`, topicValues);
            return db.query(topicQuery);
        })
        .then(() => {
            const userValues = userData.map(({ username, name, avatar_url }) => [username, name, avatar_url]);
            const userQuery = format(`INSERT INTO users (username, name, avatar_url) VALUES %L RETURNING *;`, userValues);
            return db.query(userQuery);
        })
        .then(() => {
            const formattedArticleData = articleData.map(convertTimestampToDate);
            const formattedArticlesValues = formattedArticleData.map(({ title, topic, author, body, created_at, votes, article_img_url }) => {
                return [title, topic, author, body, created_at, votes, article_img_url];
            });
            const articleQuery = format(`INSERT INTO articles (title, topic, author, body, created_at, votes, article_img_url) VALUES %L RETURNING *;`, formattedArticlesValues);
            return db.query(articleQuery);
        })

        .then(({ rows: insertedArticles }) => {
            const articleTitleToIdMap = {};

            insertedArticles.forEach(({ title, article_id }) => {
                articleTitleToIdMap[title] = article_id;
            });

            const formattedCommentData = commentData.map(convertTimestampToDate);
            const formattedCommentValues = formattedCommentData
                .map(({ article_title, body, votes, author, created_at }) => {
                    const article_id = articleTitleToIdMap[article_title];
                    return [article_id, body, votes, author, created_at];
                });

            const commentQuery = format(
                `INSERT INTO comments (article_id, body, votes, author, created_at)
                 VALUES %L RETURNING *;`,
                formattedCommentValues
            );

            return db.query(commentQuery);
        });

};


module.exports = seed;
