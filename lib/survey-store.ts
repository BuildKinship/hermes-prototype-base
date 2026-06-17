// In-memory survey response store
// Resets on cold start — fine for prototype purposes

export interface SurveyResponse {
  id: string;
  surveySlug: string;
  submittedAt: string; // ISO timestamp
  answers: Record<string, string | string[] | number>; // questionId → answer
}

// Module-level store — shared across all route calls within a server instance
const responseStore = new Map<string, SurveyResponse[]>();

export function addResponse(slug: string, answers: Record<string, string | string[] | number>): SurveyResponse {
  const response: SurveyResponse = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    surveySlug: slug,
    submittedAt: new Date().toISOString(),
    answers,
  };

  if (!responseStore.has(slug)) {
    responseStore.set(slug, []);
  }
  responseStore.get(slug)!.push(response);
  return response;
}

export function getResponses(slug: string): SurveyResponse[] {
  return responseStore.get(slug) ?? [];
}

export function getResponseCount(slug: string): number {
  return (responseStore.get(slug) ?? []).length;
}
