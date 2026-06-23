// Firestore-backed survey response store
// Replaces the in-memory lib/survey-store.ts for persistence across cold starts

import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./client";
import type { SurveyResponse } from "@/lib/survey-store";

const COL = "survey_responses";

export async function addResponseFirestore(
  slug: string,
  answers: Record<string, string | string[] | number>,
  anonUid?: string
): Promise<SurveyResponse> {
  const submittedAt = new Date().toISOString();
  const payload = {
    surveySlug: slug,
    answers,
    submittedAt,
    sessionId: anonUid ?? null,
    createdAt: serverTimestamp(),
  };
  const ref = await addDoc(collection(db, COL), payload);
  return { id: ref.id, surveySlug: slug, submittedAt, answers };
}

export async function getResponsesFirestore(
  slug: string
): Promise<SurveyResponse[]> {
  const q = query(
    collection(db, COL),
    where("surveySlug", "==", slug),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({
    id: d.id,
    surveySlug: d.data().surveySlug as string,
    submittedAt: d.data().submittedAt as string,
    answers: d.data().answers as Record<string, string | string[] | number>,
  }));
}
