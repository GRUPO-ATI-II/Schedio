const mongoose = require("mongoose");

/**
 * Grade representa un nivel o ciclo académico al que pertenece un usuario.
 * Ejemplos: "1er Ciclo", "5to Ciclo", "8vo Ciclo".
 *
 * NOTA: Las calificaciones numéricas están en la entidad GradeRecord.
 */
const GradeSchema = new mongoose.Schema(
  {
    value: {
      type: String,
      required: [true, "El valor del nivel académico es obligatorio"],
      unique: true,
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

module.exports = mongoose.model("Grade", GradeSchema);
