const subjectService = require("../services/subject.service");

// --- GESTIÓN DE MATERIAS (GLOBAL) ---
const createSubject = async (req, res) => {
  try {
    const { name } = req.body;
    const subject = await subjectService.createSubject(name);
    res.status(201).json(subject);
  } catch (error) {
    res.status(500).json({ error: "Error creating subject" });
  }
};

// --- LÓGICA DE "STUDIES" (RELACIÓN) ---

// Inscribir un alumno en una materia (El rombo Studies)
const enroll = async (req, res) => {
  try {
    const { userId, subjectId } = req.body;
    const enrollment = await subjectService.enrollUserInSubject(
      userId,
      subjectId,
    );
    res.status(201).json({
      message: "User enrolled successfully",
      data: enrollment,
    });
  } catch (error) {
    // Manejo de error por si ya existe la relación (índice único)
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "User is already enrolled in this subject" });
    }
    res.status(500).json({ error: error.message });
  }
};

// Obtener las materias que estudia un alumno
const getStudentSubjects = async (req, res) => {
  try {
    const { userId } = req.params;
    const subjects = await subjectService.getSubjectsByUser(userId);
    res.status(200).json(subjects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Desvincular (Unenroll)
const unenroll = async (req, res) => {
  try {
    const { userId, subjectId } = req.params;
    const result = await subjectService.unenrollUser(userId, subjectId);
    if (!result)
      return res.status(404).json({ message: "Enrollment not found" });
    res.status(200).json({ message: "Unenrolled successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createSubject, enroll, getStudentSubjects, unenroll };
