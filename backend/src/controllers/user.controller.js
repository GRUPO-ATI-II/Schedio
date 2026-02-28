const userService = require('../services/user.service');

const register = async (req, res) => {
  try {
    const existingUser = await userService.findByEmail(req.body.email);
    if (existingUser) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    const savedUser = await userService.registerUser(req.body);
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { register };