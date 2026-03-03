const mongoose = require("mongoose");

const ReminderSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: [true, "La descripción del recordatorio es obligatoria"],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, "La fecha y hora del recordatorio son obligatorias"],
    },

    agenda: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agenda",
      required: true,
    },

    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      default: null,
    },

    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

module.exports = mongoose.model("Reminder", ReminderSchema);
