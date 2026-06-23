// Survey artifact page — publicly accessible under /artifact/[uuid]/survey/[slug]
// AnonAuthGate is applied by app/artifact/layout.tsx — visitors are silently signed in
// [uuid] is the prototype's Firestore document ID
// [slug] is the survey definition key (from mock/surveys.ts)

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getSurvey } from "@/mock/surveys";
import { SurveyEngine } from "@/components/survey/survey-engine";

interface Props {
  params: Promise<{ uuid: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const survey = getSurvey(slug);
  if (!survey) return { title: "Survey Not Found" };
  return { title: survey.title, description: survey.description };
}

export default async function SurveyArtifactPage({ params }: Props) {
  const { slug } = await params;
  const survey = getSurvey(slug);
  if (!survey) notFound();
  return <SurveyEngine survey={survey} />;
}
