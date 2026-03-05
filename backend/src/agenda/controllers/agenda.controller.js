const agendaService = require("../services/agenda.service");

// --- CREAR AGENDA ---
const create = async (req, res) => {
  try {
    // Body esperado: { users: ["userId1", "userId2", ...] }
    const newAgenda = await agendaService.createAgenda(req.body);
    res.status(201).json({
      message: "Agenda created successfully",
      agenda: newAgenda,
    });
  } catch (error) {
    console.error("❌ [Agenda Controller Error]:", error.message);
    res
      .status(500)
      .json({ error: "Internal Server Error while creating agenda" });
  }
};

// --- OBTENER AGENDAS DE UN USUARIO (M:N) ---
const getByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    // Retorna TODAS las agendas en las que el usuario participa
    const agendas = await agendaService.getAgendasByUserId(userId);
    res.status(200).json(agendas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// --- AGREGAR USUARIO A AGENDA (M:N) ---
const addUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const updated = await agendaService.addUserToAgenda(id, userId);
    if (!updated) {
      return res.status(404).json({ message: "Agenda not found" });
    }
    res.status(200).json({ message: "User added to agenda", agenda: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// --- REMOVER USUARIO DE AGENDA (M:N) ---
const removeUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const updated = await agendaService.removeUserFromAgenda(id, userId);
    if (!updated) {
      return res.status(404).json({ message: "Agenda not found" });
    }
    res
      .status(200)
      .json({ message: "User removed from agenda", agenda: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// --- ACTUALIZAR AGENDA ---
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { field, newValue } = req.body;
    const updatedAgenda = await agendaService.updateAgenda(id, field, newValue);
    if (!updatedAgenda) {
      return res.status(404).json({ message: "Agenda not found" });
    }
    res
      .status(200)
      .json({ message: "Update successful", agenda: updatedAgenda });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// --- ELIMINAR AGENDA ---
const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await agendaService.deleteAgenda(id);
    if (!deleted) {
      return res.status(404).json({ message: "Agenda not found" });
    }
    res.status(200).json({ message: "Agenda deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { create, getByUser, addUser, removeUser, update, remove };
