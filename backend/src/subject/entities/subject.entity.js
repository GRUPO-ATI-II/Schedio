const mongoose = require("mongoose");

const SubjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre de la materia es obligatorio"],
      unique: true, // Para que no se repitan materias globales
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

module.exports = mongoose.model("Subject", SubjectSchema);
