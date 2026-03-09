const express = require("express");
const router = express.Router();
const assignmentController = require("../controllers/assignments.controller");

router.post("/", assignmentController.create);
router.get("/", assignmentController.getAll);
router.get("/subject/:subjectId", assignmentController.getBySubject);
router.put("/:id", assignmentController.update);

// fetch a single assignment by id and update
router.get("/:id", assignmentController.getById);
router.put("/:id", assignmentController.update);
router.delete("/:id", assignmentController.remove);

module.exports = router;
