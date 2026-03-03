const reminderService = require("../services/reminders.service");

// --- CREAR RECORDATORIO ---
const create = async (req, res) => {
  try {
    // req.body debe traer: description, date, agenda (ID) y opcionalmente event (ID)
    const newReminder = await reminderService.createReminder(req.body);
    res.status(201).json({
      message: "Reminder created successfully",
      reminder: newReminder,
    });
  } catch (error) {
    console.error("❌ [Reminder Controller Error]:", error.message);
    res.status(500).json({ error: "Error creating reminder" });
  }
};

// --- OBTENER POR AGENDA ---
const getByAgenda = async (req, res) => {
  try {
    const { agendaId } = req.params;
    const reminders = await reminderService.getRemindersByAgenda(agendaId);

    // Devolvemos lista vacía si no hay, pero con status 200
    res.status(200).json(reminders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// --- ACTUALIZAR ---
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { field, newValue } = req.body;

    const updated = await reminderService.updateReminder(id, field, newValue);

    if (!updated) {
      return res.status(404).json({ message: "Reminder not found" });
    }

    res.status(200).json({ message: "Reminder updated", reminder: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// --- ELIMINAR ---
const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await reminderService.deleteReminder(id);

    if (!deleted) {
      return res.status(404).json({ message: "Reminder not found" });
    }

    res.status(200).json({ message: "Reminder deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { create, getByAgenda, update, remove };
