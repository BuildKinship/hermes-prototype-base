import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSurvey } from "@/mock/surveys";
import { SurveyAdminView } from "@/components/survey/survey-admin";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const survey = getSurvey(slug);
  if (!survey) return { title: "Admin — Survey Not Found" };
  return {
    title: `Admin — ${survey.title}`,
  };
}

export default async function SurveyAdminPage({ params }: Props) {
  const { slug } = await params;
  const survey = getSurvey(slug);

  if (!survey) {
    notFound();
  }

  return <SurveyAdminView survey={survey} />;
}
