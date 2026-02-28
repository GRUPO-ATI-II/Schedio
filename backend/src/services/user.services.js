const User = require('../entities/user.entity');
const bcrypt = require('bcryptjs');

class UserService {
  async registerUser(userData) {
    const { password, ...rest } = userData;

    // this encripts the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      ...rest,
      password: hashedPassword
    });

    return await newUser.save();
  }

  async findByEmail(email) {
    return await User.findOne({ email });
  }
}

module.exports = new UserService();