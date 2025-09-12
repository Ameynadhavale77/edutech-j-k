export default async function handler(req, res) {
  // CORS handled by main server - removing conflicting headers
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Clear the token cookie with SameSite=None for cross-site compatibility
  res.setHeader('Set-Cookie', 'token=; HttpOnly; Secure; SameSite=None; Max-Age=0; Path=/');
  res.json({ message: 'Logout successful' });
}