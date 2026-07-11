// Mock data for Kinship Magazine Issue #2 — The Deep Cut
// Week of July 7–10, 2026 | 137 messages · 11 active channels · 27 qualified

export const ISSUE = {
  number: 2,
  title: "THE DEEP CUT",
  theme: "The Kinship Deep Cut — Issue #2",
  tagline: "A week of depth: learning science arguments, legal language, and repo archaeology.",
  weekRange: "July 7–10, 2026",
  totalMessages: 137,
  activeChannels: 11,
  quietChannels: 16,
  totalChannels: 27,
  comparedToLastWeek: {
    messages: 132,
    activeChannels: 10,
    delta: "+4%",
  },
};

export const HIGHLIGHTS = [
  {
    id: "edtech-prize",
    area: "Community",
    emoji: "🏆",
    headline: "The team wrote Kinship's story — in real time",
    body: "An edtech prize application dropped with a same-day deadline. #open-kinship became a live editorial floor: who's writing the first pass? Does the app contradict the anti-edtech positioning? Is the LMS stuff even real? In 15 messages, the team shipped a draft. The deadline was extended by one day, just in case.",
    channel: "open-kinship",
  },
  {
    id: "learning-science",
    area: "Learning Science",
    emoji: "🧠",
    headline: "What does learning actually mean? (10 people weighed in)",
    body: "Will's condensed learning science doc triggered the biggest intellectual thread of the week. Mike wanted more metacognition. Ben wanted ZPD. The debate on whether the doc was too siloed or perfectly scoped ran for four replies. By Friday, an updated version landed — 'the first reasonably coherent end-to-end explanation.'",
    channel: "topic-learning-science",
  },
  {
    id: "eng-repo",
    area: "Engineering",
    emoji: "🔧",
    headline: "The kinship-full repo got its first full audit",
    body: "A deep dive into the codebase surfaced a math-only bias, multi-platform pilot needs, and licensing concerns from the Alpha/IXL situation. The discussion led straight to: we need a Math Academy API. The email to Jason & Sandy went out the same day.",
    channel: "team-eng",
  },
  {
    id: "partnerships",
    area: "Partnerships",
    emoji: "📝",
    headline: "York MOU language — finally finalized",
    body: "Contract term vs pilot term vs free pilot duration. The team debated the fine print across 15 replies in #team-partnerships. The resolution: free pilot for the full school year, contract through Dec 2027. DocuSign is live.",
    channel: "team-partnerships",
  },
  {
    id: "competitive",
    area: "Intelligence",
    emoji: "👁️",
    headline: "The field is moving fast — Kinship is paying attention",
    body: "Flint shipped curriculum standards features with a broken AI assistant. Marble dropped an open-source taxonomy. Carl Hendrick, the learning science advisor behind Alpha School, publicly questioned the Alpha model — in print. The team's read: UX is where the battle will be fought.",
    channel: "topic-collective-intelligence",
  },
];

export const SPOTLIGHT = {
  name: "team-eng",
  channelId: "C0ANK3CJM8V",
  messages: 48,
  uniqueUsers: 5,
  reactions: 18,
  score: 129,
  description: "The engineering channel was the week's workhorse — from Linear pricing debates to repo archaeology to a first PR and a Vercel plugin that routes comments straight to Claude.",
  quote: "holy shit. I just installed the vercel commenting chrome plugin and connected it to linear. now i'm just asking claude to try fix that item.",
  quoteContext: "On the state of AI-augmented development workflows",
  topTopics: ["Linear free vs paid", "Math Academy API investigation", "kinship-full repo review", "First PR & Vercel deploy", "MacBook Air M5 32GB RAM debate"],
  vsLastWeek: { messages: 45, delta: "+7%" },
};

export const HOT_THREADS = [
  {
    channel: "team-eng",
    channelId: "C0ANK3CJM8V",
    replies: 22,
    rootText: "Are we paying for Linear or are we on a free tier?",
    preview: "The question became a procurement philosophy discussion: monthly flexibility vs annual commitment, who owns tooling decisions as the team grows, and whether $10/user/month is worth it right now.",
    slackLink: "https://kinship-9xb4888.slack.com/archives/C0ANK3CJM8V/p1783617296534949",
  },
  {
    channel: "team-pilot-success",
    channelId: "C0BCBAJFBPC",
    replies: 17,
    rootText: "Can you share the transcript for the pilot Zoom meeting that just occurred?",
    preview: "Hermes couldn't find it at first — then found two recordings from Brittany's personal meeting room. The transcript surfaced a key insight: 'AI education platform' creates baggage. 'Precision learning platform' lands better.",
    slackLink: "https://kinship-9xb4888.slack.com/archives/C0BCBAJFBPC/p1783526626482479",
  },
  {
    channel: "open-kinship",
    channelId: "C0ANS36DN3W",
    replies: 15,
    rootText: "First pass at the EdTech prize application — some creative liberties taken.",
    preview: "The team flag that some things in the draft don't exist yet (LMS/SIS integrations). The call: does an aspirational application need to be factually complete? The answer: 'It should reflect our plans, not a legal contract.'",
    slackLink: "https://kinship-9xb4888.slack.com/archives/C0ANS36DN3W/p1783707471433259",
  },
  {
    channel: "team-partnerships",
    channelId: "C0B6Z4MFA3X",
    replies: 15,
    rootText: "Here's some MOU language I'm comfortable with. What do you think?",
    preview: "Free pilot for full school year vs contract term through Dec 2027. Five back-and-forths to separate 'pilot term' from 'contract term.' DocuSign is now live on the York MOU.",
    slackLink: "https://kinship-9xb4888.slack.com/archives/C0B6Z4MFA3X/p1783352028178849",
  },
  {
    channel: "team-eng",
    channelId: "C0ANK3CJM8V",
    replies: 11,
    rootText: "Thread for the kinship-full repo review",
    preview: "The repo review Claude artifact revealed a math-only bias in the codebase. Multi-subject support for the RHA September pilot is critical. The team debated whether AI features should be gated or shipped iteratively. Answer: ship fast, harden as you go.",
    slackLink: "https://kinship-9xb4888.slack.com/archives/C0ANK3CJM8V/p1783612698934129",
  },
];

export const QUIET_CHANNELS = [
  { name: "topic-research", streak: "2 weeks quiet" },
  { name: "edu-ucc", streak: "2 weeks quiet" },
  { name: "edu-brown", streak: "2 weeks quiet" },
  { name: "edu-yschool", streak: "2 weeks quiet" },
  { name: "topic-hiring", streak: "2 weeks quiet" },
  { name: "topic-culture", streak: "2 weeks quiet" },
  { name: "proj-sputnik", streak: "2 weeks quiet" },
  { name: "topic-pilots", streak: "2 weeks quiet" },
  { name: "team-blockers", streak: "first seen quiet" },
  { name: "space-offsite-2026", streak: "quiet — the offsite is a memory now" },
];

export const COMPETITIVE_INTELLIGENCE = [
  {
    source: "Flint K12",
    headline: "Flint shipped curriculum standards — their own AI doesn't know it exists",
    detail: "Flint rolled out lesson-to-standards mapping. When asked about the feature, Sparky (their AI) said it didn't exist. The UX was described as 'horrendous.' Standards pulled directly from Illustrative Mathematics.",
    url: "https://flintk12.com/whats-new/july-2026",
    emoji: "🔦",
  },
  {
    source: "Marble App",
    headline: "Open-source curriculum taxonomy dropped — anyone can use it now",
    detail: "Marble released their K-12 curriculum mapping as an open-source repo. Team read: 'Commoditization of learning science-embedded curriculum may have arrived.' The battle shifts to UX.",
    url: "https://withmarble.com/curriculum/",
    emoji: "🪨",
  },
  {
    source: "Carl Hendrick / Alpha School",
    headline: "Alpha's own learning science advisor has doubts",
    detail: "Carl Hendrick wrote a long piece questioning the Alpha School model — and his own decision to consult for them. The team's reaction: 'BOOM!' He might be a future ally.",
    url: "https://carlhendrick.substack.com/p/children-of-the-magenta-line/",
    emoji: "🎯",
  },
];

export const ACTIVE_CONTRIBUTORS = [
  { initial: "M", name: "Mike", channels: ["team-eng", "topic-learning-science", "open-kinship"], messages: 28 },
  { initial: "A", name: "Azim", channels: ["team-eng", "open-kinship"], messages: 22 },
  { initial: "W", name: "Will", channels: ["topic-learning-science", "team-eng"], messages: 18 },
  { initial: "B", name: "Brittany", channels: ["topic-learning-science", "edu-york", "team-pilot-success"], messages: 14 },
  { initial: "R", name: "Rob", channels: ["team-partnerships", "open-kinship"], messages: 12 },
  { initial: "K", name: "Kat", channels: ["topic-learning-science", "topic-collective-intelligence"], messages: 9 },
  { initial: "J", name: "Jordan", channels: ["topic-collective-intelligence", "topic-learning-science"], messages: 8 },
];
