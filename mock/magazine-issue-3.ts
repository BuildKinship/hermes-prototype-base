// Mock data for Kinship Magazine Issue #3 — "The Launch Pad"
// Week of July 13–17, 2026

export const ISSUE = {
  number: 3,
  theme: "The Launch Pad",
  tagline: "Something shipped. A lot of things, actually.",
  weekStart: "July 13",
  weekEnd: "July 17, 2026",
  channelsSwept: 33,
  totalMessages: 143,
  totalReactions: 121,
  signalsExtracted: 8,
  lastWeekMessages: 137,
};

export const SIGNALS = [
  {
    category: "Product",
    badge: "🔧 Product",
    color: "#2563EB",
    observation:
      "The first Kinship demo video shipped this week — v1 then v2 within 48 hours, incorporating team feedback on pacing, interventions visibility, and student data accuracy. A product issue was immediately logged to Linear.",
    soWhat:
      "Eng team: prioritize KIN-38 (demo student data adjustments). Marketing: build a library of feature-specific clips so future videos assemble faster.",
    channels: "#open-kinship",
    strength: "Strong",
    link: "https://kinship-9xb4888.slack.com/archives/C0ANS36DN3W/p1783991229470629",
  },
  {
    category: "Product",
    badge: "🔧 Product",
    color: "#2563EB",
    observation:
      "Staging environment setup is underway — production domains provisioned for Hearth and Horizon. GitHub Actions minutes are running low and the team is evaluating whether to upgrade CI/CD plans before pilot season.",
    soWhat:
      "Decision needed: upgrade GitHub Actions plan before August pilots. The database migration (Neon) is a live blocker for the environments ticket (KIN-37).",
    channels: "#team-eng",
    strength: "Strong",
    link: "https://kinship-9xb4888.slack.com/archives/C0ANK3CJM8V/p1783971644226399",
  },
  {
    category: "Partnership",
    badge: "🤝 Partnership",
    color: "#7C3AED",
    observation:
      "Elite K12 (Shanghai school chain) was flagged as a 'potentially very exciting large chain partnership' — leadership was pulled in for a strategy call the next morning. Stanstead College (Quebec) is exploring a Fall pilot after a discovery meeting with their Head of School.",
    soWhat:
      "CEO/CFO: two new international pipeline entries this week. Shanghai chain could be a significant volume deal. Quebec adds geographic diversity. Next step: demo calls with both.",
    channels: "#team-partnerships",
    strength: "Strong",
    link: "https://kinship-9xb4888.slack.com/archives/C0B6Z4MFA3X/p1784118990691579",
  },
  {
    category: "Partnership",
    badge: "🤝 Partnership",
    color: "#7C3AED",
    observation:
      "Grupo Salta / Gera Capital deal is advancing — a call with a key lieutenant confirmed internal positive signals about Kinship from Marcio. Curriki provisionally approved Kinship as a grant-eligible software solution and verbally committed $10k to the NJ pilot.",
    soWhat:
      "CEO/CFO: Curriki grant is a breakthrough for public-district pipeline. Salta relationship needs coordination — multiple contacts in play, risk of looking disorganized. Assign one deal owner.",
    channels: "#edu-salta, #team-partnerships",
    strength: "Strong",
    link: "https://kinship-9xb4888.slack.com/archives/C0BH47VPSKZ/p1784163793752849",
  },
  {
    category: "Support",
    badge: "🆘 Support",
    color: "#D97706",
    observation:
      "RHA pilot prep is surfacing infrastructure gaps: site whitelisting for the August student stress-test is still pending, a Canva template was requested for teacher slide-building, and the app progression manual has open questions. These blockers were being chased in real time.",
    soWhat:
      "Support/success team: whitelist domains must be confirmed with RHA before August. Create a pre-pilot infrastructure checklist to prevent similar last-minute scrambles.",
    channels: "#edu-rha",
    strength: "Moderate",
    link: "https://kinship-9xb4888.slack.com/archives/C0ANG4EMU3D/p1784058378251879",
  },
  {
    category: "Learning Science",
    badge: "📚 Learning Science",
    color: "#059669",
    observation:
      "Anthropic's 'Claude for Teachers' launch triggered deep analysis in #topic-collective-intelligence — team members rapidly catalogued it as squarely teacher-tooling, NOT in-flow student instruction, putting it outside Kinship's core lane. Two open-source agent skill repos were mined for insight.",
    soWhat:
      "Learning science + product teams: Claude for Teachers is not a direct competitor — it validates AI-in-education but doesn't do precision learning. Good framing to use in sales calls.",
    channels: "#topic-collective-intelligence",
    strength: "Strong",
    link: "https://kinship-9xb4888.slack.com/archives/C0ATK34QS8K/p1784049429256929",
  },
  {
    category: "Strategic",
    badge: "💡 Strategic",
    color: "#DC2626",
    observation:
      "Brain transcript workflow crossed a major threshold: Google Meet is now the standard transcription platform (Zoom ends July 23), a new automation asks whether to add each meeting to the Brain, and a tagging/privacy framework is being built in real time. The team is migrating Zoom transcripts before losing access.",
    soWhat:
      "Leadership: download Zoom transcripts before July 23 — or buy another month. The Brain is becoming the team's institutional memory; the tagging framework (public/private) needs to be finalized this week.",
    channels: "#topic-brain-context",
    strength: "Strong",
    link: "https://kinship-9xb4888.slack.com/archives/C0B3WMYDF7T/p1783960881277239",
  },
  {
    category: "Strategic",
    badge: "💡 Strategic",
    color: "#DC2626",
    observation:
      "Summer/Fall KPIs were locked and announced in #open-announcements — Kinship was also shortlisted for something (announcement triggered a channel-wide celebration with heavy reaction volume). A precision learning one-pager and learning science principles doc were drafted and are circulating for feedback.",
    soWhat:
      "Leadership: KPIs are live — every team now has a north star. The one-pager on precision learning is a high-leverage sales asset once finalized. Push for a final reviewed version by next week.",
    channels: "#open-announcements, #open-kinship",
    strength: "Strong",
    link: "https://kinship-9xb4888.slack.com/archives/C0BC3PW3G0P/p1784120179103519",
  },
];

export const SPOTLIGHT = {
  channel: "#open-kinship",
  messageCount: 19,
  reactions: 29,
  uniqueUsers: 10,
  score: 97,
  summary:
    "The undisputed center of gravity this week. Demo video v1 dropped, v2 shipped 48 hours later with team feedback incorporated. An edtech prize submission was coordinated, a precision learning one-pager drafted, and brand asset questions resolved — all in one channel.",
  topThread: {
    topic: "EdTech prize submission — final pass and team rally",
    replies: 15,
    link: "https://kinship-9xb4888.slack.com/archives/C0ANS36DN3W/p1784032636289969",
  },
};

export const HOT_THREADS = [
  {
    channel: "#topic-brain-context",
    replies: 20,
    topic: "Google Meet transcript system: privacy tagging framework + automation launch",
    link: "https://kinship-9xb4888.slack.com/archives/C0B3WMYDF7T/p1783960881277239",
    category: "Strategic",
  },
  {
    channel: "#open-kinship",
    replies: 15,
    topic: "EdTech prize submission — team collaboration on the final doc",
    link: "https://kinship-9xb4888.slack.com/archives/C0ANS36DN3W/p1784032636289969",
    category: "Strategic",
  },
  {
    channel: "#edu-rha",
    replies: 12,
    topic: "RHA Canva template + AI slide-building workflow for teachers",
    link: "https://kinship-9xb4888.slack.com/archives/C0ANG4EMU3D/p1784058419324879",
    category: "Support",
  },
  {
    channel: "#topic-brain-context",
    replies: 11,
    topic: "AI-powered Reddit scraping for competitor research — Hermes capability request",
    link: "https://kinship-9xb4888.slack.com/archives/C0B3WMYDF7T/p1783947951943929",
    category: "Product",
  },
  {
    channel: "#open-kinship",
    replies: 8,
    topic: "Demo video v1 feedback — mastery definition, intervention visibility, teacher trust",
    link: "https://kinship-9xb4888.slack.com/archives/C0ANS36DN3W/p1783996094191289",
    category: "Product",
  },
  {
    channel: "#team-partnerships",
    replies: 8,
    topic: "New NJ public district math pilot — September timeframe, Curriki grant",
    link: "https://kinship-9xb4888.slack.com/archives/C0B6Z4MFA3X/p1784119265943279",
    category: "Partnership",
  },
];

export const KNOWLEDGE_HIGHLIGHT = {
  topic:
    "Independent schools systematically underinvest in a shared theory of instruction",
  channel: "#topic-collective-intelligence",
  summary:
    "After three days facilitating sessions with 17 independent school leaders, a team member shared a sharp insight: independent schools often lack a consistent pedagogical framework not by accident, but because they rely on teacher autonomy instead of systemic alignment. The thread immediately connected this to Kinship's value proposition — enforcing a school-wide theory of instruction is exactly what Kinship enables.",
  pullQuote:
    "Independent schools often lack a shared theory of instruction because they systematically underinvest in it. And based on my last 3 days with 17 indy school leaders — so are a lot of independent schools.",
  link: "https://kinship-9xb4888.slack.com/archives/C0ATK34QS8K/p1784209272064129",
};

export const OPEN_QUESTIONS = [
  {
    question: "What happens to Zoom transcripts after July 23?",
    channel: "#topic-brain-context",
    link: "https://kinship-9xb4888.slack.com/archives/C0B3WMYDF7T/p1784308264392909",
    owner: "Engineering / Operations",
    urgency: "🔴 This week",
  },
  {
    question: "Are RHA site whitelists finalized for the August student stress-test?",
    channel: "#edu-rha",
    link: "https://kinship-9xb4888.slack.com/archives/C0ANG4EMU3D/p1784058378251879",
    owner: "Engineering + Pilot Success",
    urgency: "🔴 August blocker",
  },
  {
    question: "What is the demo video publishing cadence going forward?",
    channel: "#open-kinship",
    link: "https://kinship-9xb4888.slack.com/archives/C0ANS36DN3W/p1784042993942619",
    owner: "Marketing / Content",
    urgency: "🟡 Strategic",
  },
  {
    question: "Who owns the Salta / Gera Capital relationship now that multiple contacts are in play?",
    channel: "#edu-salta",
    link: "https://kinship-9xb4888.slack.com/archives/C0BH47VPSKZ/p1784163793752849",
    owner: "Partnerships",
    urgency: "🟡 Deal risk",
  },
];

export const QUIET_CHANNELS = [
  "edu-ucc", "edu-brown", "edu-york", "topic-hiring", "topic-ontario-public-schools",
  "proj-sputnik", "topic-pilots", "topic-culture", "team-blockers", "proj-portico",
  "team-kinship-weekly-update", "topic-sales-collateral-ideas", "topic-product-feedback",
  "edu-bialek", "edu-tdsb", "edu-leo-baeck",
];

export const COMMUNITY_CORNER = {
  topic: "Google Meet transcript system: privacy tagging framework",
  channel: "#topic-brain-context",
  replies: 20,
  link: "https://kinship-9xb4888.slack.com/archives/C0B3WMYDF7T/p1783960881277239",
};

export const NEW_CHANNEL = {
  name: "#topic-competitive-intel",
  announcement: "A new channel for competitor intel and interesting edtech products was created this week and immediately populated with the Claude for Teachers analysis.",
};
