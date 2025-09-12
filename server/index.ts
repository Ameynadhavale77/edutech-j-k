import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

// API route imports - these are converted from Vercel serverless functions
import activityHandler from '../api/activity.js';
import assessmentsHandler from '../api/assessments.js';
import collegesHandler from '../api/colleges.js';
import coursesHandler from '../api/courses.js';
import profileHandler from '../api/profile.js';
import timelineHandler from '../api/timeline.js';
import googleAuthHandler from '../api/auth/google.js';
import loginHandler from '../api/auth/login.js';
import logoutHandler from '../api/auth/logout.js';
import registerHandler from '../api/auth/register.js';
import userHandler from '../api/auth/user.js';
import savedCollegesHandler from '../api/saved/colleges.js';
import savedCoursesHandler from '../api/saved/courses.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 5000;

// Middleware
app.use(cors({
  origin: '*',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Convert Vercel handler to Express route
const convertHandler = (handler: Function) => {
  return async (req: express.Request, res: express.Response) => {
    try {
      await handler(req, res);
    } catch (error) {
      console.error('Handler error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
};

// API Routes
app.use('/api/activity', convertHandler(activityHandler));
app.use('/api/assessments', convertHandler(assessmentsHandler));
app.use('/api/colleges', convertHandler(collegesHandler));
app.use('/api/courses', convertHandler(coursesHandler));
app.use('/api/profile', convertHandler(profileHandler));
app.use('/api/timeline', convertHandler(timelineHandler));
app.use('/api/auth/google', convertHandler(googleAuthHandler));
app.use('/api/auth/login', convertHandler(loginHandler));
app.use('/api/auth/logout', convertHandler(logoutHandler));
app.use('/api/auth/register', convertHandler(registerHandler));
app.use('/api/auth/user', convertHandler(userHandler));
app.use('/api/saved/colleges', convertHandler(savedCollegesHandler));
app.use('/api/saved/courses', convertHandler(savedCoursesHandler));

// Serve static files from the frontend build
const clientBuildPath = path.join(__dirname, '../dist/public');
app.use(express.static(clientBuildPath));

// Handle client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});

export default app;