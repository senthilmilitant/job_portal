import bcrypt from 'bcrypt';
import Company from '../../models/company.model.js';
import Otp from '../../models/otp.model.js';

export default async function verifyOtp(req, res) {
  try {
    const { email, otp, password, name } = req.body;

    // Find OTP entry
    const otpEntry = await Otp.findOne({ email });
    if (!otpEntry || otpEntry.otp !== otp) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Check if OTP is expired (valid for 5 minutes)
    const timeDiff = Date.now() - new Date(otpEntry.createdAt).getTime();
    if (timeDiff > 5 * 60 * 1000) {
      await Otp.deleteOne({ email });
      return res.status(400).json({ message: 'OTP expired' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new company
    const newCompany = new Company({
      name,
      email,
      password: hashedPassword,
      isVerified: true,
    });

    await newCompany.save();
    await Otp.deleteOne({ email }); // Cleanup OTP entry

    res.status(201).json({ message: 'Company signup successful' });
  } catch (error) {
    console.error('Verify OTP Error (Company):', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
