const mongoose = require("mongoose");

/**
 * GradeRecord almacena la calificación numérica obtenida por un usuario
 * en una tarea específica dentro de una materia.
 *
 * Esta entidad reemplaza la lógica que antes estaba en "Grade" (que ahora
 * representa solo el nivel académico del usuario).
 *
 * Relaciones del diagrama ER:
 *   - Grade --Qualifies--> Assignment (via Subject) → modelado aquí
 *   - User (quien recibe la nota)
 *   - Assignment (la tarea evaluada)
 *   - Subject (la materia a la que pertenece)
 */
const GradeRecordSchema = new mongoose.Schema(
  {
    score: {
      type: Number,
      required: [true, "La nota es obligatoria"],
      min: [0, "La nota no puede ser menor a 0"],
      max: [20, "La nota no puede ser mayor a 20"],
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "El registro de nota debe estar vinculado a un usuario"],
    },

    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
      required: [true, "El registro de nota debe estar vinculado a una tarea"],
    },

    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: [
        true,
        "El registro de nota debe estar vinculado a una materia",
      ],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Índice para evitar que un usuario tenga dos notas para la misma tarea
GradeRecordSchema.index({ user: 1, assignment: 1 }, { unique: true });

module.exports = mongoose.model("GradeRecord", GradeRecordSchema);
