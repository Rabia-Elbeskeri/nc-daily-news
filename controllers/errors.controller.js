function handlePSQLErrors(error, request, response, next) {
    if (error.code === "22P02") {
        return response.status(400).send({ msg: "Invalid input" });
    }


    if (error.code === "23502") {
        return response.status(400).send({ msg: "Missing required fields" });
    }

    if (error.code === "23503") {
        if (error.detail.includes("article_id")) {
            return response.status(404).send({ msg: "Article not found" });
        }
        if (error.detail.includes("author")) {
            return response.status(404).send({ msg: "User not found" });
        }
        if (error.detail.includes("topic")) {
            return response.status(404).send({ msg: "Topic not found" });
        }
    }

    next(error);
}

function handleCustomErrors(error, request, response, next) {
    if (error.status && error.msg) {
        return response.status(error.status).send({ msg: error.msg });
    }
    next(error);
}

function handleServerErrors(error, request, response, next) {
    console.error(error);
    response.status(500).send({ msg: "Internal Server Error" });
}

function handleNonExistentEndpoint(request, response, next) {
    response.status(404).send({ msg: "Endpoint Not Found" });
}

module.exports = {
    handleNonExistentEndpoint,
    handlePSQLErrors,
    handleCustomErrors,
    handleServerErrors
};
