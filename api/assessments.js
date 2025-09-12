import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

// Simple in-memory storage for demo
const assessments = new Map();

// MongoDB Assessment Schema (if using MongoDB)
let Assessment = null;
if (process.env.MONGODB_URI) {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI);
    }
    
    const assessmentSchema = new mongoose.Schema({
      userId: { type: mongoose.Schema.Types.ObjectId, required: true },
      assessmentType: { type: String, required: true },
      answers: { type: Object, required: true },
      results: { type: Object, required: true },
      recommendations: [String],
      completedAt: { type: Date, default: Date.now },
    });
    
    Assessment = mongoose.models.Assessment || mongoose.model('Assessment', assessmentSchema);
  } catch (error) {
    console.warn('MongoDB connection failed, using in-memory storage');
  }
}

function verifyToken(req) {
  // Use req.cookies since we have cookie-parser middleware - prefer new version
  const token = req.cookies?.token_v2 || req.cookies?.token;

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
      let userAssessments = [];

      if (Assessment && mongoose.connection.readyState === 1) {
        // MongoDB flow
        userAssessments = await Assessment.find({ userId }).sort({ completedAt: -1 });
      } else {
        // Fallback in-memory storage
        userAssessments = assessments.get(userId) || [];
      }

      res.json(userAssessments);
    } else if (req.method === 'POST') {
      const assessmentData = req.body;

      const newAssessment = {
        id: `assessment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId,
        ...assessmentData,
        completedAt: new Date(),
      };

      if (Assessment && mongoose.connection.readyState === 1) {
        // MongoDB flow
        const assessment = new Assessment(newAssessment);
        await assessment.save();
        res.json(assessment);
      } else {
        // Fallback in-memory storage
        if (!assessments.has(userId)) {
          assessments.set(userId, []);
        }
        assessments.get(userId).push(newAssessment);
        res.json(newAssessment);
      }
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Assessment error:', error);
    res.status(401).json({ message: 'Access denied' });
  }
}