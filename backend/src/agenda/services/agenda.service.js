const Agenda = require("../entities/agenda.entity");

class AgendaService {
  async createAgenda(agendaData) {
    const newAgenda = new Agenda(agendaData);
    return await newAgenda.save();
  }

  async getAgendaByUserId(userId) {
    const agenda = await Agenda.findOne({ user: userId });
    if (!agenda) {
      return null;
    }
    return agenda;
  }

  async getAgendaById(agendaId) {
    const agenda = await Agenda.findById(agendaId);
    if (!agenda) {
      return null;
    }
    return agenda;
  }

  async updateAgenda(agendaId, field, newValue) {
    const agenda = await this.getAgendaById(agendaId);
    if (!agenda) {
      return null;
    }
    return await Agenda.findByIdAndUpdate(
      agendaId,
      { $set: { [field]: newValue } },
      { new: true, runValidators: true },
    );
  }

  async deleteAgenda(agendaId) {
    const agenda = await this.getAgendaById(agendaId);
    if (!agenda) {
      return null;
    }
    return await Agenda.findByIdAndDelete(agendaId);
  }
}

module.exports = new AgendaService();
