export interface Survey {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Question {
  id: string;
  surveyId: string;
  text: string;
  type: QuestionType;
  options?: string[];
  nextQuestionId?: string;
  conditions?: QuestionCondition[];
}

export enum QuestionType {
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  TEXT = 'TEXT',
  RATING = 'RATING'
}

export interface QuestionCondition {
  answer: string;
  nextQuestionId: string;
}