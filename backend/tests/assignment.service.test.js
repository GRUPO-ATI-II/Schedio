const assignmentService = require("../src/assignments/services/assignment.service");
const Assignment = require("../src/assignments/entities/assignment.entity");

jest.mock("../src/assignments/entities/assignment.entity");

describe("Assignment Service", () => {
  const mockData = {
    title: "Physics Lab",
    deadline: new Date(),
    ponderation: 15,
    subject: "65f123456789012345678901"
  };

  test("createAssignment - Should save and return a new assignment", async () => {
    // Mock the constructor and save method
    Assignment.prototype.save = jest.fn().mockResolvedValue({ _id: "abc", ...mockData });

    const result = await assignmentService.createAssignment(mockData);

    expect(result._id).toBe("abc");
    expect(Assignment.prototype.save).toHaveBeenCalled();
  });

  test("getBySubject - Should return sorted list of assignments", async () => {
    const mockFind = {
      sort: jest.fn().mockResolvedValue([mockData])
    };
    Assignment.find.mockReturnValue(mockFind);

    const result = await assignmentService.getBySubject("subject_id");

    expect(Assignment.find).toHaveBeenCalledWith({ subject: "subject_id" });
    expect(mockFind.sort).toHaveBeenCalledWith({ deadline: 1 });
    expect(result).toHaveLength(1);
  });

  test("getById - should fetch assignment by id", async () => {
    Assignment.findById = jest.fn().mockResolvedValue({ _id: "123", ...mockData });
    const result = await assignmentService.getById("123");
    expect(Assignment.findById).toHaveBeenCalledWith("123");
    expect(result._id).toBe("123");
  });

  test("updateAssignment - should forward object to findByIdAndUpdate", async () => {
    Assignment.findByIdAndUpdate = jest.fn().mockResolvedValue({ _id: "123", ...mockData });
    const updates = { title: "new title" };
    const result = await assignmentService.updateAssignment("123", updates);
    expect(Assignment.findByIdAndUpdate).toHaveBeenCalledWith(
      "123",
      { $set: updates },
      { new: true, runValidators: true },
    );
    expect(result)._toBeDefined();
  });
});