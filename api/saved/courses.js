import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

// Simple in-memory storage for demo
const savedCourses = new Map();

// MongoDB SavedCourse Schema (if using MongoDB)
let SavedCourse = null;
if (process.env.MONGODB_URI) {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI);
    }
    
    const savedCourseSchema = new mongoose.Schema({
      userId: { type: mongoose.Schema.Types.ObjectId, required: true },
      courseId: { type: String, required: true },
      courseName: { type: String, required: true },
      savedAt: { type: Date, default: Date.now },
    });
    
    SavedCourse = mongoose.models.SavedCourse || mongoose.model('SavedCourse', savedCourseSchema);
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
      let userSavedCourses = [];

      if (SavedCourse && mongoose.connection.readyState === 1) {
        // MongoDB flow
        userSavedCourses = await SavedCourse.find({ userId }).sort({ savedAt: -1 });
      } else {
        // Fallback in-memory storage
        userSavedCourses = savedCourses.get(userId) || [];
      }

      res.json(userSavedCourses);
    } else if (req.method === 'POST') {
      const { courseId, courseName } = req.body;

      const newSavedCourse = {
        id: `saved_course_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId,
        courseId,
        courseName,
        savedAt: new Date(),
      };

      if (SavedCourse && mongoose.connection.readyState === 1) {
        // MongoDB flow
        const savedCourse = new SavedCourse(newSavedCourse);
        await savedCourse.save();
        res.json(savedCourse);
      } else {
        // Fallback in-memory storage
        if (!savedCourses.has(userId)) {
          savedCourses.set(userId, []);
        }
        savedCourses.get(userId).push(newSavedCourse);
        res.json(newSavedCourse);
      }
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Saved courses error:', error);
    res.status(401).json({ message: 'Access denied' });
  }
}