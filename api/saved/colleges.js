import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

// Simple in-memory storage for demo
const savedColleges = new Map();

// MongoDB SavedCollege Schema (if using MongoDB)
let SavedCollege = null;
if (process.env.MONGODB_URI) {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI);
    }
    
    const savedCollegeSchema = new mongoose.Schema({
      userId: { type: mongoose.Schema.Types.ObjectId, required: true },
      collegeName: { type: String, required: true },
      location: String,
      savedAt: { type: Date, default: Date.now },
    });
    
    SavedCollege = mongoose.models.SavedCollege || mongoose.model('SavedCollege', savedCollegeSchema);
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
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const decoded = verifyToken(req);
    const userId = decoded.userId;

    if (req.method === 'GET') {
      let userSavedColleges = [];

      if (SavedCollege && mongoose.connection.readyState === 1) {
        // MongoDB flow
        userSavedColleges = await SavedCollege.find({ userId }).sort({ savedAt: -1 });
      } else {
        // Fallback in-memory storage
        userSavedColleges = savedColleges.get(userId) || [];
      }

      res.json(userSavedColleges);
    } else if (req.method === 'POST') {
      const { collegeName, location } = req.body;

      const newSavedCollege = {
        id: `saved_college_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId,
        collegeName,
        location,
        savedAt: new Date(),
      };

      if (SavedCollege && mongoose.connection.readyState === 1) {
        // MongoDB flow
        const savedCollege = new SavedCollege(newSavedCollege);
        await savedCollege.save();
        res.json(savedCollege);
      } else {
        // Fallback in-memory storage
        if (!savedColleges.has(userId)) {
          savedColleges.set(userId, []);
        }
        savedColleges.get(userId).push(newSavedCollege);
        res.json(newSavedCollege);
      }
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Saved colleges error:', error);
    res.status(401).json({ message: 'Access denied' });
  }
}