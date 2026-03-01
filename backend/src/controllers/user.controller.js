const userService = require('../services/user.service');

const register = async (req, res) => {
  try {
    console.log("📥 Procesando registro para:", req.body.email);
    const existingUser = await userService.findByEmail(req.body.email);
    if (existingUser) {
      return res.status(400).json({ message: "The user already exists" });
    }

    const savedUser = await userService.registerUser(req.body);
    res.status(201).json(savedUser);
  } catch (error) {
    console.error("❌ ERROR DETECTADO:");
    console.error("Mensaje:", error.message);
    console.error("Stack:", error.stack);
    res.status(500).json({ error: error.message });
  }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("Login attempt for:", email);

        const user = await userService.loginUser(email, password);

        if (!user) {
            return res.status(401).json({ message: "Invalid email or password "});
        }

        res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName
            }
        });
    } catch (error) {
        console.error("Login error:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports = { register, login };