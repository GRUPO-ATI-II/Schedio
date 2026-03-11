const express = require("express");
const habitController = require("../controllers/habit.controller");
const router = express.Router();

router.post("/", habitController.create);
router.get("/user/:userId", habitController.getByUser);
router.get("/:id", habitController.getById);
router.put("/:id", habitController.update);
router.delete("/:id", habitController.remove);
router.post("/:id/complete", habitController.complete);

module.exports = router;
