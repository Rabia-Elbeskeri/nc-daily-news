const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const endpointsJson = require("../endpoints.json");


/* Set up your beforeEach & afterAll functions here */
beforeEach(() => {
    return seed(data);
});

afterAll(() => {
    return db.end();
});






describe("GET /api", () => {
    test("200: responds with JSON of all available endpoints", () => {
        return request(app)
            .get("/api")
            .expect(200)
            .then(({ body }) => {
                expect(body).toEqual(endpointsJson);

            });
    });
});

describe("GET /api/topics", () => {
    test("200: responds with an array of topic objects", () => {
        return request(app)
            .get("/api/topics")
            .expect(200)
            .then(({ body }) => {
                expect(body.topics.length).toBe(3);
                body.topics.forEach((topic) => {
                    expect(typeof topic.slug).toBe("string");
                    expect(typeof topic.description).toBe("string");
                });
            });
    });
});

describe("GET /api/articles/:article_id", () => {
    test("200: responds with a single article object", () => {
        return request(app)
            .get("/api/articles/1")
            .expect(200)
            .then(({ body }) => {
                expect(body.article.article_id).toBe(1);
                expect(typeof body.article.title).toBe("string");
                expect(typeof body.article.topic).toBe("string");
                expect(typeof body.article.author).toBe("string");
                expect(typeof body.article.body).toBe("string");
                expect(typeof body.article.created_at).toBe("string");
                expect(typeof body.article.votes).toBe("number");
                expect(typeof body.article.article_img_url).toBe("string");
            });
    });

    test("404: responds with an error for non-existent article_id", () => {
        return request(app)
            .get("/api/articles/9999")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Article not found");
            });
    });
    test("404: responds with error for non-existent route", () => {
        return request(app)
            .get("/api/non-existent")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Endpoint Not Found");
            });
    });


    test("400: responds with an error for invalid article_id", () => {
        return request(app)
            .get("/api/articles/not-an-id")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Invalid input");
            });
    });
});

describe("GET /api/articles", () => {
    test("200: responds with an array of article objects", () => {
        return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({ body }) => {
                expect(body.articles.length).toBeGreaterThan(0);
                body.articles.forEach((article) => {
                    expect(typeof article.article_id).toBe("number");
                    expect(typeof article.title).toBe("string");
                    expect(typeof article.topic).toBe("string");
                    expect(typeof article.author).toBe("string");
                    expect(typeof article.created_at).toBe("string");
                    expect(typeof article.votes).toBe("number");
                    expect(typeof article.comment_count).toBe("number");
                    expect(typeof article.article_img_url).toBe("string");
                });
            });
    });
});





describe("GET /api/articles/:article_id/comments", () => {
    test("200: responds with an array of comments for the given article_id", () => {
        return request(app)
            .get("/api/articles/1/comments")
            .expect(200)
            .then(({ body }) => {
                expect(body.comments).toBeInstanceOf(Array);
                expect(body.comments.length).toBeGreaterThan(0);

                body.comments.forEach((comment) => {
                    expect(typeof comment.comment_id).toBe("number");
                    expect(typeof comment.votes).toBe("number");
                    expect(typeof comment.created_at).toBe("string");
                    expect(typeof comment.author).toBe("string");
                    expect(typeof comment.body).toBe("string");
                    expect(comment.article_id).toBe(1);
                });
            });
    });

    test("200: responds with an empty array if the article has no comments", () => {
        return request(app)
            .get("/api/articles/7/comments")
            .expect(200)
            .then(({ body }) => {
                expect(body.comments).toEqual([]);
            });
    });

    test("404: responds with an error if article_id does not exist", () => {
        return request(app)
            .get("/api/articles/9999/comments")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Article not found");
            });
    });

    test("400: responds with an error for invalid article_id format", () => {
        return request(app)
            .get("/api/articles/not-a-number/comments")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Invalid article ID");
            });
    });
});


describe("POST /api/articles/:article_id/comments", () => {
    test("201: posts a comment and returns the posted comment", () => {
        return request(app)
            .post("/api/articles/1/comments")
            .send({
                username: "butter_bridge",
                body: "This is a test comment!"
            })
            .expect(201)
            .then(({ body }) => {
                const { comment } = body;

                expect(comment).toBeInstanceOf(Object);
                expect(comment).toHaveProperty("comment_id", expect.any(Number));
                expect(comment).toHaveProperty("article_id", 1);
                expect(comment).toHaveProperty("author", "butter_bridge");
                expect(comment).toHaveProperty("body", "This is a test comment!");
                expect(comment).toHaveProperty("votes", 0);
                expect(comment).toHaveProperty("created_at", expect.any(String));
            });
    });

    test("400: responds with an error if the request body is missing required fields", () => {
        return request(app)
            .post("/api/articles/1/comments")
            .send({
                username: "butter_bridge"
            })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Missing required fields");
            });
    });

    test("404: responds with an error if the article_id does not exist", () => {
        return request(app)
            .post("/api/articles/9999/comments")
            .send({
                username: "butter_bridge",
                body: "This comment should not be posted"
            })
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Article not found");
            });
    });

    test("400: responds with an error if the article_id is invalid", () => {
        return request(app)
            .post("/api/articles/not-a-number/comments")
            .send({
                username: "butter_bridge",
                body: "This should fail"
            })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Invalid input");
            });
    });

    test("404: responds with an error if the username does not exist", () => {
        return request(app)
            .post("/api/articles/1/comments")
            .send({
                username: "non_existent_user",
                body: "This should fail"
            })
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("User not found");
            });
    });
});


describe("PATCH /api/articles/:article_id", () => {
    test("200: updates the votes and returns the updated article", () => {
        return request(app)
            .patch("/api/articles/1")
            .send({ inc_votes: 5 })
            .expect(200)
            .then(({ body }) => {
                expect(body.article.article_id).toBe(1);
                expect(typeof body.article.title).toBe("string");
                expect(typeof body.article.topic).toBe("string");
                expect(typeof body.article.author).toBe("string");
                expect(typeof body.article.body).toBe("string");
                expect(typeof body.article.created_at).toBe("string");
                expect(typeof body.article.votes).toBe("number");
                expect(typeof body.article.article_img_url).toBe("string");
                expect(body.article.votes).toBeGreaterThan(0);
            });
    });
});


    test("400: responds with an error when inc_votes is missing", () => {
        return request(app)
            .patch("/api/articles/1")
            .send({})
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Invalid input");
            });
    });

    test("400: responds with an error when inc_votes is not a number", () => {
        return request(app)
            .patch("/api/articles/1")
            .send({ inc_votes: "invalid" })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Invalid input");
            });
    });

    test("404: responds with an error when article_id does not exist", () => {
        return request(app)
            .patch("/api/articles/9999")
            .send({ inc_votes: 10 })
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Article not found");
            });
    });

    test("400: responds with an error for invalid article_id", () => {
        return request(app)
            .patch("/api/articles/not-a-number")
            .send({ inc_votes: 1 })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Invalid input");
            });
    });







