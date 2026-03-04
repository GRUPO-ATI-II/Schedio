const express = require("express");
const router = express.Router();
const gradeController = require("../controllers/grades.controller");

// Crear registro de nota
router.post("/", gradeController.create);

// Obtener notas de un usuario por materia
router.get("/user/:userId/subject/:subjectId", gradeController.getBySubject);

// Obtener promedio de un usuario por materia
router.get(
  "/user/:userId/subject/:subjectId/average",
  gradeController.getAverage,
);

// Obtener todas las notas de una asignación
router.get("/assignment/:assignmentId", gradeController.getByAssignment);

// Actualizar nota
router.put("/:id", gradeController.update);

module.exports = router;
