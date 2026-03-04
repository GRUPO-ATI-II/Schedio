const express = require("express");
const router = express.Router();
const agendaController = require("../controllers/agenda.controller");

// CRUD básico
router.post("/", agendaController.create);
router.get("/user/:userId", agendaController.getByUser);
router.put("/:id", agendaController.update);
router.delete("/:id", agendaController.remove);

// Gestión de relación M:N Agenda ↔ User
router.post("/:id/users", agendaController.addUser);
router.delete("/:id/users", agendaController.removeUser);

module.exports = router;
