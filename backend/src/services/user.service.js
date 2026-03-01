const User = require('../entities/user.entity');
const bcrypt = require('bcryptjs');

class UserService {
  async registerUser(userData) {
    const { password, ...rest } = userData;

    // this encrypts the password
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

  async loginUser(email, password) {
    const user = await User.findOne({ email });
    if (!user) {
        return null; // incorrect email
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return null; // incorrect password
    }

    return user;
  }
}

module.exports = new UserService();