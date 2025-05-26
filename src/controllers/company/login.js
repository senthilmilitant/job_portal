import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Company from '../../models/company.model.js';

export default async function login(req, res) {
  try {
    const { email, password } = req.body;

    // Find company by email
    const company = await Company.findOne({ email });
    if (!company) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, company.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token with role
    const token = jwt.sign(
      { id: company._id, role: 'company' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Send response
    res.status(200).json({message: 'Login successful',token, company });
    } catch (error) {
    console.error('Company Login Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
