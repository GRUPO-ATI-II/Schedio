const mongoose = require("mongoose");

/**
 * Reminder siempre es creado por un Event (relación "Creates" del diagrama ER).
 * También mantiene referencia directa a la Agenda a la que pertenece.
 */
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
      required: [true, "El recordatorio debe estar vinculado a una agenda"],
    },

    // Según el diagrama ER: Event --Creates--> Reminder (1:M), event es requerido
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: [true, "El recordatorio debe estar vinculado a un evento"],
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
