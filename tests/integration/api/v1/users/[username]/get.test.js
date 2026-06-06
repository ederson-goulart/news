import orchestrator from "tests/orchestrator.js";
import { version as uuidVersion } from "uuid";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("GET /api/v1/users/[username]", () => {
  describe("Anonymous user", () => {
    test("With exact case match", async () => {
      const response1 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "MesmoCase",
          email: "mesmocase@example.com",
          password: "password123",
        }),
      });
      expect(response1.status).toBe(201);

      const response2 = await fetch(
        "http://localhost:3000/api/v1/users/MesmoCase",
      );

      expect(response2.status).toBe(200);

      const response3Body = await response2.json();
      expect(response3Body).toEqual({
        id: response3Body.id,
        username: "MesmoCase",
        email: "mesmocase@example.com",
        password: response3Body.password,
        created_at: response3Body.created_at,
        updated_at: response3Body.updated_at,
      });

      expect(uuidVersion(response3Body.id)).toBe(4);
      expect(Date.parse(response3Body.created_at)).not.toBeNaN();
      expect(Date.parse(response3Body.updated_at)).not.toBeNaN();
    });
    test("With case Mismatch", async () => {
      const response1 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "CaseDiferente",
          email: "case@example.com",
          password: "password123",
        }),
      });
      expect(response1.status).toBe(201);

      const response2 = await fetch(
        "http://localhost:3000/api/v1/users/casediferente",
      );

      expect(response2.status).toBe(200);

      const response3Body = await response2.json();
      expect(response3Body).toEqual({
        id: response3Body.id,
        username: "CaseDiferente",
        email: "case@example.com",
        password: response3Body.password,
        created_at: response3Body.created_at,
        updated_at: response3Body.updated_at,
      });

      expect(uuidVersion(response3Body.id)).toBe(4);
      expect(Date.parse(response3Body.created_at)).not.toBeNaN();
      expect(Date.parse(response3Body.updated_at)).not.toBeNaN();
    });
    test("With nonexistent username", async () => {
      const response = await fetch(
        "http://localhost:3000/api/v1/users/UsuarioInexistente",
      );

      expect(response.status).toBe(404);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        name: "NotFoundError",
        message: "User not found.",
        action: "Please check the username and try again.",
        status_code: 404,
      });
    });
  });
});
