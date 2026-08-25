// Mock data: Kinship CRM entity schemas, fields, and relationships
// Source: kinship-crm-data-structures.md — live Notion introspection, Aug 25, 2026

export type FieldType =
  | "title"
  | "id"
  | "text"
  | "select"
  | "multi-select"
  | "number"
  | "date"
  | "person"
  | "url"
  | "email"
  | "phone"
  | "checkbox"
  | "rollup"
  | "relation"
  | "status"
  | "files";

export type FieldFlag = "migration-key" | "broken" | "warning" | "automation" | "non-crm" | "duplicate";

export interface Field {
  name: string;
  type: FieldType;
  notes?: string;
  values?: string[];
  flags?: FieldFlag[];
  relatesTo?: string;
}

export interface Entity {
  id: string;
  name: string;
  emoji: string;
  color: string;
  accentColor: string;
  crmAnalog: string;
  description: string;
  rowCount: string;
  fields: Field[];
  dataQualityNotes?: string[];
}

export const entities: Entity[] = [
  {
    id: "schools",
    name: "Schools",
    emoji: "🏫",
    color: "#1a56db",
    accentColor: "#e8f0fe",
    crmAnalog: "Company / Account",
    description: "Master record. Keystone — everything links here. Never deleted; lifecycle ends at Renurturing.",
    rowCount: "Largest table",
    fields: [
      { name: "School Name", type: "title", notes: "Full official name, no abbreviations" },
      { name: "School ID", type: "id", notes: "Stable numeric key", flags: ["migration-key"] },
      { name: "Status", type: "select", values: ["Lead/Qualifying", "In Deal Process", "Won/Expansion", "Renurturing"] },
      { name: "Type", type: "select", values: ["Public", "Private", "Charter", "International", "Consultant", "District/Agency", "Partner/Vendor", "Fund/Investor"] },
      { name: "Segment", type: "select", values: ["Public/District", "Private/Independent", "JDS", "Charter", "Charter Network", "International", "International Network", "Network", "Virtual"] },
      { name: "Priority Tier", type: "select", values: ["Tier 1", "Tier 2", "Tier 3"] },
      { name: "Strategic Value", type: "select", values: ["High", "Medium", "Low"] },
      { name: "Expansion Potential", type: "select", values: ["High", "Medium", "Low"] },
      { name: "Relationship Strength", type: "select", values: ["Strong", "Building", "Weak", "None"] },
      { name: "Lead Source", type: "select", values: ["Founder", "Partner", "Referral - Advisor", "Referral - School", "Conference", "Inbound/Website"] },
      { name: "School Description", type: "text", notes: "One-line context" },
      { name: "Email Domain", type: "text", notes: "Auto-matching inbound email + meeting attendees" },
      { name: "Website", type: "url" },
      { name: "City", type: "text" },
      { name: "Province / State", type: "text" },
      { name: "Country/Region", type: "select", values: ["Canada", "USA", "LatAm", "EUR/UK", "Middle East", "Asia"] },
      { name: "Students", type: "number", notes: "Approximate enrolment" },
      { name: "Owner", type: "person", notes: "Primary Kinship relationship owner" },
      { name: "Health Score", type: "number", notes: "0–100, automation-computed", flags: ["automation"] },
      { name: "Last Engagement", type: "date", notes: "Automation-updated", flags: ["automation"] },
      { name: "Files & media", type: "files" },
      { name: "Contacts", type: "relation", relatesTo: "contacts" },
      { name: "Deals", type: "relation", relatesTo: "deals" },
      { name: "Engagements", type: "relation", relatesTo: "engagements" },
      { name: "Meetings", type: "relation", relatesTo: "meetings" },
      { name: "Customer Accounts", type: "relation", relatesTo: "customer-accounts" },
      { name: "Customer Requests", type: "relation", relatesTo: "customer-requests", flags: ["non-crm"] },
      { name: "Devices", type: "relation", relatesTo: "devices", flags: ["non-crm"] },
      { name: "Tasks", type: "relation", relatesTo: "tasks" },
    ],
  },
  {
    id: "contacts",
    name: "Contacts",
    emoji: "👤",
    color: "#7e3af2",
    accentColor: "#f5f3ff",
    crmAnalog: "Contact / Person",
    description: "People at schools. Deduped — one row per person.",
    rowCount: "Medium",
    fields: [
      { name: "Name", type: "title" },
      { name: "Contact ID", type: "id", flags: ["migration-key"] },
      { name: "School", type: "relation", relatesTo: "schools", notes: "Required" },
      { name: "Title", type: "text", notes: "Actual job title, free text" },
      { name: "Role", type: "select", notes: "~38 values — drifted from 10-value taxonomy", flags: ["warning"] },
      { name: "Persona", type: "select", values: ["Champion", "Decision Maker", "Stakeholder", "Evaluator", "End User"] },
      { name: "Decision Influence", type: "select", values: ["Final Decision", "Strong Influence", "Input Only", "Gatekeeper", "Unknown"] },
      { name: "Relationship Strength", type: "select", values: ["Strong", "Building", "Weak", "None"] },
      { name: "Sentiment", type: "select", values: ["Champion", "Supportive", "Neutral", "Skeptical", "Opposed", "Unknown"] },
      { name: "Email", type: "email" },
      { name: "Phone", type: "phone" },
      { name: "LinkedIn", type: "url" },
      { name: "Kinship Owner", type: "person" },
      { name: "Last Contact", type: "date" },
      { name: "Notes", type: "text", notes: "Communication style, priorities, concerns" },
      { name: "Deals", type: "relation", relatesTo: "deals" },
      { name: "Engagements", type: "relation", relatesTo: "engagements" },
      { name: "Tasks", type: "relation", relatesTo: "tasks" },
      { name: "Customer Requests", type: "relation", relatesTo: "customer-requests", flags: ["non-crm"] },
    ],
    dataQualityNotes: [
      "Role field has drifted to ~38 values (was designed as ~10). Recommend collapsing to canonical taxonomy on migration, letting Title carry specifics.",
    ],
  },
  {
    id: "deals",
    name: "Deals",
    emoji: "💼",
    color: "#057a55",
    accentColor: "#f0fff4",
    crmAnalog: "Opportunity",
    description: "Sales pipeline. Created at first live conversation — never earlier. Schools >> Deals in row count.",
    rowCount: "Medium",
    fields: [
      { name: "Deal Name", type: "title", notes: "[School] — [Program]" },
      { name: "Deal ID", type: "id", flags: ["migration-key"] },
      { name: "School", type: "relation", relatesTo: "schools", notes: "Required" },
      { name: "Primary Contact", type: "relation", relatesTo: "contacts", notes: "Can be multiple" },
      { name: "Stage", type: "select", values: ["Targeted", "Engaged", "Discovery", "Stakeholders & Pilot Design", "Verbal Commit", "Won/Expansion", "Renurturing", "Pilot Completed"] },
      { name: "Pipeline", type: "select", values: ["New Pilot", "Expansion"] },
      { name: "Segment", type: "select", values: ["Public", "Private", "Charter", "International", "Virtual"] },
      { name: "Source", type: "select", values: ["Partner", "Referral", "Conference", "Outbound", "Inbound", "Other", "Founder"] },
      { name: "Probability", type: "multi-select", values: ["10%", "30%", "60%", "80%", "100%"], notes: "Should be single-select or number", flags: ["warning"] },
      { name: "Students", type: "number", notes: "Cohort size" },
      { name: "Grade(s)", type: "text" },
      { name: "City / State/province", type: "text" },
      { name: "Country/Region", type: "multi-select", values: ["US", "CAN", "LATAM", "EUR", "AUS", "ASIA", "ME"], flags: ["warning"] },
      { name: "Pilot Start Date", type: "date" },
      { name: "1st Day of School", type: "date" },
      { name: "Pilot Path Clarity", type: "select", values: ["Clear", "Forming", "Unclear"] },
      { name: "Cohort Defined?", type: "checkbox" },
      { name: "Stakeholder Map Complete?", type: "checkbox" },
      { name: "Signed MOU?", type: "checkbox" },
      { name: "Proposal Status", type: "select", values: ["Not Started", "Drafting", "Sent", "Accepted", "Rejected"] },
      { name: "Contract Status", type: "select", values: ["None", "Drafting", "Redlines", "Signed"] },
      { name: "Blocker Type", type: "multi-select", values: ["Budget", "Timing", "No Champion", "Technical", "Board / Parent Risk", "Competing Priority", "Other"] },
      { name: "Blocker Summary", type: "text" },
      { name: "Close Risk", type: "select", values: ["Low", "Medium", "High"] },
      { name: "Lost Reason", type: "select", values: ["Price", "Timing", "No Champion", "Competitor", "No Budget", "Product Gap", "Unresponsive"] },
      { name: "Founder Assist Needed?", type: "checkbox" },
      { name: "Leadership Ask", type: "text" },
      { name: "Slack Alert Needed?", type: "checkbox", flags: ["automation"] },
      { name: "Alert Type", type: "select", values: ["Founder Assist", "Deal Stuck", "Proposal Sent", "Contract Risk", "Closed Won"], flags: ["automation"] },
      { name: "Alert Audience", type: "select", values: ["Growth", "Founders", "Support", "All"], flags: ["automation"] },
      { name: "Training Status", type: "status", values: ["Not confirmed", "Calendared", "Completed"] },
      { name: "Teacher PD dates", type: "date" },
      { name: "PD Medium", type: "select", values: ["Virtual", "In-Person"] },
      { name: "PD resourcing", type: "person" },
      { name: "On-site launch support", type: "text" },
      { name: "MAP Testing", type: "text" },
      { name: "Authentication", type: "text", notes: "Free text — pilot tech requirement" },
      { name: "Launch Checklist", type: "url" },
      { name: "Notes", type: "text" },
      { name: "Aug 24 Weekly Notes", type: "text", notes: "Point-in-time meeting artifact", flags: ["warning"] },
      { name: "Aug 24 Weekly Notes (dup)", type: "text", notes: "Accidental duplicate column", flags: ["duplicate"] },
      { name: "Aug 24 Weekly Tag", type: "select", values: ["TO FILL OUT", "TO DISCUSS", "NO DISCUSSION NEEDED"], flags: ["warning"] },
      { name: "Owner", type: "rollup", notes: "Rolls up School → Owner" },
      { name: "Last Activity", type: "rollup", notes: "Misconfigured — rolls up Contacts relation, not engagement date", flags: ["broken"] },
      { name: "Next Actions", type: "relation", relatesTo: "tasks" },
      { name: "Tasks", type: "relation", relatesTo: "tasks" },
      { name: "Engagements", type: "relation", relatesTo: "engagements" },
      { name: "Meetings", type: "relation", relatesTo: "meetings" },
      { name: "Files & media", type: "files" },
    ],
    dataQualityNotes: [
      "No monetary value/ACV field — Probability carries a stale description referencing a Value field that no longer exists.",
      "Probability and Country/Region are multi-selects — should be single-value.",
      "Last Activity rollup is broken — returns contact title instead of engagement date.",
      "Owner is a rollup, not a direct field — can't assign a deal owner distinct from school owner.",
      "Post-sale pilot delivery fields (Training Status, PD dates, Launch Checklist, etc.) are candidate to split into a Pilot/Implementation object.",
      "Two duplicate Aug 24 Weekly Notes columns — accidental schema drift.",
    ],
  },
  {
    id: "engagements",
    name: "Engagements",
    emoji: "📝",
    color: "#d97706",
    accentColor: "#fffbeb",
    crmAnalog: "Activity / Timeline Event",
    description: "Curated, contact-linked relationship timeline. The layer people actually read. AI-summarized. Fed by n8n automations from Gmail + Meet.",
    rowCount: "Largest after Schools",
    fields: [
      { name: "Title", type: "title", notes: "Short descriptor" },
      { name: "Engagement ID", type: "id", flags: ["migration-key"] },
      { name: "School", type: "relation", relatesTo: "schools", notes: "Required — never orphan" },
      { name: "Contacts", type: "relation", relatesTo: "contacts", notes: "Attendees" },
      { name: "Deal", type: "relation", relatesTo: "deals", notes: "Set for Growth touchpoints" },
      { name: "Customer Account", type: "relation", relatesTo: "customer-accounts", notes: "Set for Support touchpoints" },
      { name: "Date", type: "date" },
      { name: "Type", type: "select", values: ["Meeting", "Email", "Call", "Demo", "Check-in", "Proposal", "Contract", "Note", "Update", "Internal Meeting", "Team Meeting"] },
      { name: "Team", type: "select", values: ["Growth", "Support", "Engineering", "Product"] },
      { name: "Owner", type: "person" },
      { name: "Sentiment", type: "select", values: ["Positive", "Neutral", "Negative", "Unknown"] },
      { name: "Topics", type: "multi-select", notes: "~40 values, has drifted (school-specific entries)", flags: ["warning"] },
      { name: "Summary", type: "text", notes: "AI-generated, ~3 sentences" },
      { name: "Action Items", type: "text", notes: "[Owner]: [action] by [date]" },
      { name: "Transcript URL", type: "url", notes: "Link to Meet/Gemini doc in Drive" },
      { name: "Duration (min)", type: "number" },
      { name: "Source Ref", type: "text", notes: "Upstream artifact reference" },
      { name: "Customer Requests", type: "relation", relatesTo: "customer-requests", flags: ["non-crm"] },
    ],
    dataQualityNotes: [
      "Topics multi-select has ~40 values with school-specific entries (e.g. 'Brown School Pilot', 'UCC') that duplicate the School relation. Needs a taxonomy pass.",
      "Team routing rule: Won/Expansion → Support; Lead/In Deal Process → Growth; all-internal attendees → Engineering.",
    ],
  },
  {
    id: "meetings",
    name: "Meetings",
    emoji: "📼",
    color: "#be185d",
    accentColor: "#fff0f6",
    crmAnalog: "Call / Recording Record",
    description: "Raw capture layer — one row per recording. Distinct from Engagements: Meetings is what the recorder produced, Engagements is the written-up version.",
    rowCount: "Small (possibly dead)",
    fields: [
      { name: "Meeting", type: "title" },
      { name: "Meeting ID", type: "id", flags: ["migration-key"] },
      { name: "Meeting Date", type: "date" },
      { name: "Host", type: "person" },
      { name: "Participants", type: "text", notes: "Raw attendee list, unresolved" },
      { name: "Recording URL", type: "url" },
      { name: "Source", type: "select", values: ["Zoom", "Manual", "Other"], notes: "Zoom retired July 2026 — stale options", flags: ["warning"] },
      { name: "Team", type: "multi-select", values: ["All", "Eng"] },
      { name: "School", type: "relation", relatesTo: "schools" },
      { name: "💼 Deals", type: "relation", relatesTo: "deals", notes: "Property name literally includes the emoji" },
    ],
    dataQualityNotes: [
      "Zoom-era capture layer, retired July 2026. Current transcripts come from Google Meet + Gemini and land in the Meeting Notes shared drive, not here.",
      "Confirm whether this database is still being written to before migrating — it may be a dead layer.",
    ],
  },
  {
    id: "customer-accounts",
    name: "Customer Accounts",
    emoji: "🎓",
    color: "#0f766e",
    accentColor: "#f0fdfa",
    crmAnalog: "Subscription / Post-sale Account",
    description: "Post-close relationship. One per program engagement, not per school. One school can have multiple accounts over time.",
    rowCount: "Small",
    fields: [
      { name: "Account Name", type: "title", notes: 'e.g. "RHA — Incubation Year 1"' },
      { name: "Account ID", type: "id", flags: ["migration-key"] },
      { name: "School", type: "relation", relatesTo: "schools" },
      { name: "Plan", type: "select", values: ["Incubation", "Full Customer", "Camp", "Pilot"] },
      { name: "Status", type: "select", values: ["Active", "At Risk", "Churned", "Paused"] },
      { name: "CSM", type: "person" },
      { name: "Start Date", type: "date" },
      { name: "Renewal Date", type: "date" },
      { name: "Last QBR", type: "date" },
      { name: "MRR", type: "number", notes: "Monthly recurring revenue, CAD — only revenue field in CRM" },
      { name: "NPS", type: "number", notes: "-100 to 100" },
      { name: "Health Score", type: "number", notes: "0–100, automation-computed", flags: ["automation"] },
      { name: "Open Tickets", type: "number", notes: "Automation-updated", flags: ["automation"] },
      { name: "Notes", type: "text" },
      { name: "Engagements", type: "relation", relatesTo: "engagements" },
    ],
  },
  {
    id: "tasks",
    name: "Tasks",
    emoji: "✅",
    color: "#4f46e5",
    accentColor: "#f5f3ff",
    crmAnalog: "Task",
    description: "Forward-looking action layer, cross-functional. Links back to Schools, Deals, and Contacts.",
    rowCount: "Medium",
    fields: [
      { name: "Task Name", type: "title", notes: "[verb] + [object]" },
      { name: "Task ID", type: "id", flags: ["migration-key"] },
      { name: "Related School", type: "relation", relatesTo: "schools", notes: "Required" },
      { name: "Related Deal", type: "relation", relatesTo: "deals" },
      { name: "Related Contact", type: "relation", relatesTo: "contacts" },
      { name: "Deal", type: "relation", relatesTo: "deals", notes: "Second, redundant Deal relation — inverse of Deals → Next Actions", flags: ["duplicate"] },
      { name: "Team", type: "select", values: ["Growth", "Support", "Engineering"] },
      { name: "Task Owner", type: "person" },
      { name: "Task Type", type: "select", values: ["Call", "Email", "Meeting", "Follow-up", "Proposal", "Demo", "Contract", "Internal", "Research", "Sales Enablement", "Account Management", "Sales Outreach", "Operations"] },
      { name: "Due Date", type: "date" },
      { name: "Status", type: "select", values: ["To Do", "Not Started", "In Progress", "Done", "Blocked", "Cancelled"] },
      { name: "Priority", type: "select", values: ["Urgent", "High", "Medium", "Low"] },
      { name: "Outcome", type: "text", notes: "Filled after Done" },
      { name: "Creates Stage Movement?", type: "checkbox" },
      { name: "Slack Alert Needed?", type: "checkbox", flags: ["automation"] },
    ],
    dataQualityNotes: [
      "Two Deal relations: Related Deal and Deal — both point at Deals. Consolidate to one on migration.",
    ],
  },
];

export const relationships = [
  { from: "schools", to: "contacts", label: "1 → many" },
  { from: "schools", to: "deals", label: "1 → many (only when live conversation exists)" },
  { from: "schools", to: "engagements", label: "1 → many" },
  { from: "schools", to: "meetings", label: "1 → many" },
  { from: "schools", to: "customer-accounts", label: "1 → many (post-close)" },
  { from: "schools", to: "tasks", label: "1 → many" },
  { from: "deals", to: "contacts", label: "Primary Contact (many)" },
  { from: "deals", to: "tasks", label: "Next Actions + All Tasks" },
  { from: "deals", to: "engagements", label: "Growth touchpoints" },
  { from: "deals", to: "meetings", label: "Related recordings" },
  { from: "engagements", to: "deals", label: "Optional — Growth" },
  { from: "engagements", to: "customer-accounts", label: "Optional — Support" },
  { from: "engagements", to: "contacts", label: "Attendees" },
  { from: "tasks", to: "deals", label: "Related Deal (× 2 — duplicate)" },
  { from: "tasks", to: "contacts", label: "Related Contact" },
  { from: "customer-accounts", to: "engagements", label: "Post-close timeline" },
];

export const dataQualityFlags = [
  {
    id: 1,
    severity: "critical",
    entity: "Deals",
    field: "Last Activity",
    title: "Last Activity rollup is broken",
    description: "Rolls up the Contacts relation and returns the contact's title, not engagement date. Any staleness reporting built on it is wrong today.",
  },
  {
    id: 2,
    severity: "warning",
    entity: "Deals",
    field: "Owner",
    title: "Owner is a rollup, not a field",
    description: "Inherits School → Owner. A deal can't have an owner distinct from the account owner. Most CRMs expect a real deal owner.",
  },
  {
    id: 3,
    severity: "critical",
    entity: "Deals",
    field: null,
    title: "No deal value field",
    description: "No monetary ACV field. Revenue lives on Customer Accounts (MRR) post-close only. If Reevo expects a deal amount, this needs a decision before migration.",
  },
  {
    id: 4,
    severity: "warning",
    entity: "Deals",
    field: "Probability / Country/Region",
    title: "Multi-selects that should be single-value",
    description: "A deal can carry both 30% and 80% probability, or multiple regions. Should be single-value fields.",
  },
  {
    id: 5,
    severity: "info",
    entity: "Deals",
    field: "Aug 24 Weekly Notes",
    title: "Duplicate columns / one-off artifacts",
    description: "Two 'Aug 24 Weekly Notes' text fields (one an accidental copy) plus Aug 24 Weekly Tag — a one-off meeting artifact frozen into the schema.",
  },
  {
    id: 6,
    severity: "info",
    entity: "Tasks",
    field: "Deal / Related Deal",
    title: "Duplicate Deal relation",
    description: "Both Related Deal and Deal point at Deals. Consolidate to one on migration.",
  },
  {
    id: 7,
    severity: "warning",
    entity: "Contacts / Engagements",
    field: "Role / Topics",
    title: "Select-value drift",
    description: "Contacts → Role has ~38 values (mostly one-off job titles). Engagements → Topics has ~40 values including school-specific entries. Both need taxonomy passes before migration.",
  },
  {
    id: 8,
    severity: "critical",
    entity: "Meetings",
    field: null,
    title: "Meetings may be dead",
    description: "Zoom-era capture layer, retired July 2026. Confirm before migrating — may be a dead table.",
  },
  {
    id: 9,
    severity: "critical",
    entity: "All",
    field: null,
    title: "Agent Schema Reference doc is stale",
    description: "The doc lists a 7-stage pipeline, old School statuses, and a Value field on Deals. None match live Notion. Build any Reevo mapping from live introspection, not that doc.",
  },
];

export const migrationOrder = [
  { step: 1, entity: "Schools", reason: "Keystone — everything references it" },
  { step: 2, entity: "Contacts", reason: "Reference Schools" },
  { step: 3, entity: "Deals", reason: "Reference Schools + Contacts" },
  { step: 4, entity: "Customer Accounts", reason: "Reference Schools" },
  { step: 5, entity: "Engagements", reason: "Reference Schools, Contacts, Deals, Accounts" },
  { step: 6, entity: "Meetings", reason: "Reference Schools + Deals (verify if still active)" },
  { step: 7, entity: "Tasks", reason: "Reference Schools, Deals, Contacts" },
];
