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
    const courses = [
      {
        id: 1,
        name: "Computer Science Engineering",
        duration: "4 years",
        type: "B.Tech",
        description: "Learn programming, software development, and computer systems"
      },
      {
        id: 2,
        name: "Medical (MBBS)",
        duration: "5.5 years",
        type: "MBBS",
        description: "Study medicine and become a doctor"
      },
      {
        id: 3,
        name: "Business Administration",
        duration: "3 years",
        type: "BBA",
        description: "Learn business management and leadership skills"
      }
    ];
    
    res.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: 'Failed to fetch courses' });
  }
}