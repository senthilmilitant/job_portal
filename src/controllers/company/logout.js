export default async function logout(req, res) {
  try {
    // Since JWT is stateless, to "logout", the client should simply delete the token
    // Optionally, you could implement a token blacklist mechanism if needed.

    res.status(200).json({ message: 'Logout successful. Please remove the token on the client side.' });
  } catch (error) {
    console.error('Logout Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
