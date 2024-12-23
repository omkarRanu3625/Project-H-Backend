// Login Controller
const bcrypt = require('bcryptjs');
const User = require('../../models/User');
const { generateToken } = require('../../config/configJWT');

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({Status:0, Message: 'Invalid credentials' });
    }

    // Check if the user is verified
    if (!user.isVerified) {
      return res.status(400).json({Status:0, Message: 'Email is not verified' });
    }

    // Check if the password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({Status:0, Message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = generateToken({ userId: user._id, email: user.email });

    return res.status(200).json({Status:1, Message: 'Login successful', token });
  } catch (error) {
    return res.status(500).json({Status:0, Message: 'Something went wrong', error });
  }
};

module.exports = { login };
