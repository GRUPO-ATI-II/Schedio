const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    username: { type: String, required: true, unique: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    phone: { type: String, default: null, trim: true },
    birthDate: { type: Date, required: true },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    grade: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Grade",
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

module.exports = mongoose.model("User", userSchema);
