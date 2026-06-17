import type { Metadata } from "next";
import { HomePage } from "./home";

export const metadata: Metadata = {
  title: "Kinship Prototype Engine",
  description:
    "Hermes-powered rapid prototyping for Kinship — slide decks, animations, dashboard mockups, and more.",
};

export default function Page() {
  return <HomePage />;
}
