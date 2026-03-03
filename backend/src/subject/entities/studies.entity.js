const mongoose = require("mongoose");

const StudiesSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
    enrollment_date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

StudiesSchema.index({ user: 1, subject: 1 }, { unique: true });

module.exports = mongoose.model("Studies", StudiesSchema);
