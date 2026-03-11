const mongoose = require("mongoose");

const HabitSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre del hábito es obligatorio"],
    },
    description: {
      type: String,
      default: "",
    },
    frequency: {
      type: String,
      enum: ["daily", "weekly"],
      default: "daily",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    completions: [
      {
        type: Date,
      },
    ],
    streak: {
      type: Number,
      default: 0,
    },
    lastCompleted: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("Habit", HabitSchema);
