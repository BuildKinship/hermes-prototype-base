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
  "the-signal-survey": {
    slug: "the-signal-survey",
    title: "The Signal — What did you notice?",
    description:
      "You just decoded part of an unknown language. Take two minutes to tell us what you experienced.",
    adminCode: "",
    thankYouTitle: "Signal received.",
    thankYouMessage:
      "Your responses help us understand how people experience adaptive learning. We will follow up if you left an email.",
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
        id: "role",
        type: "single-choice",
        title: "What's your role?",
        required: true,
        options: [
          { id: "leader", label: "School or district leader" },
          { id: "curriculum", label: "Curriculum coordinator" },
          { id: "teacher", label: "Math teacher" },
          { id: "educator", label: "Other educator" },
          { id: "parent", label: "Parent" },
        ],
      },
      {
        id: "adaptation",
        type: "single-choice",
        title: "When the system adjusted after your answer, what did you notice?",
        description: "The engine was changing your path based on what you got right and wrong.",
        required: true,
        options: [
          { id: "surprising", label: "It felt surprising — I didn't expect it to change" },
          { id: "natural", label: "It felt natural — like talking with a good tutor" },
          { id: "unsure", label: "I wasn't sure what changed" },
          { id: "didnt-notice", label: "I didn't notice any adjustment" },
        ],
      },
      {
        id: "engagement",
        type: "rating",
        title: "How engaged did you feel during The Signal?",
        required: true,
        ratingMax: 5,
        ratingLabels: { low: "Detached", high: "Fully absorbed" },
      },
      {
        id: "resonated",
        type: "multiple-choice",
        title: "Which part of the experience stuck with you most?",
        description: "Select all that apply.",
        required: true,
        options: [
          { id: "graph", label: "Seeing my knowledge graph at the end" },
          { id: "inferred", label: "Working out rules nobody taught me" },
          { id: "different", label: "Getting a different result from the person next to me" },
          { id: "clicked", label: "The signal finally making sense mid-session" },
          { id: "misconception", label: "Learning that an error changed what came next" },
        ],
      },
      {
        id: "conviction",
        type: "rating",
        title: "After The Signal, how convinced are you that students learn better when the system adapts to them individually?",
        required: true,
        ratingMax: 10,
        ratingLabels: { low: "Not convinced", high: "Completely convinced" },
      },
      {
        id: "biggest_question",
        type: "long-text",
        title: "What's the biggest question you have about bringing something like this to your school or students?",
        required: false,
        placeholder: "No wrong answers — we want the real questions.",
        maxLength: 2000,
      },
      {
        id: "next_step",
        type: "single-choice",
        title: "What would you most like to do next?",
        required: true,
        options: [
          { id: "math-academy", label: "See how Math Academy maps mathematical knowledge the same way" },
          { id: "data", label: "Understand the data it would give me as a teacher" },
          { id: "classroom", label: "Discuss how it would work in my classroom" },
          { id: "processing", label: "Nothing right now — still processing" },
        ],
      },
      {
        id: "email",
        type: "email",
        title: "Where should we follow up with you?",
        description: "Optional — only if you'd like to hear more.",
        required: false,
        placeholder: "you@school.edu",
      },
    ],
  },
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
