const Agenda = require("../entities/agenda.entity");

class AgendaService {
  // Crea una agenda. Body esperado: { users: ["userId1", ...] }
  async createAgenda(agendaData) {
    const newAgenda = new Agenda(agendaData);
    return await newAgenda.save();
  }

  // Devuelve todas las agendas en las que participa un usuario
  async getAgendasByUserId(userId) {
    return await Agenda.find({ users: userId })
      .populate("users", "firstName lastName username email")
      .sort({ creation_time: -1 });
  }

  async getAgendaById(agendaId) {
    return await Agenda.findById(agendaId).populate(
      "users",
      "firstName lastName username email",
    );
  }

  // Agrega un usuario a una agenda existente
  async addUserToAgenda(agendaId, userId) {
    return await Agenda.findByIdAndUpdate(
      agendaId,
      { $addToSet: { users: userId } }, // $addToSet evita duplicados
      { new: true, runValidators: true },
    );
  }

  // Remueve un usuario de una agenda
  async removeUserFromAgenda(agendaId, userId) {
    return await Agenda.findByIdAndUpdate(
      agendaId,
      { $pull: { users: userId } },
      { new: true },
    );
  }

  async updateAgenda(agendaId, field, newValue) {
    const agenda = await this.getAgendaById(agendaId);
    if (!agenda) return null;
    return await Agenda.findByIdAndUpdate(
      agendaId,
      { $set: { [field]: newValue } },
      { new: true, runValidators: true },
    );
  }

  async deleteAgenda(agendaId) {
    const agenda = await this.getAgendaById(agendaId);
    if (!agenda) return null;
    return await Agenda.findByIdAndDelete(agendaId);
  }
}

module.exports = new AgendaService();
