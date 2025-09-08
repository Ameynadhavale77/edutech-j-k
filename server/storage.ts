import {
  users,
  userProfiles,
  assessments,
  savedColleges,
  savedCourses,
  timelineEvents,
  userActivity,
  type User,
  type UpsertUser,
  type UserProfile,
  type InsertUserProfile,
  type Assessment,
  type InsertAssessment,
  type SavedCollege,
  type InsertSavedCollege,
  type SavedCourse,
  type InsertSavedCourse,
  type TimelineEvent,
  type UserActivity,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // User profile operations
  getUserProfile(userId: string): Promise<UserProfile | undefined>;
  createUserProfile(userId: string, profile: InsertUserProfile): Promise<UserProfile>;
  updateUserProfile(userId: string, profile: Partial<InsertUserProfile>): Promise<UserProfile>;
  
  // Assessment operations
  createAssessment(userId: string, assessment: InsertAssessment): Promise<Assessment>;
  getUserAssessments(userId: string): Promise<Assessment[]>;
  getLatestAssessment(userId: string, type: string): Promise<Assessment | undefined>;
  
  // Saved items operations
  saveCollege(userId: string, college: InsertSavedCollege): Promise<SavedCollege>;
  getSavedColleges(userId: string): Promise<SavedCollege[]>;
  removeSavedCollege(userId: string, collegeName: string): Promise<boolean>;
  
  saveCourse(userId: string, course: InsertSavedCourse): Promise<SavedCourse>;
  getSavedCourses(userId: string): Promise<SavedCourse[]>;
  removeSavedCourse(userId: string, courseId: string): Promise<boolean>;
  
  // Timeline and activity operations
  getTimelineEvents(): Promise<TimelineEvent[]>;
  createUserActivity(userId: string, activityType: string, description: string, metadata?: any): Promise<UserActivity>;
  getUserActivity(userId: string, limit?: number): Promise<UserActivity[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations (mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // User profile operations
  async getUserProfile(userId: string): Promise<UserProfile | undefined> {
    const [profile] = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, userId));
    return profile;
  }

  async createUserProfile(userId: string, profile: InsertUserProfile): Promise<UserProfile> {
    const [newProfile] = await db
      .insert(userProfiles)
      .values({
        userId,
        ...profile,
        profileCompleted: true,
      })
      .returning();
    return newProfile;
  }

  async updateUserProfile(userId: string, profile: Partial<InsertUserProfile>): Promise<UserProfile> {
    const [updatedProfile] = await db
      .update(userProfiles)
      .set({
        ...profile,
        updatedAt: new Date(),
      })
      .where(eq(userProfiles.userId, userId))
      .returning();
    return updatedProfile;
  }

  // Assessment operations
  async createAssessment(userId: string, assessment: InsertAssessment): Promise<Assessment> {
    const [newAssessment] = await db
      .insert(assessments)
      .values({
        userId,
        ...assessment,
      })
      .returning();

    // Create activity log
    await this.createUserActivity(
      userId,
      'quiz_completed',
      `Completed ${assessment.assessmentType} assessment`,
      { assessmentId: newAssessment.id }
    );

    return newAssessment;
  }

  async getUserAssessments(userId: string): Promise<Assessment[]> {
    return db
      .select()
      .from(assessments)
      .where(eq(assessments.userId, userId))
      .orderBy(desc(assessments.completedAt));
  }

  async getLatestAssessment(userId: string, type: string): Promise<Assessment | undefined> {
    const [assessment] = await db
      .select()
      .from(assessments)
      .where(and(eq(assessments.userId, userId), eq(assessments.assessmentType, type)))
      .orderBy(desc(assessments.completedAt))
      .limit(1);
    return assessment;
  }

  // Saved items operations
  async saveCollege(userId: string, college: InsertSavedCollege): Promise<SavedCollege> {
    const [savedCollege] = await db
      .insert(savedColleges)
      .values({
        userId,
        ...college,
      })
      .returning();

    await this.createUserActivity(
      userId,
      'college_saved',
      `Saved ${college.collegeName} to favorites`
    );

    return savedCollege;
  }

  async getSavedColleges(userId: string): Promise<SavedCollege[]> {
    return db
      .select()
      .from(savedColleges)
      .where(eq(savedColleges.userId, userId))
      .orderBy(desc(savedColleges.savedAt));
  }

  async removeSavedCollege(userId: string, collegeName: string): Promise<boolean> {
    const result = await db
      .delete(savedColleges)
      .where(and(eq(savedColleges.userId, userId), eq(savedColleges.collegeName, collegeName)));
    
    return result.rowCount > 0;
  }

  async saveCourse(userId: string, course: InsertSavedCourse): Promise<SavedCourse> {
    const [savedCourse] = await db
      .insert(savedCourses)
      .values({
        userId,
        ...course,
      })
      .returning();

    await this.createUserActivity(
      userId,
      'course_saved',
      `Saved ${course.courseName} to favorites`
    );

    return savedCourse;
  }

  async getSavedCourses(userId: string): Promise<SavedCourse[]> {
    return db
      .select()
      .from(savedCourses)
      .where(eq(savedCourses.userId, userId))
      .orderBy(desc(savedCourses.savedAt));
  }

  async removeSavedCourse(userId: string, courseId: string): Promise<boolean> {
    const result = await db
      .delete(savedCourses)
      .where(and(eq(savedCourses.userId, userId), eq(savedCourses.courseId, courseId)));
    
    return result.rowCount > 0;
  }

  // Timeline and activity operations
  async getTimelineEvents(): Promise<TimelineEvent[]> {
    return db
      .select()
      .from(timelineEvents)
      .where(eq(timelineEvents.isActive, true))
      .orderBy(timelineEvents.eventDate);
  }

  async createUserActivity(userId: string, activityType: string, description: string, metadata?: any): Promise<UserActivity> {
    const [activity] = await db
      .insert(userActivity)
      .values({
        userId,
        activityType,
        description,
        metadata: metadata || {},
      })
      .returning();
    return activity;
  }

  async getUserActivity(userId: string, limit = 10): Promise<UserActivity[]> {
    return db
      .select()
      .from(userActivity)
      .where(eq(userActivity.userId, userId))
      .orderBy(desc(userActivity.createdAt))
      .limit(limit);
  }
}

export const storage = new DatabaseStorage();
