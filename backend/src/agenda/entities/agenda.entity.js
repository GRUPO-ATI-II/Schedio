const mongoose = require("mongoose");

const AgendaSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "La agenda debe estar vinculada a un usuario"],
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
