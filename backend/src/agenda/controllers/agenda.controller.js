const agendaService = require("../services/agenda.service");

// --- CREAR AGENDA ---
const create = async (req, res) => {
  try {
    // El cuerpo debe contener el userId (ej: { "user": "ID_DE_MONGO" })
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

// --- OBTENER AGENDA POR USUARIO ---
const getByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const agenda = await agendaService.getAgendaByUserId(userId);

    if (!agenda) {
      return res.status(404).json({ message: "No agenda found for this user" });
    }

    res.status(200).json(agenda);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// --- ACTUALIZAR AGENDA ---
const update = async (req, res) => {
  try {
    const { id } = req.params; // El ID de la agenda
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

module.exports = { create, getByUser, update, remove };
