function handleNonExistantEndpoint(request, response, next) {
    response.status(404).send({ msg: "Endpoint Not Found" });
}

function handlePSQLErrors(error, request, response, next) {
    if (error.code === "22P02") {
        response.status(400).send({ msg: "Invalid input" });
    } else {
        next(error);
    }
}

function handleCustomErrors(error, request, response, next) {
    if (error.status && error.msg) {
        response.status(error.status).send({ msg: error.msg });
    } else {
        next(error);
    }
}

function handleServerErrors(error, request, response, next) {
    console.error(error);
    response.status(500).send({ msg: "Internal Server Error" });
}

module.exports = {
    handleNonExistantEndpoint,
    handlePSQLErrors,
    handleCustomErrors,
    handleServerErrors,
};


