const Assignment = require("../entities/assignment.entity");

class AssignmentService {
  async createAssignment(data) {
    const newAssignment = new Assignment(data);
    return await newAssignment.save();
  }

  async getBySubject(subjectId) {
    return await Assignment.find({ subject: subjectId }).sort({ deadline: 1 });
  }

  async getById(id) {
    return await Assignment.findById(id).populate("subject");
  }

  async updateAssignment(id, updatedData) {
    // updatedData should be an object containing the fields to replace/update
    return await Assignment.findByIdAndUpdate(
      id,
      { $set: updatedData },
      { new: true, runValidators: true },
    );
  }

  async deleteAssignment(id) {
    return await Assignment.findByIdAndDelete(id);
  }
}

module.exports = new AssignmentService();
