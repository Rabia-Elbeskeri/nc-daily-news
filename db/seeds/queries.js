const db = require("../connection");

const getAllUsers = () => {
    return db.query("SELECT * FROM users;")
        .then(data => {
            console.log("Users:", data.rows);
            return data.rows;
        });
};

const getArticlesByTopic = (topic) => {
    return db.query("SELECT * FROM articles WHERE topic = $1;", [topic])
        .then(data => {
            console.log(`Articles on ${topic}:`, data.rows);
            return data.rows;
        });
};

const getCommentsWithNegativeVotes = () => {
    return db.query("SELECT * FROM comments WHERE votes < 0;")
        .then(data => {
            console.log("Comments with negative votes:", data.rows);
            return data.rows;
        });
};

const getAllTopics = () => {
    return db.query("SELECT * FROM topics;")
        .then(data => {
            console.log("Topics:", data.rows);
            return data.rows;
        });
};

const getArticlesByUser = (username) => {
    return db.query("SELECT * FROM articles WHERE author = $1;", [username])
        .then(data => {
            console.log(`Articles by ${username}:`, data.rows);
            return data.rows;
        });
};

const getCommentsWithHighVotes = () => {
    return db.query("SELECT * FROM comments WHERE votes > 10;")
        .then(data => {
            console.log("Comments with more than 10 votes:", data.rows);
            return data.rows;
        });
};

// 👇 Run them in sequence
const runAllQueries = async () => {
    await getAllUsers();
    await getArticlesByTopic("coding");
    await getCommentsWithNegativeVotes();
    await getAllTopics();
    await getArticlesByUser("grumpy19");
    await getCommentsWithHighVotes();

    db.end(); // Close the DB connection
};

runAllQueries();
