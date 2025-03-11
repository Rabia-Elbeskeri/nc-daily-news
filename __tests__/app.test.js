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

