import bcrypt from 'bcrypt';
import User from '../../models/user.model.js';
import Company from '../../models/company.model.js';
import Otp from '../../models/otp.model.js';

export default async function verifyOtp(req, res) {
  try {
    const { email, otp, password, name, role, isPremium, designation, profileImage } = req.body;

    if (!['user', 'company'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const otpEntry = await Otp.findOne({ email });
    if (!otpEntry || otpEntry.otp !== otp) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    const timeDiff = Date.now() - otpEntry.createdAt.getTime();
    if (timeDiff > 5 * 60 * 1000) {
      await Otp.deleteOne({ email });
      return res.status(400).json({ message: 'OTP expired' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    if (role === 'user') {
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        isPremium: !!isPremium,           // cast to boolean
        designation: designation?.trim(), // optional
        profileImage: profileImage || '', // optional
      });
      await newUser.save();
    } else {
      const newCompany = new Company({
        name,
        email,
        password: hashedPassword,
        // Add any company-specific fields here if needed
      });
      await newCompany.save();
    }

    await Otp.deleteOne({ email }); // Cleanup OTP

    return res.status(201).json({ message: 'Signup successful' });
  } catch (err) {
    console.error('OTP verification error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}
