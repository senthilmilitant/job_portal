import User from '../../models/user.model.js';

export default async function uploadProfileImage(req, res) {
  try {
    const userId = req.userId;// User ID from the token

    // Ensure file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded' });
    }

    const imageUrl = `/uploads/${req.file.filename}`; // Adjust based on your storage path

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profileImage: imageUrl },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'Profile image uploaded successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Upload Profile Image Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
