import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../../server/db.js';
import { users } from '../../shared/schema.js';
import { eq } from 'drizzle-orm';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;
    console.log('Login attempt:', { email, password: '***' });

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Check if user exists in database
    const [existingUser] = await db.select().from(users).where(eq(users.email, email.toLowerCase()));
    
    let user = existingUser;
    
    if (!user) {
      // Create user on first login (for development mode)
      const hashedPassword = await bcrypt.hash(password, 12);
      [user] = await db.insert(users).values({
        email: email.toLowerCase(),
        password: hashedPassword,
        firstName: 'Dev',
        lastName: 'User',
        profileImageUrl: '',
        isVerified: false,
      }).returning();
      console.log('Created new user for login:', user.email);
    } else {
      // Check password for existing user
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
      console.log('Password valid for existing user:', user.email);
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    // Set HTTP-only cookie with new version name and clear any old token
    res.setHeader('Set-Cookie', [
      `token_v2=${token}; HttpOnly; Secure; SameSite=None; Max-Age=${7 * 24 * 60 * 60}; Path=/`,
      `token=; Max-Age=0; HttpOnly; Secure; SameSite=None; Path=/` // Clear legacy token
    ]);

    res.json({ 
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImageUrl: user.profileImageUrl,
        isVerified: user.isVerified
      }, 
      message: 'Login successful' 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}