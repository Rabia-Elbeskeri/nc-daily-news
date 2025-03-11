const { fetchArticles } = require("../models/articles.models");



function getArticles(request, response, next) {
    fetchArticles()
        .then((articles) => {
            response.status(200).send({ articles });
        })
        .catch((error) => {
            next(error);
        });
}



module.exports = getArticles ;
