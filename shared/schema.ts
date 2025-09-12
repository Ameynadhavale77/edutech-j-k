import { pgTable, serial, text, boolean, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  googleId: text('google_id'),
  firstName: text('first_name'),
  lastName: text('last_name'), 
  profileImageUrl: text('profile_image_url'),
  isVerified: boolean('is_verified').default(false),
  password: text('password'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  // Add any relations here when needed
}));

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;