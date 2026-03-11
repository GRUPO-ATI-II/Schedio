const eventService = require("../src/event/services/event.service");
const Event = require("../src/event/entities/event.entity");

jest.mock("../src/event/entities/event.entity");

describe("Event Service & Model Validation", () => {

  test("createEvent - Should save a valid event", async () => {
    const validData = {
        title: "Study Group",
        date: new Date(),
        agendas: ["65f123456789012345678901"]
    };

    // Mocking the Mongoose save instance method
    Event.prototype.save = jest.fn().mockResolvedValue({ _id: "mock_id", ...validData });

    const result = await eventService.createEvent(validData);
    expect(result._id).toBe("mock_id");
    expect(Event.prototype.save).toHaveBeenCalled();
  });

  test("Model Validation - Should fail if agendas array is empty", async () => {
    // We use the real model here just for validation logic (no DB needed)
    const RealEventModel = jest.requireActual("../src/event/entities/event.entity");
    const invalidEvent = new RealEventModel({
          title: "Fail Event",
          date: new Date(),
          agendas: []
        });

    const validationError = invalidEvent.validateSync();

    // Always check if validationError exists to avoid "Cannot read property of undefined"
    expect(validationError).toBeDefined();
    expect(validationError.errors.agendas.message).toBe("El evento debe estar vinculado a al menos una agenda");
  });
});