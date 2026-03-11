const User = require("../entities/user.entity");
const bcrypt = require("bcryptjs");

class UserService {
    /**
     * Actualiza campos de usuario por _id
     * @param {string} userId - MongoDB _id
     * @param {object} fields - Objeto con los campos a actualizar
     * @returns {Promise<User|null>}
     */
    async updateUserById(userId, fields) {
      // Verifica existencia
      const user = await User.findById(userId);
      if (!user) return null;

      // Si se actualiza password, hashearla
      if (fields.password) {
        const salt = await bcrypt.genSalt(10);
        fields.password = await bcrypt.hash(fields.password, salt);
      }

      // Actualiza los campos
      return await User.findByIdAndUpdate(
        userId,
        { $set: fields },
        { new: true, runValidators: true }
      );
    }
  async findByEmail(email) {
    // Usamos .lean() para mejorar rendimiento si solo queremos verificar existencia
    return await User.findOne({ email }).lean();
  }

  async loginUser(email, password) {
    const user = await User.findOne({ email });
    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;

    return user;
  }

  async createUser(userData) {
    const { password, ...rest } = userData;

    // Hash de contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      ...rest,
      password: hashedPassword,
    });

    return await newUser.save();
  }

  async getUser(email) {
    return await User.findOne({ email });
  }

  async updateUser(email, field, newValue) {
    // Verificamos si existe primero
    const userExists = await this.findByEmail(email);
    if (!userExists) return null;

    return await User.findOneAndUpdate(
      { email: email },
      { $set: { [field]: newValue } },
      { new: true, runValidators: true },
    );
  }

  async deleteUser(email) {
    const user = await this.getUser(email);
    if (!user) return null;

    return await User.findByIdAndDelete(user._id);
  }
}

module.exports = new UserService();
