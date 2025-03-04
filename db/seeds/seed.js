<<<<<<< HEAD
const db = require("../connection")
const format = require("pg-format");

const { convertTimestampToDate } = require("./utils");
const { articleData, commentData, topicData, userData } = require('./index');

const seed = ({ topicData, userData, articleData, commentData }) => {

=======
const db = require("../connection");
const format = require("pg-format");

const { convertTimestampToDate } = require("./utils");
const { articleData, commentData, topicData, userData } = require('../data/test-data/index');

const seed = ({ topicData, userData, articleData, commentData }) => {
>>>>>>> 0c2bd3b (updated work)
    return db
        .query("DROP TABLE IF EXISTS comments;")
        .then(() => db.query("DROP TABLE IF EXISTS articles;"))
        .then(() => db.query("DROP TABLE IF EXISTS users;"))
        .then(() => db.query("DROP TABLE IF EXISTS topics;"))
        .then(() => {
<<<<<<< HEAD
            return db.query(`
                CREATE TABLE topics
                (
                    slug        VARCHAR(50) PRIMARY KEY,
                    description TEXT NOT NULL,
                    img_url     TEXT NOT NULL
                );`);
=======
            return db.query(`CREATE TABLE topics
                (
                    slug        VARCHAR(50) PRIMARY KEY,
                    description VARCHAR NOT NULL,
                    img_url VARCHAR(1000) NOT NULL
                             );`);
>>>>>>> 0c2bd3b (updated work)
        })
        .then(() => {
            return db.query(`
                CREATE TABLE users
                (
<<<<<<< HEAD
                    username  VARCHAR(50) PRIMARY KEY,
                    name   TEXT NOT NULL,
                    avatar_url TEXT NOT NULL
=======
                    username   VARCHAR(50) PRIMARY KEY,
                    name VARCHAR NOT NULL,
                    avatar_url VARCHAR(1000) NOT NULL
>>>>>>> 0c2bd3b (updated work)
                );`);
        })
        .then(() => {
            return db.query(`
                CREATE TABLE articles
                (
<<<<<<< HEAD
                    article_id SERIAL PRIMARY KEY,
                    title  TEXT NOT NULL,
                    topic   VARCHAR(50) REFERENCES topics (slug) ON DELETE CASCADE,
                    author   VARCHAR(50) REFERENCES users (username) ON DELETE CASCADE,
                    body  TEXT NOT NULL,
                    created_at  TIMESTAMP DEFAULT NOW(),
                    votes  INT DEFAULT 0,
                    article_img_url TEXT NOT NULL
=======
                    article_id      SERIAL PRIMARY KEY,
                    title VARCHAR NOT NULL,
                    topic    VARCHAR(50) REFERENCES topics (slug) ON DELETE CASCADE,
                    author      VARCHAR(50) REFERENCES users (username) ON DELETE CASCADE,
                    body            TEXT NOT NULL,
                    created_at    TIMESTAMP DEFAULT NOW(),
                    votes           INT       DEFAULT 0,        
                    article_img_url VARCHAR(1000) NOT NULL

>>>>>>> 0c2bd3b (updated work)
                );`);
        })

        .then(() => {
            return db.query(`
                CREATE TABLE comments
                (
                    comment_id SERIAL PRIMARY KEY,
                    article_id INT REFERENCES articles (article_id) ON DELETE CASCADE,
<<<<<<< HEAD
                    body  TEXT NOT NULL,
                    votes  INT   DEFAULT 0,
                    author  VARCHAR(50) REFERENCES users (username) ON DELETE CASCADE,
=======
                    body       TEXT NOT NULL,
                    votes      INT       DEFAULT 0,
                    author     VARCHAR(50) REFERENCES users (username) ON DELETE CASCADE,
>>>>>>> 0c2bd3b (updated work)
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
        .then(() => {
            const formattedCommentData = commentData.map(convertTimestampToDate);
<<<<<<< HEAD
            const formattedCommentValues = formattedCommentData.map(({ article_id, body, votes, author, created_at }) => {
                return [article_id, body, votes, author, created_at];
            });
=======

            const formattedCommentValues = formattedCommentData.map(({ article_id, body, votes, author, created_at }) => {
                return [article_id, body, votes, author, created_at];
            });




>>>>>>> 0c2bd3b (updated work)
            const commentQuery = format(`INSERT INTO comments (article_id, body, votes, author, created_at) VALUES %L RETURNING *;`, formattedCommentValues);
            return db.query(commentQuery);
        });
};



const getAllUsers = () => {
    return db.query("SELECT * FROM users;")
        .then(result => result.rows)
        .catch(err => console.error(err));
};

<<<<<<< HEAD

const getArticlesByTopic = (topic) => {
    const query = `SELECT * FROM articles WHERE topic = '${topic}';`;
    return db.query(query)
        .then(result => result.rows)
        .catch(err => console.error(err));
  
=======
const getArticlesByTopic = (topic) => {
    return db.query("SELECT * FROM articles WHERE topic = $1;", [topic])
        .then(result => result.rows)
        .catch(err => console.error(err));
>>>>>>> 0c2bd3b (updated work)
};

const getCommentsWithNegativeVotes = () => {
    return db.query("SELECT * FROM comments WHERE votes < 0;")
        .then(result => result.rows)
<<<<<<< HEAD
        .catch(err => console.error(err));    
=======
        .catch(err => console.error(err));
>>>>>>> 0c2bd3b (updated work)
};

const getAllTopics = () => {
    return db.query("SELECT * FROM topics;")
        .then(result => result.rows)
        .catch(err => console.error(err));
};

const getArticlesByUser = (username) => {
<<<<<<< HEAD
   const query = `SELECT * FROM articles WHERE author = '${username}';`;
         return db.query(query)
=======
    return db.query("SELECT * FROM articles WHERE author = $1;", [username])

>>>>>>> 0c2bd3b (updated work)
        .then(result => result.rows)
        .catch(err => console.error(err));
};

<<<<<<< HEAD
=======

>>>>>>> 0c2bd3b (updated work)
const getPopularComments = () => {
    return db.query("SELECT * FROM comments WHERE votes > 10;")
        .then(result => result.rows)
        .catch(err => console.error(err));
};

<<<<<<< HEAD






module.exports = seed;
=======
module.exports = seed;
>>>>>>> 0c2bd3b (updated work)
