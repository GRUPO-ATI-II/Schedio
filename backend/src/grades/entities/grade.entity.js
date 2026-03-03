const mongoose = require("mongoose");

const GradeSchema = new mongoose.Schema(
  {
    score: {
      type: Number,
      required: [true, "La nota es obligatoria"],
      min: 0,
      max: 20,
    },

    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
    },

    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

module.exports = mongoose.model("Grade", GradeSchema);
