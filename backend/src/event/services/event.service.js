const Event = require("../entities/event.entity");

class EventService {
  // Body esperado: { description, date, agendas: ["agendaId1", ...], subject? }
  async createEvent(eventData) {
    const newEvent = new Event(eventData);
    return await newEvent.save();
  }

  // Devuelve todos los eventos que pertenecen a una agenda específica
  async getEventsByAgenda(agendaId) {
    return await Event.find({ agendas: agendaId })
      .populate("agendas", "creation_time")
      .populate("subject", "name")
      .sort({ date: 1 });
  }

  async getEventById(id) {
    return await Event.findById(id)
      .populate("agendas", "creation_time")
      .populate("subject", "name");
  }

  // Agrega una agenda al evento (relación M:N)
  async addAgendaToEvent(eventId, agendaId) {
    return await Event.findByIdAndUpdate(
      eventId,
      { $addToSet: { agendas: agendaId } },
      { new: true, runValidators: true },
    );
  }

  // Remueve una agenda del evento
  async removeAgendaFromEvent(eventId, agendaId) {
    return await Event.findByIdAndUpdate(
      eventId,
      { $pull: { agendas: agendaId } },
      { new: true },
    );
  }

  async updateEvent(id, field, newValue) {
    const event = await this.getEventById(id);
    if (!event) return null;
    return await Event.findByIdAndUpdate(
      id,
      { $set: { [field]: newValue } },
      { new: true, runValidators: true },
    );
  }

  async deleteEvent(id) {
    const event = await this.getEventById(id);
    if (!event) return null;
    return await Event.findByIdAndDelete(id);
  }
}

module.exports = new EventService();
