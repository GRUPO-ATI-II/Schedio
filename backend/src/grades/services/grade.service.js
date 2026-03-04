const GradeRecord = require("../entities/grade_record.entity");

class GradeRecordService {
  async createGradeRecord(gradeData) {
    const newGrade = new GradeRecord(gradeData);
    return await newGrade.save();
  }

  async getGradesBySubject(userId, subjectId) {
    return await GradeRecord.find({
      user: userId,
      subject: subjectId,
    }).populate("assignment", "instructions deadline ponderation");
  }

  async getGradesByAssignment(assignmentId) {
    return await GradeRecord.find({ assignment: assignmentId }).populate(
      "user",
      "firstName lastName username",
    );
  }

  async getAverageBySubject(userId, subjectId) {
    const grades = await GradeRecord.find({ user: userId, subject: subjectId });
    if (grades.length === 0) return 0;
    const sum = grades.reduce((acc, curr) => acc + curr.score, 0);
    return sum / grades.length;
  }

  async updateGradeRecord(id, score) {
    return await GradeRecord.findByIdAndUpdate(
      id,
      { score },
      { new: true, runValidators: true },
    );
  }
}

module.exports = new GradeRecordService();
