const assignmentService = require("../services/assignment.service");

const create = async (req, res) => {
  try {
    const task = await assignmentService.createAssignment(req.body);
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getBySubject = async (req, res) => {
  try {
    const tasks = await assignmentService.getBySubject(req.params.subjectId);
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { create, getBySubject }; // Simplificado para el ejemplo
