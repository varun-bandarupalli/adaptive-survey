import { db } from './index';
import { userRoles, users, questionTypes, surveys, questions } from './schema';
import { eq } from 'drizzle-orm';

async function seed() {
  console.log('🌱 Starting seed process...');

  // Clear existing data
  console.log('Clearing existing data...');
  await db.delete(questions);
  await db.delete(surveys);
  await db.delete(users);
  await db.delete(questionTypes);
  await db.delete(userRoles);

  // Seed user roles
  console.log('Seeding user roles...');
  const [adminRole, surveyorRole, respondentRole] = await db.insert(userRoles).values([
    { name: 'admin', description: 'Administrator with full access' },
    { name: 'surveyor', description: 'Can create and manage surveys' },
    { name: 'respondent', description: 'Can respond to surveys' }
  ]).returning();

  // Seed users
  console.log('Seeding users...');
  const [adminUser, surveyorUser, respondentUser] = await db.insert(users).values([
    {
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
      // In production, ensure passwords are properly hashed
      password: 'admin123',
      userRoleId: adminRole.id
    },
    {
      firstName: 'Survey',
      lastName: 'Creator',
      email: 'surveyor@example.com',
      password: 'surveyor123',
      userRoleId: surveyorRole.id
    },
    {
      firstName: 'Test',
      lastName: 'Respondent',
      email: 'respondent@example.com',
      password: 'respondent123',
      userRoleId: respondentRole.id
    }
  ]).returning();

  // Seed question types
  console.log('Seeding question types...');
  const [multipleChoice, textResponse, rating, yesNo] = await db.insert(questionTypes).values([
    {
      name: 'multiple_choice',
      description: 'Multiple choice question with single answer'
    },
    {
      name: 'text_response',
      description: 'Free text response question'
    },
    {
      name: 'rating',
      description: 'Rating scale question (1-5)'
    },
    {
      name: 'yes_no',
      description: 'Binary yes/no question'
    }
  ]).returning();

  // Seed a sample survey
  console.log('Seeding sample survey...');
  const [sampleSurvey] = await db.insert(surveys).values({
    title: 'Customer Satisfaction Survey',
    description: 'Help us improve our services by providing your feedback',
    createdById: surveyorUser.id,
    isActive: true,
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
  }).returning();

  // Seed sample questions
  console.log('Seeding sample questions...');
  await db.insert(questions).values([
    {
      surveyId: sampleSurvey.id,
      questionTypeId: rating.id,
      text: 'How satisfied are you with our service?',
      description: 'Rate from 1 (very unsatisfied) to 5 (very satisfied)',
      isRequired: true,
      orderIndex: 1,
      options: JSON.stringify({
        min: 1,
        max: 5,
        labels: {
          1: 'Very Unsatisfied',
          2: 'Unsatisfied',
          3: 'Neutral',
          4: 'Satisfied',
          5: 'Very Satisfied'
        }
      })
    },
    {
      surveyId: sampleSurvey.id,
      questionTypeId: multipleChoice.id,
      text: 'Which of our services do you use most frequently?',
      isRequired: true,
      orderIndex: 2,
      options: JSON.stringify({
        choices: [
          'Product A',
          'Product B',
          'Product C',
          'Service X',
          'Service Y'
        ],
        allowMultiple: false
      })
    },
    {
      surveyId: sampleSurvey.id,
      questionTypeId: yesNo.id,
      text: 'Would you recommend our services to others?',
      isRequired: true,
      orderIndex: 3,
      options: JSON.stringify({
        positiveLabel: 'Yes',
        negativeLabel: 'No'
      })
    },
    {
      surveyId: sampleSurvey.id,
      questionTypeId: textResponse.id,
      text: 'What suggestions do you have for improving our services?',
      description: 'Please provide any specific feedback or suggestions',
      isRequired: false,
      orderIndex: 4,
      validationRules: JSON.stringify({
        minLength: 10,
        maxLength: 500
      })
    }
  ]);

  console.log('✅ Seed completed successfully!');
}

// Run seed function
seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});