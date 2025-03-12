function handlePSQLErrors(err, req, res, next) {
    if (err.code === "22P02") {
        return res.status(400).send({ msg: "Invalid input" });
    }
    if (err.code === "23503") {
        // Handles foreign key constraint violations (missing article_id or author)
        if (err.detail.includes("article_id")) {
            return res.status(404).send({ msg: "Article not found" });
        }
        if (err.detail.includes("author")) {
            return res.status(404).send({ msg: "User not found" });
        }
    }
    next(err);
}

function handleCustomErrors(err, req, res, next) {
    if (err.status && err.msg) {
        return res.status(err.status).send({ msg: err.msg });
    }
    next(err);
}

function handleServerErrors(err, req, res, next) {
    console.error(err);
    res.status(500).send({ msg: "Internal Server Error" });
}

function handleNonExistantEndpoint(req, res, next) {
    res.status(404).send({ msg: "Endpoint Not Found" });
}

module.exports = {
    handleNonExistantEndpoint,
    handlePSQLErrors,
    handleCustomErrors,
    handleServerErrors,
};
