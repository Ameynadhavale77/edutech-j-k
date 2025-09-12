import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

// Simple in-memory storage for demo (replace with your database)
const users = new Map();

// MongoDB User Schema (if using MongoDB)
let User = null;
if (process.env.MONGODB_URI) {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI);
    }
    
    const userSchema = new mongoose.Schema({
      email: { type: String, required: true, unique: true, lowercase: true },
      googleId: String,
      firstName: String,
      lastName: String,
      profileImageUrl: String,
      isVerified: { type: Boolean, default: false },
      password: String,
    }, { timestamps: true });
    
    User = mongoose.models.User || mongoose.model('User', userSchema);
  } catch (error) {
    console.warn('MongoDB connection failed, using in-memory storage');
  }
}

const client = new OAuth2Client();

export default async function handler(req, res) {
  // CORS handled by main server - removing conflicting headers
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ message: 'ID token is required' });
    }

    // Verify the Google ID token
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    
    if (!payload) {
      return res.status(401).json({ message: 'Invalid Google token' });
    }

    // Extract user info from Google
    const {
      sub: googleId,
      email,
      given_name: firstName,
      family_name: lastName,
      picture: profileImageUrl,
      email_verified: isVerified
    } = payload;

    if (!email) {
      return res.status(400).json({ message: 'Email not provided by Google' });
    }

    let user;

    if (User && mongoose.connection.readyState === 1) {
      // MongoDB flow
      user = await User.findOne({ email: email.toLowerCase() });
      
      if (!user) {
        // Create new user
        user = new User({
          email: email.toLowerCase(),
          googleId,
          firstName: firstName || '',
          lastName: lastName || '',
          profileImageUrl: profileImageUrl || '',
          isVerified: isVerified || false,
          password: '', // Google users don't need password
        });
        await user.save();
      } else {
        // Update existing user with Google info
        user.googleId = googleId;
        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.profileImageUrl = profileImageUrl || user.profileImageUrl;
        user.isVerified = isVerified || user.isVerified;
        await user.save();
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id.toString(), email: user.email },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
      );

      // Set HTTP-only cookie with SameSite=None for cross-site compatibility
      res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Secure; SameSite=None; Max-Age=${7 * 24 * 60 * 60}; Path=/`);

      res.json({ 
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          profileImageUrl: user.profileImageUrl,
          isVerified: user.isVerified
        }, 
        message: 'Google login successful' 
      });
    } else {
      // Fallback in-memory storage
      user = users.get(email);
      
      if (!user) {
        user = {
          id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          googleId,
          email,
          firstName: firstName || '',
          lastName: lastName || '',
          profileImageUrl: profileImageUrl || '',
          isVerified: isVerified || false,
          createdAt: new Date(),
        };
        users.set(email, user);
      } else {
        // Update existing user info
        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.profileImageUrl = profileImageUrl || user.profileImageUrl;
        user.isVerified = isVerified || user.isVerified;
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
      );

      // Set HTTP-only cookie with SameSite=None for cross-site compatibility
      res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Secure; SameSite=None; Max-Age=${7 * 24 * 60 * 60}; Path=/`);

      res.json({ 
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          profileImageUrl: user.profileImageUrl,
          isVerified: user.isVerified
        }, 
        message: 'Google login successful' 
      });
    }
  } catch (error) {
    console.error('Google login error:', error);
    res.status(401).json({ message: 'Google authentication failed' });
  }
}