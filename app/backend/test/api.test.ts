import { afterEach, describe, expect, it } from "vitest";
import request from "supertest";

import { app, resetRequests } from "../src/api/app.js";

describe("CivicConnect API", () => {
  afterEach(() => {
    resetRequests();
  });

  it("accepts a submitted request", async () => {
    const response = await request(app)
      .patch("/api/v1/requests/REQ-001/status")
      .send({
        status: "Accepted",
      });

    expect(response.status).toBe(200);
    expect(response.body.data.status).toBe("Accepted");
  });

  it("rejects an invalid status transition", async () => {
    const response = await request(app)
      .patch("/api/v1/requests/REQ-001/status")
      .send({
        status: "Closed",
      });

    expect(response.status).toBe(409);
    expect(response.body.error).toBe(
      "Invalid request status transition"
    );
  });

  it("rejects an unknown request", async () => {
    const response = await request(app)
      .patch("/api/v1/requests/DOES-NOT-EXIST/status")
      .send({
        status: "Accepted",
      });

    expect(response.status).toBe(404);
  });

  it("rejects an invalid status value", async () => {
    const response = await request(app)
      .patch("/api/v1/requests/REQ-001/status")
      .send({
        status: "NotARealStatus",
      });

    expect(response.status).toBe(400);
  });
});