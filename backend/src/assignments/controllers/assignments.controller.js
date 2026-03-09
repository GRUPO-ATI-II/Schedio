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
const getById = async (req, res) => {
  try {
    const task = await assignmentService.getById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Assignment not found' });
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getAll = async (req, res) => {
  try {
    const tasks = await assignmentService.getAll();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const update = async (req, res) => {
  try {
    const { id } = req.params;
    // req.body contains whatever the frontend sent (could be send_time or the whole assignment)
    const updated = await assignmentService.updateAssignment(id, req.body); 
    if (!updated) return res.status(404).json({ error: "No encontrada" });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await assignmentService.deleteAssignment(id);
    if (!deleted) {
      return res.status(404).json({ error: "Asignación no encontrada" });
    }
    res.status(200).json({ message: "Asignación eliminada" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { create, getBySubject, getById, getAll, update, remove }; // Simplificado para el ejemplo
