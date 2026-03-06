const Agenda = require("../entities/agenda.entity");
const Task = require("../entities/task.entity");

class AgendaService {
  async createAgenda(agendaData) {
    const newAgenda = new Agenda(agendaData);
    return await newAgenda.save();
  }

  async createTask(taskData) {
    const newTask = new Task(taskData);
    return await newTask.save();
  }

  async getAgendasByUserId(userId) {
    return await Agenda.find({ users: userId })
      .populate("users", "firstName lastName username email")
      .sort({ creation_time: -1 });
  }

  async addUserToAgenda(agendaId, userId) {
    return await Agenda.findByIdAndUpdate(
      agendaId,
      { $addToSet: { users: userId } },
      { new: true, runValidators: true },
    );
  }

  async removeUserFromAgenda(agendaId, userId) {
    return await Agenda.findByIdAndUpdate(
      agendaId,
      { $pull: { users: userId } },
      { new: true },
    );
  }

  async updateAgenda(agendaId, field, newValue) {
    return await Agenda.findByIdAndUpdate(
      agendaId,
      { $set: { [field]: newValue } },
      { new: true, runValidators: true },
    );
  }

  async getFullAgendaWithTasksByUserId(userId) {
    const agendas = await Agenda.find({ users: userId })
      .populate("users", "firstName lastName username email")
      .lean();

    return await Promise.all(
      agendas.map(async (agenda) => {
        const tasks = await Task.find({ agenda: agenda._id }).sort({
          expiration_date: 1,
        });
        return {
          ...agenda,
          tasks: tasks.map((task) => this._formatTask(task)),
        };
      }),
    );
  }

  _formatTask(task) {
    const now = new Date();
    const expDate = new Date(task.expiration_date);
    const diffTime = expDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let status = "A tiempo";
    let urgency = "ontime";

    if (task.is_completed) {
      status = "Completado";
      urgency = "ontime";
    } else if (diffDays < 0) {
      status = `Atrasado por ${Math.abs(diffDays)} días`;
      urgency = "overdue";
    } else if (diffDays <= 2) {
      status = `Vence en ${diffDays} día${diffDays === 1 ? "" : "s"}`;
      urgency = "warning";
    }

    return {
      id: task._id,
      title: task.title,
      date: expDate.toLocaleDateString("es-ES", {
        weekday: "long",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }),
      time: task.delivery_interval,
      status: status,
      urgency: urgency,
      is_completed: task.is_completed,
    };
  }

  async deleteAgenda(agendaId) {
    await Task.deleteMany({ agenda: agendaId });
    return await Agenda.findByIdAndDelete(agendaId);
  }
}

module.exports = new AgendaService();
