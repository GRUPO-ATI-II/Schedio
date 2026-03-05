const Subject = require("../entities/subject.entity");
const Studies = require("../entities/studies.entity");

class SubjectService {
  async createSubject(name) {
    return await Subject.findOneAndUpdate(
      { name },
      { name },
      { upsert: true, new: true },
    );
  }

  async enrollUserInSubject(userId, subjectId) {
    const newEnrollment = new Studies({ user: userId, subject: subjectId });
    return await newEnrollment.save();
  }

  async getSubjectsByUser(userId) {
    const enrollments = await Studies.find({ user: userId }).populate(
      "subject",
    );
    return enrollments.map((e) => e.subject);
  }

  async unenrollUser(userId, subjectId) {
    return await Studies.findOneAndDelete({ user: userId, subject: subjectId });
  }
}

module.exports = new SubjectService();
