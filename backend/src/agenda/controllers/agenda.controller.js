const agendaService = require("../services/agenda.service");

const create = async (req, res) => {
  try {
    const newAgenda = await agendaService.createAgenda(req.body);
    res
      .status(201)
      .json({ message: "Agenda created successfully", agenda: newAgenda });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const agendas = await agendaService.getAgendasByUserId(userId);
    res.status(200).json(agendas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getDashboardByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const fullAgenda =
      await agendaService.getFullAgendaWithTasksByUserId(userId);
    res.status(200).json(fullAgenda);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createTask = async (req, res) => {
  try {
    const newTask = await agendaService.createTask(req.body);
    res
      .status(201)
      .json({ message: "Task created successfully", task: newTask });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const updated = await agendaService.addUserToAgenda(id, userId);
    if (!updated) return res.status(404).json({ message: "Agenda not found" });
    res.status(200).json({ message: "User added", agenda: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const removeUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const updated = await agendaService.removeUserFromAgenda(id, userId);
    if (!updated) return res.status(404).json({ message: "Agenda not found" });
    res.status(200).json({ message: "User removed", agenda: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { field, newValue } = req.body;
    const updatedAgenda = await agendaService.updateAgenda(id, field, newValue);
    if (!updatedAgenda)
      return res.status(404).json({ message: "Agenda not found" });
    res
      .status(200)
      .json({ message: "Update successful", agenda: updatedAgenda });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await agendaService.deleteAgenda(id);
    if (!deleted) return res.status(404).json({ message: "Agenda not found" });
    res.status(200).json({ message: "Agenda deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  create,
  getByUser,
  getDashboardByUser,
  createTask,
  addUser,
  removeUser,
  update,
  remove,
};
