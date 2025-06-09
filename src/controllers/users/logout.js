import jwt from 'jsonwebtoken';  
import BlacklistedToken from '../../models/blacklistedToken.model.js';

const logout = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) return res.status(400).json({ message: 'No token provided' });

  const decoded = jwt.decode(token);
  const expiry = new Date(decoded.exp * 1000);

  await BlacklistedToken.create({ token, expiresAt: expiry });

  res.status(200).json({ message: 'Successfully logged out' });
};

export default logout;
