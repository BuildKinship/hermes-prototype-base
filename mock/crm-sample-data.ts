// Sample CRM records for two realistic accounts:
// 1. Upper Canada College (UCC) — private independent school, Toronto
// 2. Toronto District School Board (TDSB) — district with multiple schools

export interface SampleSchool {
  schoolId: number;
  schoolName: string;
  status: string;
  type: string;
  segment: string;
  priorityTier: string;
  strategicValue: string;
  expansionPotential: string;
  relationshipStrength: string;
  leadSource: string;
  schoolDescription: string;
  emailDomain: string;
  website: string;
  city: string;
  provinceState: string;
  countryRegion: string;
  students: number;
  owner: string;
  healthScore: number;
}

export interface SampleContact {
  contactId: number;
  name: string;
  schoolId: number;
  title: string;
  role: string;
  persona: string;
  decisionInfluence: string;
  relationshipStrength: string;
  sentiment: string;
  email: string;
}

export interface SampleDeal {
  dealId: number;
  dealName: string;
  schoolId: number;
  primaryContactId: number;
  stage: string;
  pipeline: string;
  segment: string;
  source: string;
  probability: string;
  students: number;
  grades: string;
  city: string;
  countryRegion: string;
  pilotPathClarity: string;
  proposalStatus: string;
  closeRisk: string;
  notes: string;
}

export interface SampleEngagement {
  engagementId: number;
  title: string;
  schoolId: number;
  contactIds: number[];
  dealId?: number;
  date: string;
  type: string;
  team: string;
  sentiment: string;
  summary: string;
  actionItems: string;
}

export interface SampleAccount {
  accountId: number;
  accountName: string;
  schoolId: number;
  plan: string;
  status: string;
  csm: string;
  startDate: string;
  renewalDate: string;
  mrr: number;
  nps: number;
  healthScore: number;
}

// ─── Upper Canada College ─────────────────────────────────────────────────────

export const uccSchool: SampleSchool = {
  schoolId: 1001,
  schoolName: "Upper Canada College",
  status: "Won/Expansion",
  type: "Private",
  segment: "Private/Independent",
  priorityTier: "Tier 1",
  strategicValue: "High",
  expansionPotential: "High",
  relationshipStrength: "Strong",
  leadSource: "Referral - Advisor",
  schoolDescription: "Elite independent boys' school, Grades 1–12, Toronto",
  emailDomain: "ucc.on.ca",
  website: "https://www.ucc.on.ca",
  city: "Toronto",
  provinceState: "Ontario",
  countryRegion: "Canada",
  students: 1100,
  owner: "Azim Mitha",
  healthScore: 87,
};

export const uccContacts: SampleContact[] = [
  {
    contactId: 2001,
    name: "Dr. Sarah Kingsley",
    schoolId: 1001,
    title: "Head of School",
    role: "Principal",
    persona: "Decision Maker",
    decisionInfluence: "Final Decision",
    relationshipStrength: "Strong",
    sentiment: "Champion",
    email: "s.kingsley@ucc.on.ca",
  },
  {
    contactId: 2002,
    name: "Marcus Webb",
    schoolId: 1001,
    title: "Director of Innovation & Technology",
    role: "IT Admin",
    persona: "Champion",
    decisionInfluence: "Strong Influence",
    relationshipStrength: "Strong",
    sentiment: "Champion",
    email: "m.webb@ucc.on.ca",
  },
  {
    contactId: 2003,
    name: "Jennifer Holt",
    schoolId: 1001,
    title: "Grade 9 English Lead",
    role: "Teacher",
    persona: "End User",
    decisionInfluence: "Input Only",
    relationshipStrength: "Building",
    sentiment: "Supportive",
    email: "j.holt@ucc.on.ca",
  },
];

export const uccDeal: SampleDeal = {
  dealId: 3001,
  dealName: "Upper Canada College — Incubation Year 2",
  schoolId: 1001,
  primaryContactId: 2001,
  stage: "Won/Expansion",
  pipeline: "Expansion",
  segment: "Private",
  source: "Referral",
  probability: "100%",
  students: 220,
  grades: "9–10",
  city: "Toronto",
  countryRegion: "CAN",
  pilotPathClarity: "Clear",
  proposalStatus: "Accepted",
  closeRisk: "Low",
  notes: "Renewal confirmed. Expanding from 120 to 220 students for Year 2. Marcus leading rollout.",
};

export const uccEngagements: SampleEngagement[] = [
  {
    engagementId: 4001,
    title: "UCC Year 2 Kickoff — Curriculum Alignment",
    schoolId: 1001,
    contactIds: [2001, 2002],
    dealId: 3001,
    date: "2026-08-15",
    type: "Meeting",
    team: "Support",
    sentiment: "Positive",
    summary:
      "Reviewed Year 1 outcomes with Sarah and Marcus. Cohort expanded to Grades 9–10. Marcus confirmed IT provisioning timeline. Action items agreed for September launch.",
    actionItems:
      "[Azim]: Send updated MOU for signature by Aug 22\n[Marcus]: Complete SSO configuration by Sep 1\n[Kinship]: Deliver teacher PD session Sep 8",
  },
  {
    engagementId: 4002,
    title: "Teacher PD — Kinship Foundations",
    schoolId: 1001,
    contactIds: [2003],
    dealId: 3001,
    date: "2026-09-08",
    type: "Meeting",
    team: "Support",
    sentiment: "Positive",
    summary:
      "Onboarding session for 14 UCC teachers. Jennifer co-facilitated. Strong engagement; teachers requested additional session on assessment mapping.",
    actionItems:
      "[Azim]: Schedule follow-up assessment mapping session for Sep 22\n[Jennifer]: Share cohort roster by Sep 10",
  },
];

export const uccAccount: SampleAccount = {
  accountId: 5001,
  accountName: "UCC — Incubation Year 2",
  schoolId: 1001,
  plan: "Incubation",
  status: "Active",
  csm: "Azim Mitha",
  startDate: "2026-09-01",
  renewalDate: "2027-06-30",
  mrr: 4200,
  nps: 72,
  healthScore: 87,
};

// ─── Toronto District School Board ────────────────────────────────────────────

export const tdsbDistrict: SampleSchool = {
  schoolId: 1100,
  schoolName: "Toronto District School Board",
  status: "In Deal Process",
  type: "District/Agency",
  segment: "Public/District",
  priorityTier: "Tier 1",
  strategicValue: "High",
  expansionPotential: "High",
  relationshipStrength: "Building",
  leadSource: "Conference",
  schoolDescription: "Largest public school board in Canada, 500+ schools, Toronto",
  emailDomain: "tdsb.on.ca",
  website: "https://www.tdsb.on.ca",
  city: "Toronto",
  provinceState: "Ontario",
  countryRegion: "Canada",
  students: 247000,
  owner: "Dan Taylor",
  healthScore: 58,
};

export const tdsbSchools: SampleSchool[] = [
  {
    schoolId: 1101,
    schoolName: "Monarch Park Collegiate",
    status: "In Deal Process",
    type: "Public",
    segment: "Public/District",
    priorityTier: "Tier 1",
    strategicValue: "High",
    expansionPotential: "Medium",
    relationshipStrength: "Building",
    leadSource: "Conference",
    schoolDescription: "Diverse public high school, East York, strong arts & tech programs",
    emailDomain: "tdsb.on.ca",
    website: "https://schoolweb.tdsb.on.ca/monarchpark",
    city: "Toronto",
    provinceState: "Ontario",
    countryRegion: "Canada",
    students: 1050,
    owner: "Dan Taylor",
    healthScore: 62,
  },
  {
    schoolId: 1102,
    schoolName: "Malvern Collegiate Institute",
    status: "Lead/Qualifying",
    type: "Public",
    segment: "Public/District",
    priorityTier: "Tier 2",
    strategicValue: "Medium",
    expansionPotential: "Medium",
    relationshipStrength: "Weak",
    leadSource: "Conference",
    schoolDescription: "Historic collegiate in Scarborough, IB and advanced academics",
    emailDomain: "tdsb.on.ca",
    website: "https://schoolweb.tdsb.on.ca/malvern",
    city: "Toronto",
    provinceState: "Ontario",
    countryRegion: "Canada",
    students: 1200,
    owner: "Dan Taylor",
    healthScore: 34,
  },
  {
    schoolId: 1103,
    schoolName: "Runnymede Junior and Senior Public School",
    status: "Lead/Qualifying",
    type: "Public",
    segment: "Public/District",
    priorityTier: "Tier 2",
    strategicValue: "Medium",
    expansionPotential: "Low",
    relationshipStrength: "None",
    leadSource: "Conference",
    schoolDescription: "K–8 public school in Bloor West Village, strong parent community",
    emailDomain: "tdsb.on.ca",
    website: "https://schoolweb.tdsb.on.ca/runnymede",
    city: "Toronto",
    provinceState: "Ontario",
    countryRegion: "Canada",
    students: 480,
    owner: "Dan Taylor",
    healthScore: 21,
  },
];

export const tdsbContacts: SampleContact[] = [
  {
    contactId: 2101,
    name: "Patricia Osei",
    schoolId: 1100,
    title: "Superintendent, Curriculum & Instruction",
    role: "Administrator",
    persona: "Decision Maker",
    decisionInfluence: "Final Decision",
    relationshipStrength: "Building",
    sentiment: "Neutral",
    email: "p.osei@tdsb.on.ca",
  },
  {
    contactId: 2102,
    name: "Dev Randhawa",
    schoolId: 1101,
    title: "Principal",
    role: "Principal",
    persona: "Champion",
    decisionInfluence: "Strong Influence",
    relationshipStrength: "Building",
    sentiment: "Supportive",
    email: "d.randhawa@tdsb.on.ca",
  },
  {
    contactId: 2103,
    name: "Leila Nasser",
    schoolId: 1101,
    title: "Head of English Department",
    role: "Department Head",
    persona: "Evaluator",
    decisionInfluence: "Input Only",
    relationshipStrength: "Building",
    sentiment: "Neutral",
    email: "l.nasser@tdsb.on.ca",
  },
];

export const tdsbDeal: SampleDeal = {
  dealId: 3101,
  dealName: "TDSB — Monarch Park Pilot",
  schoolId: 1101,
  primaryContactId: 2102,
  stage: "Discovery",
  pipeline: "New Pilot",
  segment: "Public",
  source: "Conference",
  probability: "30%",
  students: 90,
  grades: "10–11",
  city: "Toronto",
  countryRegion: "CAN",
  pilotPathClarity: "Forming",
  proposalStatus: "Drafting",
  closeRisk: "Medium",
  notes: "Board procurement process required. Patricia Osei has to sign off at district level before school-level approval. Timeline uncertain.",
};

export const tdsbEngagements: SampleEngagement[] = [
  {
    engagementId: 4101,
    title: "TDSB Discovery Call — Monarch Park Scope",
    schoolId: 1101,
    contactIds: [2101, 2102],
    dealId: 3101,
    date: "2026-07-22",
    type: "Call",
    team: "Growth",
    sentiment: "Neutral",
    summary:
      "Initial scoping call with Dev and Patricia. TDSB requires formal board approval for any new vendor. Monarch Park confirmed as pilot site. Cohort size TBD pending Grade 10 enrollment numbers.",
    actionItems:
      "[Dan]: Send one-pager for Patricia's pre-approval review by Jul 29\n[Dan]: Follow up with Dev on enrollment numbers in 2 weeks\n[Kinship]: Prepare board procurement documentation template",
  },
  {
    engagementId: 4102,
    title: "Demo — Monarch Park Dept Heads",
    schoolId: 1101,
    contactIds: [2102, 2103],
    dealId: 3101,
    date: "2026-08-05",
    type: "Demo",
    team: "Growth",
    sentiment: "Positive",
    summary:
      "Product demo for Dev and Leila. Leila engaged on the writing feedback loop; asked specifically about integration with Google Classroom. Dev wants to include a 3rd teacher before committing.",
    actionItems:
      "[Dan]: Loop in a 3rd teacher champion, coordinate with Dev\n[Kinship]: Confirm Google Classroom SSO compatibility and send tech spec",
  },
];

// ─── Export all as a grouped sample dataset ──────────────────────────────────

export const sampleDatasets = [
  {
    id: "ucc",
    label: "Upper Canada College",
    type: "Private independent school",
    emoji: "🏛️",
    school: uccSchool,
    contacts: uccContacts,
    deals: [uccDeal],
    engagements: uccEngagements,
    accounts: [uccAccount],
    tasks: [] as unknown[],
  },
  {
    id: "tdsb",
    label: "TDSB — Monarch Park Pilot",
    type: "Public district (multi-school)",
    emoji: "🏫",
    school: tdsbDistrict,
    contacts: tdsbContacts,
    deals: [tdsbDeal],
    engagements: tdsbEngagements,
    accounts: [] as unknown[],
    tasks: [] as unknown[],
    memberSchools: tdsbSchools,
  },
] as const;
