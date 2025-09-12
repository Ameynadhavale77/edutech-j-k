import fs from 'fs';
import path from 'path';

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
    // In a real app, you'd fetch from database
    // For now, return sample data
    const colleges = [
      {
        id: 1,
        name: "University of Kashmir",
        location: "Srinagar",
        type: "University",
        fees: "₹50,000/year",
        rating: 4.2
      },
      {
        id: 2,
        name: "Jammu University",
        location: "Jammu",
        type: "University", 
        fees: "₹45,000/year",
        rating: 4.0
      },
      {
        id: 3,
        name: "Islamic University of Science & Technology",
        location: "Awantipora",
        type: "University",
        fees: "₹55,000/year",
        rating: 4.3
      }
    ];
    
    res.json(colleges);
  } catch (error) {
    console.error('Error fetching colleges:', error);
    res.status(500).json({ message: 'Failed to fetch colleges' });
  }
}