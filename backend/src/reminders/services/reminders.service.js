const Reminder = require("../entities/reminders.entity");

class ReminderService {
  async createReminder(reminderData) {
    const newReminder = new Reminder(reminderData);
    return await newReminder.save();
  }

  async getRemindersByAgenda(agendaId) {
    return await Reminder.find({ agenda: agendaId }).sort({ date: 1 });
  }

  async getReminderById(id) {
    const reminder = await Reminder.findById(id);
    return reminder || null;
  }

  async updateReminder(id, field, newValue) {
    const exists = await this.getReminderById(id);
    if (!exists) return null;

    return await Reminder.findByIdAndUpdate(
      id,
      { $set: { [field]: newValue } },
      { new: true, runValidators: true },
    );
  }

  async deleteReminder(id) {
    const exists = await this.getReminderById(id);
    if (!exists) return null;

    return await Reminder.findByIdAndDelete(id);
  }
}

module.exports = new ReminderService();
