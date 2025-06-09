import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../../models/user.model.js';

export default async function login(req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email ' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid  password' });
    }

    const token = jwt.sign(
      { id: user._id, role: 'user', isPremium: user.isPremium },
      process.env.JWT_SECRET,
      { expiresIn: '7d'}
    );

    res.status(200).json({
      message: 'Login successful',token,user});
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}
