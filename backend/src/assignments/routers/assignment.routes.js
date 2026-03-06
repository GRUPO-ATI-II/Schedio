const express = require("express");
const router = express.Router();
const assignmentController = require("../controllers/assignments.controller");

router.post("/", assignmentController.create);
router.get("/subject/:subjectId", assignmentController.getBySubject);

module.exports = router;
