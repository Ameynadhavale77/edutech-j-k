import jwt from 'jsonwebtoken';

// Simple in-memory storage for demo
const activities = new Map();

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

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const decoded = verifyToken(req);
    const userId = decoded.userId;
    const limit = parseInt(req.query.limit) || 10;

    // Get user activities (fallback to empty array)
    const userActivities = activities.get(userId) || [];
    
    // Sort by date and limit results
    const sortedActivities = userActivities
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit);

    res.json(sortedActivities);
  } catch (error) {
    console.error('Activity error:', error);
    res.status(401).json({ message: 'Access denied' });
  }
}