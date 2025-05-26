import User from '../../models/user.model.js';

export default async function searchProfiles(req, res) {
  try {
    const queryParams = req.query;

    // Ensure exactly one query parameter is provided
    const keys = Object.keys(queryParams);
    if (keys.length !== 1) {
      return res.status(400).json({ message: 'Please provide exactly one query parameter' });
    }

    const key = keys[0];
    let value = queryParams[key];

    // Define allowed searchable fields
    const allowedFields = ['email', 'name', 'designation', 'isPremium', 'isVerified'];
    if (!allowedFields.includes(key)) {
      return res.status(400).json({ message: 'Invalid search field' });
    }

    // Construct search criteria
    const searchCriteria = {};

    // Handle boolean fields
    if (key === 'isPremium' || key === 'isVerified') {
      // Convert string to boolean
      if (value === 'true') {
        value = true;
      } else if (value === 'false') {
        value = false;
      } else {
        return res.status(400).json({ message: 'Invalid value for boolean field' });
      }
      searchCriteria[key] = value;
    } else {
      // For string fields, use case-insensitive regex
      searchCriteria[key] = new RegExp(`^${value}$`, 'i');
    }

    const users = await User.find(searchCriteria).select('-password');

    res.status(200).json({
      message: 'Search results',
      users,
    });
  } catch (error) {
    console.error('Search Profiles Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
