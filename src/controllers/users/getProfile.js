import User from '../../models/user.model.js';

export default async function getProfile(req, res) {
  try {
    // Get the user ID from the request object (populated by verifyToken middleware)
    const userId = req.userId;

    // Find the user by ID and exclude the password from the result
    const user = await User.findById(userId).select('-password');

    // If user not found, send a 404 response
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // If user found, return success response with user data
    res.status(200).json({
      message: 'Profile fetched successfully',
      user,
    });
  } catch (error) {
    // Log and send an internal server error response
    console.error('Get Profile Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
