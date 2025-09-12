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

function verifyToken(req) {
  const token = req.headers.cookie?.split(';')
    .find(c => c.trim().startsWith('token='))
    ?.split('=')[1];

  if (!token) {
    throw new Error('No token provided');
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
  return decoded;
}

export default async function handler(req, res) {
  // CORS handled by main server - removing conflicting headers
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const decoded = verifyToken(req);
    
    let user = null;

    if (User && mongoose.connection.readyState === 1) {
      // MongoDB flow
      user = await User.findById(decoded.userId).select('-password');
    } else {
      // Fallback in-memory storage
      for (const [email, userData] of users.entries()) {
        if (userData.id === decoded.userId) {
          user = userData;
          break;
        }
      }
    }

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    res.json({
      id: user._id || user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      profileImageUrl: user.profileImageUrl,
      isVerified: user.isVerified
    });
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ message: 'Access denied. No token provided.' });
  }
}