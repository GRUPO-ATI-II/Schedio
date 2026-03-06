const User = require("../entities/user.entity");
const bcrypt = require("bcryptjs");

class UserService {
  async findByEmail(email) {
    return await User.findOne({ email }).lean();
  }

  async getUserIdByUsername(username) {
    const user = await User.findOne({ username }).select("_id").lean();
    return user ? user._id : null;
  }

  async loginUser(email, password) {
    const user = await User.findOne({ email });
    if (!user) return null;
    const isMatch = await bcrypt.compare(password, user.password);
    return isMatch ? user : null;
  }

  async createUser(userData) {
    const { password, ...rest } = userData;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({ ...rest, password: hashedPassword });
    return await newUser.save();
  }

  async getUser(email) {
    return await User.findOne({ email });
  }

  async updateUser(email, field, newValue) {
    return await User.findOneAndUpdate(
      { email },
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
