const express = require("express");
const router = express.Router();
const subjectController = require("../controllers/subject.controller");

router.post("/", subjectController.createSubject);
router.post("/enroll", subjectController.enroll);
router.get("/user/:userId", subjectController.getStudentSubjects);
router.delete("/unenroll/:userId/:subjectId", subjectController.unenroll);

module.exports = router;
