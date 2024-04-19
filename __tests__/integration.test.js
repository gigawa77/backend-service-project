const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const request = require("supertest");
const app = require("../app");
const endpoints = require("../endpoints.json");
const articles = require("../db/data/test-data/articles");

afterAll(() => {
  return db.end();
});

beforeEach(() => {
  return seed(data);
});

describe("/api/healthcheck", () => {
  test("GET 200: Should respond with a 200 status code", () => {
    return request(app)
      .get("/api/healthcheck")
      .expect(200)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Server online");
      });
  });
});

describe("/api", () => {
  test("GET 404: Should return a 404 when given an invalid endpoint", () => {
    return request(app)
      .get("/api/invalid_endpoint")
      .expect(404)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("Endpoint not found");
      });
  });
});

describe("/api", () => {
  test("GET 200: Should respond with a list of valid endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body.endpoints).toEqual(endpoints);
      });
  });
});

describe("/api/topics", () => {
  test("GET 200: Should respond with an array of topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body.topics.length).toEqual(3);
        body.topics.forEach((topic) =>
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          })
        );
      });
  });
});

describe("/api/articles/:article_id", () => {
  test("GET 200: Should respond with the correct article", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toMatchObject([
          {
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
          },
        ]);
      });
  });
  test("GET 400: Should return a 400 when given an invalid id", () => {
    return request(app)
      .get("/api/articles/invalid")
      .expect(400)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("Bad request");
      });
  });
  test("GET 404: Should return a 404 when given an id that doesn't exist", () => {
    return request(app)
      .get("/api/articles/999")
      .expect(404)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("article not found");
      });
  });
});

describe("/api/articles", () => {
  test("GET 200: Should respond with an array of all articles", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        console.log(body.articles);
        expect(body.articles.length).toBe(13);
        body.articles.forEach((article) =>
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          })
        );
      });
  });
});
