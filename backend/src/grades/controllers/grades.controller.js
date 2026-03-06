const gradeRecordService = require("../services/grade.service");

// --- CREAR REGISTRO DE NOTA ---
const create = async (req, res) => {
  try {
    // Body esperado: { score, user, assignment, subject }
    const newGradeRecord = await gradeRecordService.createGradeRecord(req.body);
    res.status(201).json({
      message: "GradeRecord created successfully",
      gradeRecord: newGradeRecord,
    });
  } catch (error) {
    console.error("❌ [GradeRecord Controller Error]:", error.message);
    res
      .status(500)
      .json({ error: "Internal Server Error while creating grade record" });
  }
};

// --- OBTENER NOTAS POR MATERIA Y USUARIO ---
const getBySubject = async (req, res) => {
  try {
    const { userId, subjectId } = req.params;
    const grades = await gradeRecordService.getGradesBySubject(
      userId,
      subjectId,
    );
    res.status(200).json(grades);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// --- OBTENER PROMEDIO POR MATERIA Y USUARIO ---
const getAverage = async (req, res) => {
  try {
    const { userId, subjectId } = req.params;
    const average = await gradeRecordService.getAverageBySubject(
      userId,
      subjectId,
    );
    res.status(200).json({ average });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// --- OBTENER NOTAS POR ASIGNACIÓN ---
const getByAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const grades = await gradeRecordService.getGradesByAssignment(assignmentId);
    res.status(200).json(grades);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// --- ACTUALIZAR NOTA ---
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { score } = req.body;
    const updated = await gradeRecordService.updateGradeRecord(id, score);
    if (!updated) {
      return res.status(404).json({ message: "GradeRecord not found" });
    }
    res
      .status(200)
      .json({ message: "Update successful", gradeRecord: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  create,
  getBySubject,
  getAverage,
  getByAssignment,
  update,
};
