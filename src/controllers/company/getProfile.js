import Company from '../../models/company.model.js';

export default async function getProfile(req, res) {
  try {
    const companyId = req.userId; // Assuming verifyToken middleware sets req.user

    const company = await Company.findById(companyId).select('-password');
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    res.status(200).json({
      message: 'Company profile fetched successfully',
      company,
    });
  } catch (error) {
    console.error('Company Get Profile Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
