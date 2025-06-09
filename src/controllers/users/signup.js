import User from '../../models/user.model.js';
import Otp from '../../models/otp.model.js';
import {generateOtp} from '../../utils/generateOtp.js';
import {sendEmail} from '../../utils/sendEmail.js';

export default async function userSignup(req, res) {
  try {
    const { email } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

// Generate OTP
    const otp = generateOtp();

await Otp.findOneAndUpdate(
      { email },
      { email, otp },
      { upsert: true, new: true }
    );
    
    await sendEmail(email, 'OTP Verification', `Your OTP is ${otp}`);

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (err) {
    console.error('Signup Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}
