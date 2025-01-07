import { pgTable, serial, varchar, text, timestamp, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const userRoles = pgTable('user_roles', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 50 }).notNull().unique(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  userRoleId: integer('user_role_id').references(() => userRoles.id).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const questionTypes = pgTable('question_types', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 50 }).notNull().unique(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const surveys = pgTable('surveys', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  createdById: integer('created_by_id').references(() => users.id).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  startDate: timestamp('start_date'),
  endDate: timestamp('end_date'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const questions = pgTable('questions', {
  id: serial('id').primaryKey(),
  surveyId: integer('survey_id').references(() => surveys.id).notNull(),
  questionTypeId: integer('question_type_id').references(() => questionTypes.id).notNull(),
  text: text('text').notNull(),
  description: text('description'),
  isRequired: boolean('is_required').default(true).notNull(),
  orderIndex: integer('order_index').notNull(),
  options: jsonb('options'),
  validationRules: jsonb('validation_rules'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Define relationships
export const userRolesRelations = relations(userRoles, ({ many }) => ({
  users: many(users),
}));

export const usersRelations = relations(users, ({ one }) => ({
  role: one(userRoles, {
    fields: [users.userRoleId],
    references: [userRoles.id],
  }),
}));

export const surveysRelations = relations(surveys, ({ one, many }) => ({
  createdBy: one(users, {
    fields: [surveys.createdById],
    references: [users.id],
  }),
  questions: many(questions),
}));

export const questionsRelations = relations(questions, ({ one }) => ({
  survey: one(surveys, {
    fields: [questions.surveyId],
    references: [surveys.id],
  }),
  questionType: one(questionTypes, {
    fields: [questions.questionTypeId],
    references: [questionTypes.id],
  }),
}));