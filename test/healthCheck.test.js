const request = require("supertest");
const app = require("../src/app"); // Import Express app
const sequelize = require("../src/config/database"); // Import Sequelize instance
const { HealthCheck } = require("../src/models");

// Ensure database connection is established before running tests
beforeAll(async () => {
  await sequelize.authenticate();
  await sequelize.sync();
});

describe("Health Check API Tests", () => {
  let transaction;

  beforeEach(async () => {
    transaction = await sequelize.transaction();
  });

  afterEach(async () => {
    await transaction.rollback();
  });

  // ✅ Test for successful health check (200 OK)
  test("GET /healthz should return 200 OK", async () => {
    const response = await request(app).get("/healthz");
    expect(response.status).toBe(200);
  });

  // ❌ Test for database failure scenario (503 Service Unavailable)
  test("GET /healthz should return 503 if database is down", async () => {
    // Mock Sequelize query to simulate database failure
    jest.spyOn(HealthCheck, "create").mockImplementation(() => {
      throw new Error("Database Connection Failed");
    });

    const response = await request(app).get("/healthz");
    expect(response.status).toBe(503); // Expect 503 when DB is down

    // Restore original Sequelize behavior
    HealthCheck.create.mockRestore();
  });

  test("should return 503 Service Unavailable if there's an error inserting the health check record", async () => {
    // Mock insertion failure by making HealthCheck.create throw an error
    jest
      .spyOn(HealthCheck, "create")
      .mockRejectedValue(new Error("Insertion error"));

    // Send a GET request to your health check route (adjust URL as needed)
    const response = await request(app).get("/healthz");

    // Check if the response status is 503
    expect(response.status).toBe(503);

    // Ensure that the create method was called
    expect(HealthCheck.create).toHaveBeenCalled();
  });

  // ❌ Test for invalid method (405 Method Not Allowed)
  test("POST /healthz should return 405 Method Not Allowed", async () => {
    const response = await request(app).post("/healthz");
    expect(response.status).toBe(405);
  });

  // ❌ Test for invalid method (405 Method Not Allowed)
  test("PUT /healthz should return 405 Method Not Allowed", async () => {
    const response = await request(app).put("/healthz");
    expect(response.status).toBe(405);
  });

  // ❌ Test for invalid method (405 Method Not Allowed)
  test("DELETE /healthz should return 405 Method Not Allowed", async () => {
    const response = await request(app).delete("/healthz");
    expect(response.status).toBe(405);
  });

  // ❌ Test for invalid method (405 Method Not Allowed)
  test("PATCH /healthz should return 405 Method Not Allowed", async () => {
    const response = await request(app).patch("/healthz");
    expect(response.status).toBe(405);
  });

  // ❌ Test for invalid method (405 Method Not Allowed)
  test("HEAD /healthz should return 405 Method Not Allowed", async () => {
    const response = await request(app).head("/healthz");
    expect(response.status).toBe(405);
  });

  // ❌ Test for query parameters (400 Bad Request)
  test("GET /healthz with query parameters should return 400 Bad Request", async () => {
    const response = await request(app).get("/healthz").query({ key: "value" });
    expect(response.status).toBe(400);
  });

  // ❌ Test for request body (400 Bad Request)
  test("GET /healthz with request body should return 400 Bad Request", async () => {
    const response = await request(app)
      .get("/healthz")
      .send({ invalidField: "test" });
    expect(response.status).toBe(400);
  });
});

// Close database connection after all tests
afterAll(async () => {
  await sequelize.close();
});
