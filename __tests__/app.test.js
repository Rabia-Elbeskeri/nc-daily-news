const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const endpointsJson = require("../endpoints.json");
require("jest-sorted");



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
                expect(body.msg).toBe("Invalid input");
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

});

describe("DELETE /api/comments/:comment_id", () => {
    test("204: deletes the specified comment", () => {
        return request(app)
            .delete("/api/comments/1")
            .expect(204);
    });

    test("404: responds with an error when trying to delete a non-existent comment", () => {
        return request(app)
            .delete("/api/comments/9999")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Comment not found");
            });
    });

    test("400: responds with an error when comment_id is invalid", () => {
        return request(app)
            .delete("/api/comments/not-a-number")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Invalid input");
            });
    });
});







describe("GET /api/users", () => {
    test("200: responds with an array of user objects", () => {
        return request(app)
            .get("/api/users")
            .expect(200)
            .then(({ body }) => {
                expect(body.users).toBeInstanceOf(Array);
                expect(body.users.length).toBeGreaterThan(0);
                body.users.forEach((user) => {
                    expect(user).toHaveProperty("username", expect.any(String));
                    expect(user).toHaveProperty("name", expect.any(String));
                    expect(user).toHaveProperty("avatar_url", expect.any(String));
                });
            });
    });
});


describe("GET /api/articles?sort_by&order", () => {
    test("200: sorts articles by title in ascending order", () => {
        return request(app)
            .get("/api/articles?sort_by=title&order=asc")
            .expect(200)
            .then(({ body }) => {
                expect(body.articles).toBeSortedBy("title", { ascending: true });
            });
    });

    test("400: invalid sort_by column", () => {
        return request(app)
            .get("/api/articles?sort_by=invalid_column")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Invalid sort_by query");
            });
    });
});


describe("GET /api/articles?topic=", () => {
    test("200: filters articles by topic", () => {
        return request(app)
            .get("/api/articles?topic=cats")
            .expect(200)
            .then(({ body }) => {
                body.articles.forEach((article) => {
                    expect(article.topic).toBe("cats");
                });
            });
    });

    test("404: topic not found", () => {
        return request(app)
            .get("/api/articles?topic=nonexistent")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Topic not found");
            });
    });
});


describe("GET /api/articles/:article_id with comment_count", () => {
    test("200: returns article with comment_count", () => {
        return request(app)
            .get("/api/articles/1")
            .expect(200)
            .then(({ body }) => {
                expect(body.article).toHaveProperty("comment_count", expect.any(Number));
            });
    });
});


describe("GET /api/users/:username", () => {
    test("200: returns user by username", () => {
        return request(app)
            .get("/api/users/butter_bridge")
            .expect(200)
            .then(({ body }) => {
                expect(body.user).toEqual(
                    expect.objectContaining({
                        username: "butter_bridge",
                        name: expect.any(String),
                        avatar_url: expect.any(String),
                    })
                );
            });
    });

    test("404: username not found", () => {
        return request(app)
            .get("/api/users/nonexistent")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("User not found");
            });
    });
});

describe("PATCH /api/users/:username", () => {
    test("200: updates user and returns updated object", () => {
        return request(app)
            .patch("/api/users/butter_bridge")
            .send({ name: "Updated Name" })
            .expect(200)
            .then(({ body }) => {
                expect(body.user).toHaveProperty("username", "butter_bridge");
                expect(body.user).toHaveProperty("name", "Updated Name");
            });
    });

    test("404: user not found", () => {
        return request(app)
            .patch("/api/users/nonexistent")
            .send({ name: "Test" })
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("User not found");
            });
    });
});


describe("PATCH /api/comments/:comment_id", () => {
    test("200: updates votes and returns updated comment", () => {
        return request(app)
            .patch("/api/comments/1")
            .send({ inc_votes: 3 })
            .expect(200)
            .then(({ body }) => {
                expect(body.comment.votes).toBeGreaterThan(0);
            });
    });
});


describe("POST /api/articles", () => {
    test("201: creates and returns new article", () => {
        const newArticle = {
            author: "butter_bridge",
            title: "New test article",
            body: "Test body content",
            topic: "cats",
            article_img_url: "http://example.com/image.jpg"
        };

        return request(app)
            .post("/api/articles")
            .send(newArticle)
            .expect(201)
            .then(({ body }) => {
                expect(body.article.title).toBe("New test article");
            });
    });
});


describe("GET /api/articles pagination", () => {
    test("200: paginates articles correctly", () => {
        return request(app)
            .get("/api/articles?limit=5&p=2")
            .expect(200)
            .then(({ body }) => {
                expect(body.articles.length).toBeLessThanOrEqual(5);
                expect(body.total_count).toBeGreaterThan(0);
            });
    });
});


describe("GET /api/articles/:article_id/comments pagination", () => {
    test("200: paginates comments correctly", () => {
        return request(app)
            .get("/api/articles/1/comments?limit=3&p=1")
            .expect(200)
            .then(({ body }) => {
                expect(body.comments.length).toBeLessThanOrEqual(3);
            });
    });
});


describe("POST /api/topics", () => {
    test("201: creates and returns new topic", () => {
        const newTopic = {
            slug: "testing",
            description: "Test description",
            img_url: "http://example.com/topic-image.png"
        };
        return request(app)
            .post("/api/topics")
            .send(newTopic)
            .expect(201)
            .then(({ body }) => {
                expect(body.topic.slug).toBe("testing");
            });
    });
});


describe("DELETE /api/articles/:article_id", () => {
    test("204: deletes article and related comments", () => {
        return request(app)
            .delete("/api/articles/1")
            .expect(204);
    });
});





