import Company from '../../models/company.model.js';

export default async function updateProfile(req, res) {
  try {
    const companyId = req.userId; // from verifyToken middleware
    const updates = req.body;

    // Only allow updates to these fields
    const allowedUpdates = ['name', 'email', 'profileImage'];
    const isValidOperation = Object.keys(updates).every(key => allowedUpdates.includes(key));

    if (!isValidOperation) {
      return res.status(400).json({ message: 'Invalid update fields' });
    }

    const company = await Company.findByIdAndUpdate(
      companyId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    res.status(200).json({
      message: 'Company profile updated successfully',
      company,
    });
  } catch (error) {
    console.error('Update Company Profile Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
