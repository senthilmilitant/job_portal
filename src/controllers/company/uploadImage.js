import Company from '../../models/company.model.js';

export default async function uploadImage(req, res) {
  try {
    const companyId = req.userId;

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    company.profileImage = req.file.path;
    await company.save();

    res.status(200).json({
      message: 'Profile image uploaded successfully',
      profileImage: company.profileImage,
    });
  } catch (error) {
    console.error('Upload Profile Image Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
