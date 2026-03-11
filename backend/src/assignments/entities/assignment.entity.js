const mongoose = require("mongoose");

const AssignmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "El titulo es obligatorio"],
    },
    instructions: {
      type: String,
      default: null,
    },
    deadline: {
      type: Date,
      required: [true, "La fecha de entrega es obligatoria"],
    },
    ponderation: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    send_time: {
      type: Date,
      default: null,
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

module.exports = mongoose.model("Assignment", AssignmentSchema);
