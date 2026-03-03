const express = require("express");
const router = express.Router();
const reminderController = require("../controllers/reminders.controller");

router.post("/", reminderController.create);
router.get("/agenda/:agendaId", reminderController.getByAgenda);
router.put("/:id", reminderController.update);
router.delete("/:id", reminderController.remove);

module.exports = router;
