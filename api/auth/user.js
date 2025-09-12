import jwt from 'jsonwebtoken';
import { db } from '../../server/db.js';
import { users } from '../../shared/schema.js';
import { eq } from 'drizzle-orm';

function verifyToken(req) {
  // Use req.cookies since we have cookie-parser middleware - prefer new version
  const token = req.cookies?.token_v2 || req.cookies?.token;

  if (!token) {
    throw new Error('No token provided');
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
  return decoded;
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const decoded = verifyToken(req);
    console.log('Looking for user ID:', decoded.userId);
    
    // Defensive check: ensure userId is a valid integer (handles legacy string IDs)
    const userId = Number(decoded.userId);
    if (!Number.isInteger(userId) || userId <= 0) {
      console.log('Invalid user ID format, clearing both cookies');
      res.setHeader('Set-Cookie', [
        `token_v2=; Max-Age=0; HttpOnly; Secure; SameSite=None; Path=/`,
        `token=; Max-Age=0; HttpOnly; Secure; SameSite=None; Path=/`
      ]);
      return res.status(401).json({ message: 'Invalid token format. Please login again.' });
    }
    
    // Find user in database
    const [user] = await db.select().from(users).where(eq(users.id, userId));

    if (!user) {
      console.log('User not found in database, clearing both cookies');
      res.setHeader('Set-Cookie', [
        `token_v2=; Max-Age=0; HttpOnly; Secure; SameSite=None; Path=/`,
        `token=; Max-Age=0; HttpOnly; Secure; SameSite=None; Path=/`
      ]);
      return res.status(401).json({ message: 'User not found' });
    }

    console.log('Found user:', user.email);
    res.json({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      profileImageUrl: user.profileImageUrl,
      isVerified: user.isVerified
    });
  } catch (error) {
    console.error('Auth error:', error);
    // Clear both cookies on any error (handles legacy and new tokens)
    res.setHeader('Set-Cookie', [
      `token_v2=; Max-Age=0; HttpOnly; Secure; SameSite=None; Path=/`,
      `token=; Max-Age=0; HttpOnly; Secure; SameSite=None; Path=/`
    ]);
    res.status(401).json({ message: 'Access denied. Please login again.' });
  }
}