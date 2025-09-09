import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import {
  insertUserProfileSchema,
  insertAssessmentSchema,
  insertSavedCollegeSchema,
  insertSavedCourseSchema,
} from "@shared/schema";
import { z } from "zod";
import { translateText, translateQuizQuestion } from "./translationService";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      let userId: string;
      let userInfo: any;

      // Check if using development session
      if (req.session?.user) {
        userId = req.session.user.id;
        userInfo = req.session.user;
        
        // Ensure user exists in database for dev session
        await storage.upsertUser({
          id: userId,
          email: userInfo.email,
          firstName: userInfo.firstName,
          lastName: userInfo.lastName,
          profileImageUrl: userInfo.profileImageUrl,
        });
      } else {
        userId = req.user.claims.sub;
        const user = await storage.getUser(userId);
        userInfo = user;
      }
      
      const profile = await storage.getUserProfile(userId);
      
      res.json({
        ...userInfo,
        profile,
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Profile routes
  app.post('/api/profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.session?.user?.id || req.user.claims.sub;
      const profileData = insertUserProfileSchema.parse(req.body);
      
      const existingProfile = await storage.getUserProfile(userId);
      
      let profile;
      if (existingProfile) {
        profile = await storage.updateUserProfile(userId, profileData);
      } else {
        profile = await storage.createUserProfile(userId, profileData);
      }
      
      await storage.createUserActivity(userId, 'profile_updated', 'Updated profile information');
      
      res.json(profile);
    } catch (error) {
      console.error("Error updating profile:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid profile data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update profile" });
      }
    }
  });

  app.get('/api/profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.session?.user?.id || req.user.claims.sub;
      const profile = await storage.getUserProfile(userId);
      
      if (!profile) {
        res.status(404).json({ message: "Profile not found" });
        return;
      }
      
      res.json(profile);
    } catch (error) {
      console.error("Error fetching profile:", error);
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });

  // Assessment routes
  app.post('/api/assessments', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.session?.user?.id || req.user.claims.sub;
      const assessmentData = insertAssessmentSchema.parse(req.body);
      
      const assessment = await storage.createAssessment(userId, assessmentData);
      res.json(assessment);
    } catch (error) {
      console.error("Error creating assessment:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid assessment data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create assessment" });
      }
    }
  });

  app.get('/api/assessments', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.session?.user?.id || req.user.claims.sub;
      const assessments = await storage.getUserAssessments(userId);
      res.json(assessments);
    } catch (error) {
      console.error("Error fetching assessments:", error);
      res.status(500).json({ message: "Failed to fetch assessments" });
    }
  });

  app.get('/api/assessments/latest/:type', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.session?.user?.id || req.user.claims.sub;
      const { type } = req.params;
      
      const assessment = await storage.getLatestAssessment(userId, type);
      if (!assessment) {
        res.status(404).json({ message: "Assessment not found" });
        return;
      }
      
      res.json(assessment);
    } catch (error) {
      console.error("Error fetching latest assessment:", error);
      res.status(500).json({ message: "Failed to fetch assessment" });
    }
  });

  // Saved colleges routes
  app.post('/api/saved/colleges', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.session?.user?.id || req.user.claims.sub;
      const collegeData = insertSavedCollegeSchema.parse(req.body);
      
      const savedCollege = await storage.saveCollege(userId, collegeData);
      res.json(savedCollege);
    } catch (error) {
      console.error("Error saving college:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid college data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to save college" });
      }
    }
  });

  app.get('/api/saved/colleges', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.session?.user?.id || req.user.claims.sub;
      const savedColleges = await storage.getSavedColleges(userId);
      res.json(savedColleges);
    } catch (error) {
      console.error("Error fetching saved colleges:", error);
      res.status(500).json({ message: "Failed to fetch saved colleges" });
    }
  });

  app.delete('/api/saved/colleges/:name', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.session?.user?.id || req.user.claims.sub;
      const { name } = req.params;
      
      const removed = await storage.removeSavedCollege(userId, decodeURIComponent(name));
      if (removed) {
        res.json({ message: "College removed from saved items" });
      } else {
        res.status(404).json({ message: "Saved college not found" });
      }
    } catch (error) {
      console.error("Error removing saved college:", error);
      res.status(500).json({ message: "Failed to remove saved college" });
    }
  });

  // Saved courses routes
  app.post('/api/saved/courses', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.session?.user?.id || req.user.claims.sub;
      const courseData = insertSavedCourseSchema.parse(req.body);
      
      const savedCourse = await storage.saveCourse(userId, courseData);
      res.json(savedCourse);
    } catch (error) {
      console.error("Error saving course:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid course data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to save course" });
      }
    }
  });

  app.get('/api/saved/courses', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.session?.user?.id || req.user.claims.sub;
      const savedCourses = await storage.getSavedCourses(userId);
      res.json(savedCourses);
    } catch (error) {
      console.error("Error fetching saved courses:", error);
      res.status(500).json({ message: "Failed to fetch saved courses" });
    }
  });

  app.delete('/api/saved/courses/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.session?.user?.id || req.user.claims.sub;
      const { id } = req.params;
      
      const removed = await storage.removeSavedCourse(userId, id);
      if (removed) {
        res.json({ message: "Course removed from saved items" });
      } else {
        res.status(404).json({ message: "Saved course not found" });
      }
    } catch (error) {
      console.error("Error removing saved course:", error);
      res.status(500).json({ message: "Failed to remove saved course" });
    }
  });

  // Timeline routes
  app.get('/api/timeline', async (req, res) => {
    try {
      const events = await storage.getTimelineEvents();
      res.json(events);
    } catch (error) {
      console.error("Error fetching timeline events:", error);
      res.status(500).json({ message: "Failed to fetch timeline events" });
    }
  });

  // User activity routes
  app.get('/api/activity', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.session?.user?.id || req.user.claims.sub;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const activities = await storage.getUserActivity(userId, limit);
      res.json(activities);
    } catch (error) {
      console.error("Error fetching user activity:", error);
      res.status(500).json({ message: "Failed to fetch user activity" });
    }
  });

  // Translation API endpoints
  app.post('/api/translate', async (req, res) => {
    try {
      const { text, targetLanguage } = req.body;
      
      if (!text || !targetLanguage) {
        return res.status(400).json({ message: "Text and target language are required" });
      }
      
      const translatedText = await translateText(text, targetLanguage);
      res.json({ translatedText });
    } catch (error: any) {
      console.error("Translation error:", error);
      res.status(500).json({ message: "Translation failed" });
    }
  });

  app.post('/api/translate/quiz-question', async (req, res) => {
    try {
      const { question, targetLanguage } = req.body;
      
      if (!question || !targetLanguage) {
        return res.status(400).json({ message: "Question and target language are required" });
      }
      
      const translatedQuestion = await translateQuizQuestion(question, targetLanguage);
      res.json(translatedQuestion);
    } catch (error: any) {
      console.error("Quiz translation error:", error);
      res.status(500).json({ message: "Quiz translation failed" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
