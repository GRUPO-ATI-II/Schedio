const express = require("express");
const router = express.Router();
const eventController = require("../controllers/event.controller");

router.post("/", eventController.create);
router.get("/agenda/:agendaId", eventController.getByAgenda);
router.put("/:id", eventController.update);
router.delete("/:id", eventController.remove);

module.exports = router;
