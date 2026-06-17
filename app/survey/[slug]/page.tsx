import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSurvey } from "@/mock/surveys";
import { SurveyEngine } from "@/components/survey/survey-engine";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const survey = getSurvey(slug);
  if (!survey) return { title: "Survey Not Found" };
  return {
    title: survey.title,
    description: survey.description,
  };
}

export default async function SurveyPage({ params }: Props) {
  const { slug } = await params;
  const survey = getSurvey(slug);

  if (!survey) {
    notFound();
  }

  return <SurveyEngine survey={survey} />;
}
