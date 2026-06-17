// Survey definitions — all survey configs live here
// Each survey is a SurveyConfig object. Add new surveys by adding to SURVEYS.

export type QuestionType =
  | "single-choice"
  | "multiple-choice"
  | "short-text"
  | "long-text"
  | "rating"
  | "email"
  | "number";

export interface ChoiceOption {
  id: string;
  label: string;
}

export interface Question {
  id: string;
  type: QuestionType;
  title: string;
  description?: string;
  required: boolean;
  options?: ChoiceOption[]; // single-choice, multiple-choice
  ratingMax?: number; // rating: 5 or 10
  ratingLabels?: { low: string; high: string }; // optional labels for ends
  minLength?: number; // short-text, long-text
  maxLength?: number;
  min?: number; // number
  max?: number;
  placeholder?: string;
}

export interface SurveyConfig {
  slug: string;
  title: string;
  description: string;
  adminCode: string; // 4-digit numeric string
  questions: Question[];
  thankYouTitle: string;
  thankYouMessage: string;
}

export const SURVEYS: Record<string, SurveyConfig> = {
  demo: {
    slug: "demo",
    title: "Kinship Teacher Feedback",
    description:
      "Help us improve Kinship by sharing your experience. This takes about 3 minutes.",
    adminCode: "7429",
    thankYouTitle: "Thank you for your feedback!",
    thankYouMessage:
      "Your responses help us build a better Kinship for every teacher. We'll review your input and use it to prioritize improvements.",
    questions: [
      {
        id: "name",
        type: "short-text",
        title: "What's your name?",
        description: "First name is fine.",
        required: true,
        placeholder: "Your name",
        maxLength: 100,
      },
      {
        id: "grade",
        type: "single-choice",
        title: "What grade do you teach?",
        required: true,
        options: [
          { id: "k1", label: "Kindergarten – Grade 1" },
          { id: "23", label: "Grade 2 – 3" },
          { id: "45", label: "Grade 4 – 5" },
          { id: "68", label: "Grade 6 – 8" },
        ],
      },
      {
        id: "tenure",
        type: "single-choice",
        title: "How long have you been using Kinship?",
        required: true,
        options: [
          { id: "lt1m", label: "Less than 1 month" },
          { id: "1to3m", label: "1 – 3 months" },
          { id: "3to6m", label: "3 – 6 months" },
          { id: "6plus", label: "6+ months" },
        ],
      },
      {
        id: "rating",
        type: "rating",
        title: "Overall, how would you rate Kinship?",
        description: "Be honest — we want real feedback.",
        required: true,
        ratingMax: 5,
        ratingLabels: { low: "Needs work", high: "Love it" },
      },
      {
        id: "features",
        type: "multiple-choice",
        title: "Which features do you use most?",
        description: "Select all that apply.",
        required: true,
        options: [
          { id: "dashboard", label: "Student dashboard" },
          { id: "assignments", label: "Assignment builder" },
          { id: "progress", label: "Progress reports" },
          { id: "messages", label: "Parent messages" },
          { id: "alerts", label: "At-risk alerts" },
        ],
      },
      {
        id: "working_well",
        type: "long-text",
        title: "What's working well?",
        description:
          "Tell us what you love about Kinship. Specific examples help.",
        required: false,
        placeholder: "What's been most useful or delightful?",
        maxLength: 2000,
      },
      {
        id: "improvements",
        type: "long-text",
        title: "What could be improved?",
        description: "No filter needed — we want the real frustrations.",
        required: false,
        placeholder: "What slows you down or gets in your way?",
        maxLength: 2000,
      },
      {
        id: "email",
        type: "email",
        title: "What's your email?",
        description: "Optional — only if you'd like us to follow up.",
        required: false,
        placeholder: "you@school.edu",
      },
    ],
  },
};

export function getSurvey(slug: string): SurveyConfig | null {
  return SURVEYS[slug] ?? null;
}
