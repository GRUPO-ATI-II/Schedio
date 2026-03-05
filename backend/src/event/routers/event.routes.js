const express = require("express");
const router = express.Router();
const eventController = require("../controllers/event.controller");

// CRUD básico
router.post("/", eventController.create);
router.get("/agenda/:agendaId", eventController.getByAgenda);
router.put("/:id", eventController.update);
router.delete("/:id", eventController.remove);

// Gestión de relación M:N Event ↔ Agenda
router.post("/:id/agendas", eventController.addAgenda);
router.delete("/:id/agendas", eventController.removeAgenda);

module.exports = router;
