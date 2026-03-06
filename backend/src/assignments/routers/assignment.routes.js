const express = require("express");
const router = express.Router();
const assignmentController = require("../controllers/assignments.controller");

router.post("/", assignmentController.create);
router.get("/", assignmentController.getAll);
router.get("/subject/:subjectId", assignmentController.getBySubject);
router.put("/:id", assignmentController.update);

module.exports = router;
