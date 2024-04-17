const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const request = require("supertest");
const app = require("../app");
const endpoints = require("../endpoints.json");

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
