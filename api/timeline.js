// Timeline events for J&K students
const timelineEvents = [
  {
    id: 1,
    title: "CUET Registration Opens",
    description: "Common University Entrance Test registration begins",
    eventDate: "2025-02-15",
    eventType: "exam",
    isActive: true
  },
  {
    id: 2,
    title: "J&K Merit List Publication",
    description: "State merit list for college admissions",
    eventDate: "2025-03-20",
    eventType: "admission",
    isActive: true
  },
  {
    id: 3,
    title: "Scholarship Applications Due",
    description: "Last date for merit scholarship applications",
    eventDate: "2025-03-15",
    eventType: "scholarship",
    isActive: true
  }
];

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
    // Return active timeline events
    const activeEvents = timelineEvents.filter(event => event.isActive);
    res.json(activeEvents);
  } catch (error) {
    console.error('Timeline error:', error);
    res.status(500).json({ message: 'Failed to fetch timeline events' });
  }
}