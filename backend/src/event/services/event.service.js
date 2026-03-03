const Event = require("../entities/event.entity");

class EventService {
  async createEvent(eventData) {
    const newEvent = new Event(eventData);
    return await newEvent.save();
  }

  async getEventsByAgenda(agendaId) {
    return await Event.find({ agenda: agendaId }).sort({ date: 1 });
  }

  async getEventById(id) {
    return await Event.findById(id);
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
