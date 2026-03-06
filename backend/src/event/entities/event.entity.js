const mongoose = require("mongoose");

/**
 * Event soporta relación M:N con Agenda.
 * Un evento puede aparecer en múltiples agendas y
 * una agenda puede tener múltiples eventos.
 */
const EventSchema = new mongoose.Schema(
  {
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    date: {
      type: Date,
      required: [true, "La fecha del evento es obligatoria"],
    },

    agendas: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Agenda",
        },
      ],
      validate: {
        validator: (arr) => arr.length > 0,
        message: "El evento debe estar vinculado a al menos una agenda",
      },
    },

    // Relación opcional con Subject (extensión no presente en el ER, pero válida)
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

module.exports = mongoose.model("Event", EventSchema);
