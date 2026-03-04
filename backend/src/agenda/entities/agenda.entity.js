const mongoose = require("mongoose");

/**
 * Agenda soporta relación M:N con User.
 * Una agenda puede ser compartida por múltiples usuarios (e.g. agenda grupal),
 * y un usuario puede pertenecer a múltiples agendas.
 */
const AgendaSchema = new mongoose.Schema(
  {
    users: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      validate: {
        validator: (arr) => arr.length > 0,
        message: "La agenda debe tener al menos un usuario vinculado",
      },
    },

    creation_time: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

module.exports = mongoose.model("Agenda", AgendaSchema);
