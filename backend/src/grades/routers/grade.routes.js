const express = require("express");
const router = express.Router();
const gradeController = require("../controllers/grades.controller");

router.post("/", gradeController.create);
router.get("/user/:userId/subject/:subjectId", gradeController.getByUser);

module.exports = router;
