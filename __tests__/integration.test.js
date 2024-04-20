const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const request = require("supertest");
const app = require("../app");
const endpoints = require("../endpoints.json");
require("jest-sorted");

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

describe("/api/articles/:article_id/comments", () => {
  test("GET 200: Should respond with all comments from given article id", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments.length).toBe(11);
        body.comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            body: expect.any(String),
            article_id: expect.any(Number),
            author: expect.any(String),
            votes: expect.any(Number),
            created_at: expect.any(String),
          });
        });
      });
  });
  test("GET 200: Should respond with an empty array if given article has no comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments.length).toBe(0);
      });
  });
  test("GET 400: Should return a 400 when given an invalid id", () => {
    return request(app)
      .get("/api/articles/abc/comments")
      .expect(400)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("Bad request");
      });
  });
  test("GET 200: Should return comments in descending order", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toBeSortedBy("created_at", { descending: true });
      });
  });
});

describe("/api/articles/:article_id/comments", () => {
  test("POST 201: Should add new comment to comment database and return it", () => {
    const newComment = {
      username: "icellusedkars",
      body: "Hey, icellusedkars here",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment.author).toBe("icellusedkars");
        expect(comment.body).toBe("Hey, icellusedkars here");
      });
  });
  test("POST 404: Should return 404 when article id isn't found", () => {
    const newComment = {
      username: "icellusedkars",
      body: "Hey, icellusedkars here",
    };
    return request(app)
      .post("/api/articles/999/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("not found");
      });
  });
  test("POST 404: Should return 404 if author isn't found", () => {
    const newComment = {
      username: "glimp",
      body: "Hey, glimp here",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("not found");
      });
  });
  test("POST 400: Should return 400 if given an invalid id", () => {
    const newComment = {
      username: "icellusedkars",
      body: "Hey, icellusedkars here",
    };
    return request(app)
      .post("/api/articles/abc/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("Bad request");
      });
  });
  test("POST 400: Should return 400 if comment body is empty", () => {
    const newComment = {
      username: "icellusedkars",
      body: "",
    };
    return request(app)
      .post("/api/articles/abc/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("comment is empty");
      });
  });
});
