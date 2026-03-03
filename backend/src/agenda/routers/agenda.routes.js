const express = require("express");
const router = express.Router();
const agendaController = require("../controllers/agenda.controller");

router.post("/", agendaController.create);
router.get("/user/:userId", agendaController.getByUser);
router.put("/:id", agendaController.update);
router.delete("/:id", agendaController.remove);

module.exports = router;
