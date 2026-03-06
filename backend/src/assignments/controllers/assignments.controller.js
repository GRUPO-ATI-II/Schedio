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

const update = async (req, res) => {
  try {
    const updated = await assignmentService.updateAssignment(req.params.id, req.body);
    // note: service updateAssignment previously accepted field & value; we modified to accept full object earlier?
    // we'll adjust above accordingly.
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { create, getBySubject, getById, update };
