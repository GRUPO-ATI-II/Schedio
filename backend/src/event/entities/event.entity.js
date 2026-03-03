const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: [true, "La descripción del evento es obligatoria"],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, "La fecha del evento es obligatoria"],
    },

    agenda: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agenda",
      required: true,
    },

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
