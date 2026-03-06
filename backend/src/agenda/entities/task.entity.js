const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    expiration_date: { type: Date, required: true },
    delivery_interval: { type: String, required: true, trim: true },
    is_completed: { type: Boolean, default: false },
    agenda: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agenda",
      required: true,
    },
  },
  { timestamps: true, versionKey: false },
);

module.exports = mongoose.model("Task", TaskSchema);
