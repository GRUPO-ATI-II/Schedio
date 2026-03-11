const request = require("supertest");
const express = require("express");
const eventController = require("../src/event/controllers/event.controller");
const eventService = require("../src/event/services/event.service");

// Setup temporary app for isolation
const app = express();
app.use(express.json());
app.post("/api/events", eventController.create);
app.get("/api/events/agenda/:agendaId", eventController.getByAgenda);

jest.mock("../src/event/services/event.service");

describe("Event Controller", () => {
  const mockEventData = {
    title: "Meeting",
    date: new Date().toISOString(),
    agendas: ["65f123456789012345678901"]
  };

  afterEach(() => jest.clearAllMocks());

  test("POST /api/events - Success should return 201", async () => {
    eventService.createEvent.mockResolvedValue({ _id: "123", ...mockEventData });

    const response = await request(app)
      .post("/api/events")
      .send(mockEventData);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Event created successfully");
    expect(response.body.event.title).toBe("Meeting");
  });

  test("GET /api/events/agenda/:id - Should return list of events", async () => {
    eventService.getEventsByAgenda.mockResolvedValue([mockEventData]);

    const response = await request(app).get("/api/events/agenda/65f123456789012345678901");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});