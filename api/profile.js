import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

// Simple in-memory storage for demo
const profiles = new Map();

// MongoDB Profile Schema (if using MongoDB)
let UserProfile = null;
if (process.env.MONGODB_URI) {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI);
    }
    
    const profileSchema = new mongoose.Schema({
      userId: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
      age: Number,
      gender: String,
      currentClass: String,
      academicScore: Number,
      location: String,
      interests: [String],
      profileCompleted: { type: Boolean, default: false },
    }, { timestamps: true });
    
    UserProfile = mongoose.models.UserProfile || mongoose.model('UserProfile', profileSchema);
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

  return jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
}

export default async function handler(req, res) {
  // CORS handled by main server - removing conflicting headers
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const decoded = verifyToken(req);
    const userId = decoded.userId;

    if (req.method === 'GET') {
      let profile = null;

      if (UserProfile && mongoose.connection.readyState === 1) {
        // MongoDB flow
        profile = await UserProfile.findOne({ userId });
      } else {
        // Fallback in-memory storage
        profile = profiles.get(userId);
      }

      if (!profile) {
        return res.status(404).json({ message: 'Profile not found' });
      }

      res.json(profile);
    } else if (req.method === 'POST') {
      const profileData = req.body;

      if (UserProfile && mongoose.connection.readyState === 1) {
        // MongoDB flow
        let profile = await UserProfile.findOne({ userId });
        
        if (profile) {
          // Update existing profile
          Object.assign(profile, profileData, { profileCompleted: true });
          await profile.save();
        } else {
          // Create new profile
          profile = new UserProfile({
            userId,
            ...profileData,
            profileCompleted: true,
          });
          await profile.save();
        }

        res.json(profile);
      } else {
        // Fallback in-memory storage
        const existingProfile = profiles.get(userId);
        const profile = {
          id: existingProfile?.id || `profile_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          userId,
          ...existingProfile,
          ...profileData,
          profileCompleted: true,
          updatedAt: new Date(),
        };
        
        profiles.set(userId, profile);
        res.json(profile);
      }
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Profile error:', error);
    res.status(401).json({ message: 'Access denied' });
  }
}