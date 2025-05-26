export default async function logout(req, res) {
  try {
    // On client, token is usually removed — on server you can optionally blacklist it (Redis, DB, etc.)
    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
