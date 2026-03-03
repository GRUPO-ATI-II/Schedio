const Grade = require("../entities/grade.entity");

class GradeService {
  async createGrade(gradeData) {
    const newGrade = new Grade(gradeData);
    return await newGrade.save();
  }

  async getGradesBySubject(userId, subjectId) {
    return await Grade.find({ user: userId, subject: subjectId }).populate(
      "assignment",
      "instructions",
    );
  }

  async getAverageBySubject(userId, subjectId) {
    const grades = await Grade.find({ user: userId, subject: subjectId });
    if (grades.length === 0) return 0;
    const sum = grades.reduce((acc, curr) => acc + curr.score, 0);
    return sum / grades.length;
  }
}

module.exports = new GradeService();
