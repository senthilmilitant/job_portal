import User from '../../models/user.model.js';

export default async function updateProfile(req, res) {
  try {
    const userId = req.userId; // User ID from the token
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const { name, designation, profileImage, isPremium } = req.body;

    const updatedData = {};
    if (name) updatedData.name = name;
    if (designation) updatedData.designation = designation;
    if (profileImage) updatedData.profileImage = profileImage;
    if (isPremium) updatedData.isPremium = isPremium;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updatedData },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Update Profile Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
