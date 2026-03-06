const express = require("express");
const router = express.Router();
const assignmentController = require("../controllers/assignments.controller");

router.post("/", assignmentController.create);
router.get("/subject/:subjectId", assignmentController.getBySubject);

// fetch a single assignment by id and update
router.get("/:id", assignmentController.getById);
router.put("/:id", assignmentController.update);

module.exports = router;
