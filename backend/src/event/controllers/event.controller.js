const eventService = require("../services/event.service");

// --- CREAR EVENTO ---
const create = async (req, res) => {
  try {
    // Body esperado: { description, date, agendas: ["agendaId1", ...], subject? }
    const newEvent = await eventService.createEvent(req.body);
    res.status(201).json({
      message: "Event created successfully",
      event: newEvent,
    });
  } catch (error) {
    console.error("❌ [Event Controller Error]:", error.message);
    res.status(500).json({ error: "Error creating event" });
  }
};

// --- OBTENER POR AGENDA ---
const getByAgenda = async (req, res) => {
  try {
    const { agendaId } = req.params;
    const events = await eventService.getEventsByAgenda(agendaId);
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// --- AGREGAR AGENDA A EVENTO (M:N) ---
const addAgenda = async (req, res) => {
  try {
    const { id } = req.params;
    const { agendaId } = req.body;
    const updated = await eventService.addAgendaToEvent(id, agendaId);
    if (!updated) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json({ message: "Agenda added to event", event: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// --- REMOVER AGENDA DE EVENTO (M:N) ---
const removeAgenda = async (req, res) => {
  try {
    const { id } = req.params;
    const { agendaId } = req.body;
    const updated = await eventService.removeAgendaFromEvent(id, agendaId);
    if (!updated) {
      return res.status(404).json({ message: "Event not found" });
    }
    res
      .status(200)
      .json({ message: "Agenda removed from event", event: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// --- ACTUALIZAR ---
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { field, newValue } = req.body;
    const updated = await eventService.updateEvent(id, field, newValue);
    if (!updated) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json({ message: "Event updated", event: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// --- ELIMINAR ---
const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await eventService.deleteEvent(id);
    if (!deleted) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  create,
  getByAgenda,
  addAgenda,
  removeAgenda,
  update,
  remove,
};
