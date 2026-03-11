const request = require("supertest");
const express = require("express");
const assignmentController = require("../src/assignments/controllers/assignments.controller");
const assignmentService = require("../src/assignments/services/assignment.service");

const app = express();
app.use(express.json());
app.post("/api/assignment", assignmentController.create);
app.get("/api/assignment/:id", assignmentController.getById);
app.put("/api/assignment/:id", assignmentController.update);

// Mock the service
jest.mock("../src/assignments/services/assignment.service");

describe("Assignment Controller", () => {
  const mockAssignment = {
    title: "Math Homework",
    instructions: "Solve pages 1-10",
    deadline: "2026-03-10T14:30:00.000Z",
    ponderation: 20,
    subject: "65f123456789012345678901"
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("POST /api/assignment - Should return 201 on success", async () => {
    assignmentService.createAssignment.mockResolvedValue({ _id: "123", ...mockAssignment });

    const response = await request(app)
      .post("/api/assignment")
      .send(mockAssignment);

    expect(response.status).toBe(201);
    expect(response.body.title).toBe("Math Homework");
    expect(assignmentService.createAssignment).toHaveBeenCalledWith(mockAssignment);
  });

  test("POST /api/assignment - Should return 500 on service error", async () => {
    assignmentService.createAssignment.mockRejectedValue(new Error("DB Error"));

    const response = await request(app)
      .post("/api/assignment")
      .send(mockAssignment);

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("DB Error");
  });

  test("GET /api/assignment/:id - success returns assignment", async () => {
    assignmentService.getById.mockResolvedValue({ _id: "abc", ...mockAssignment });
    const response = await request(app).get("/api/assignment/abc");
    expect(response.status).toBe(200);
    expect(response.body._id).toBe("abc");
    expect(assignmentService.getById).toHaveBeenCalledWith("abc");
  });

  test("GET /api/assignment/:id - not found", async () => {
    assignmentService.getById.mockResolvedValue(null);
    const response = await request(app).get("/api/assignment/xyz");
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Assignment not found");
  });

  test("PUT /api/assignment/:id - success", async () => {
    const updated = { _id: "abc", ...mockAssignment, title: "Updated" };
    assignmentService.updateAssignment.mockResolvedValue(updated);
    const response = await request(app)
      .put("/api/assignment/abc")
      .send({ title: "Updated" });
    expect(response.status).toBe(200);
    expect(response.body.title).toBe("Updated");
    expect(assignmentService.updateAssignment).toHaveBeenCalledWith("abc", { title: "Updated" });
  });

  test("PUT /api/assignment/:id - service error", async () => {
    assignmentService.updateAssignment.mockRejectedValue(new Error("fail"));
    const response = await request(app)
      .put("/api/assignment/abc")
      .send({ title: "x" });
    expect(response.status).toBe(500);
    expect(response.body.error).toBe("fail");
  });
});