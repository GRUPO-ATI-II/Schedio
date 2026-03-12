const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");

router.post("/register", userController.register);
router.post("/login", userController.login);
router.put("/:email", userController.update);
router.delete("/:email", userController.remove);

module.exports = router;
