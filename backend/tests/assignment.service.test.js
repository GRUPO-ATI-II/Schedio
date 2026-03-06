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
});