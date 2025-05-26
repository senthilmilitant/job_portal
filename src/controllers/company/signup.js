import Company from '../../models/company.model.js';
import Otp from '../../models/otp.model.js';
import {generateOtp} from '../../utils/generateOtp.js';
import {sendEmail} from '../../utils/sendEmail.js';

export default async function signup(req, res) {
  try {
    const { name, email } = req.body;

    const existingCompany = await Company.findOne({ email });
    if (existingCompany) {
      return res.status(400).json({ message: 'Company already exists' });
    }

    const otp = generateOtp();

    // Save or update OTP in database
    await Otp.findOneAndUpdate(
      { email },
      { email, otp, createdAt: new Date() },
      { upsert: true, new: true }
    );

    // Send OTP via email
    await sendEmail(email, 'Your OTP for Company Signup', `Your OTP is: ${otp}`);

    res.status(200).json({ message: 'OTP sent to email' });
  } catch (error) {
    console.error('Company Signup Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
