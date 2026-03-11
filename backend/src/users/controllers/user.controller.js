// --- ACTUALIZACIÓN POR ID ---
const updateById = async (req, res) => {
  try {
    const { id } = req.params;
    const fields = req.body;
    const updatedUser = await userService.updateUserById(id, fields);
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "Update successful", user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const userService = require("../services/user.service");

// --- LOGIN ---
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userService.loginUser(email, password);

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error) {
    console.error("❌ [Login Error]:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// --- REGISTRO ---
const register = async (req, res) => {
  try {
    const { email } = req.body;
    console.log("📥 [Controller] Registrando:", email);

    // 1. Verificación manual previa
    const existingUser = await userService.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "The user already exists" });
    }

    // 2. Intento de creación
    const savedUser = await userService.createUser(req.body);

    res.status(201).json({
      message: "User created successfully",
      user: { id: savedUser._id, email: savedUser.email },
    });
  } catch (error) {
    // 3. Manejo de errores específicos de Mongoose/MongoDB
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: error.message });
    }

    if (error.code === 11000) {
      return res.status(400).json({ message: "The email is already in use" });
    }

    console.error("❌ [Register Error]:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// --- ACTUALIZACIÓN ---
const update = async (req, res) => {
  try {
    const { email } = req.params;
    const { field, newValue } = req.body;

    const updatedUser = await userService.updateUser(email, field, newValue);

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Update successful", user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// --- ELIMINACIÓN ---
const remove = async (req, res) => {
  try {
    const { email } = req.params;
    const deletedUser = await userService.deleteUser(email);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { register, login, update, remove, updateById };
