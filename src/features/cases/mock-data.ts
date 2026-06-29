/**
 * Mock case data for G3 — based on seed.sql.
 * Will be replaced with real Supabase queries later.
 */

export type CaseStatus =
  | "REPORTED" | "TRIAGED" | "AWAITING_TRANSPORT" | "IN_TRANSIT"
  | "AT_VET" | "QUOTED" | "FUNDING_OPEN" | "FUNDED"
  | "IN_TREATMENT" | "TREATED" | "FUNDS_RELEASED"
  | "IN_FOSTER" | "ADOPTED";

export type Severity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

export interface MockCase {
  id: string;
  photo: string;
  description: string;
  status: CaseStatus;
  severity: Severity;
  condition: string;
  confidence: number;
  reasoning: string;
  firstAid: string[];
  location: string;
  fuzzedLat: number;
  fuzzedLng: number;
  reportedAgo: string;
  reporter: string;
  // Funding
  goal?: number;
  raised?: number;
  donors?: number;
  // Transport
  transporter?: string;
  transportStatus?: "OPEN" | "CLAIMED" | "DELIVERED";
  // Vet
  vet?: string;
  quotedAmount?: number;
  quoteNotes?: string;
  // Treatment
  treatmentSummary?: string;
  outcome?: "ONGOING" | "RECOVERED";
  // Foster
  fosterCaretaker?: string;
  fosterDays?: number;
  // Adoption
  personality?: string;
  medicalNotes?: string;
  adoptionStatus?: "OPEN" | "MATCHED" | "COMPLETED";
}

export const mockCases: MockCase[] = [
  {
    id: "c0000000-0000-0000-0000-000000000001",
    photo: "https://placehold.co/600x400/F3C9A6/2D3748?text=Injured+Cat+1",
    description: "Cat hit by car near Sukhumvit Soi 23. Hind leg appears broken, unable to stand.",
    status: "AWAITING_TRANSPORT",
    severity: "CRITICAL",
    condition: "Fracture",
    confidence: 91,
    reasoning: "The cat appears unable to stand. Visible swelling on the hind leg suggests a possible fracture.",
    firstAid: ["Do not attempt to move the cat forcefully", "Keep the area quiet", "Provide water nearby if safe", "Contact a transporter immediately"],
    location: "Sukhumvit Soi 23",
    fuzzedLat: 13.739,
    fuzzedLng: 100.562,
    reportedAgo: "2 hours ago",
    reporter: "Somchai K.",
    transportStatus: "OPEN",
  },
  {
    id: "c0000000-0000-0000-0000-000000000002",
    photo: "https://placehold.co/600x400/F3C9A6/2D3748?text=Injured+Cat+2",
    description: "Cat with a large open wound on its back, found near Chatuchak market.",
    status: "IN_TRANSIT",
    severity: "HIGH",
    condition: "Open Wound",
    confidence: 85,
    reasoning: "Large open wound visible on the back. Moderate bleeding observed.",
    firstAid: ["Do not touch the wound directly", "Keep the cat warm with a towel", "Avoid chasing"],
    location: "Chatuchak",
    fuzzedLat: 13.801,
    fuzzedLng: 100.554,
    reportedAgo: "5 hours ago",
    reporter: "Nattaya S.",
    transporter: "Prawit C.",
    transportStatus: "CLAIMED",
  },
  {
    id: "c0000000-0000-0000-0000-000000000003",
    photo: "https://placehold.co/600x400/F3C9A6/2D3748?text=Injured+Cat+3",
    description: "Cat with swollen eye and discharge, found in Ari area. Now at vet.",
    status: "AT_VET",
    severity: "MEDIUM",
    condition: "Eye Injury",
    confidence: 78,
    reasoning: "Swollen left eye with visible discharge. Otherwise healthy and mobile.",
    firstAid: ["Do not attempt to clean the eye", "Keep calm environment", "Provide fresh water"],
    location: "Ari",
    fuzzedLat: 13.780,
    fuzzedLng: 100.545,
    reportedAgo: "1 day ago",
    reporter: "Prawit C.",
    transporter: "Kannika W.",
    transportStatus: "DELIVERED",
    vet: "Dr. Siriporn",
  },
  {
    id: "c0000000-0000-0000-0000-000000000004",
    photo: "https://placehold.co/600x400/F3C9A6/2D3748?text=Injured+Cat+4",
    description: "Severely malnourished cat with skin condition, found behind Wat Phra Kaew.",
    status: "FUNDING_OPEN",
    severity: "MEDIUM",
    condition: "Skin Condition",
    confidence: 74,
    reasoning: "Severe malnutrition and widespread skin condition. Multiple patches of fur loss.",
    firstAid: ["Provide food if available", "Do not force into carrier", "Contact shelter"],
    location: "Wat Phra Kaew",
    fuzzedLat: 13.752,
    fuzzedLng: 100.493,
    reportedAgo: "3 days ago",
    reporter: "Kannika W.",
    transporter: "Thana P.",
    transportStatus: "DELIVERED",
    vet: "Dr. Siriporn",
    quotedAmount: 4500,
    quoteNotes: "Skin treatment: topical medication, oral antibiotics, supplements. Est. 2 weeks.",
    goal: 4500,
    raised: 2800,
    donors: 4,
  },
  {
    id: "c0000000-0000-0000-0000-000000000005",
    photo: "https://placehold.co/600x400/F3C9A6/2D3748?text=Injured+Cat+5",
    description: "Cat bitten by a dog with multiple wounds, found near Lumpini Park.",
    status: "FUNDING_OPEN",
    severity: "HIGH",
    condition: "Open Wound",
    confidence: 88,
    reasoning: "Multiple bite wounds visible. Some appear infected. Alert but in pain.",
    firstAid: ["Do not touch the wounds", "Keep calm", "Transport to vet ASAP"],
    location: "Lumpini Park",
    fuzzedLat: 13.732,
    fuzzedLng: 100.542,
    reportedAgo: "2 days ago",
    reporter: "Thana P.",
    transporter: "Somchai K.",
    transportStatus: "DELIVERED",
    vet: "Dr. Siriporn",
    quotedAmount: 8500,
    quoteNotes: "Wound cleaning, stitches, antibiotics, 1-week follow-up.",
    goal: 8500,
    raised: 5200,
    donors: 4,
  },
  {
    id: "c0000000-0000-0000-0000-000000000007",
    photo: "https://placehold.co/600x400/F3C9A6/2D3748?text=Injured+Cat+7",
    description: "Cat hit by vehicle on Phahon Yothin Road. Heavy bleeding from hind leg.",
    status: "IN_TREATMENT",
    severity: "CRITICAL",
    condition: "Road Accident",
    confidence: 92,
    reasoning: "Likely hit by vehicle. Heavy bleeding from hind leg. Conscious but immobile.",
    firstAid: ["Do not move", "Keep warm", "Emergency transport needed"],
    location: "Phahon Yothin",
    fuzzedLat: 13.820,
    fuzzedLng: 100.562,
    reportedAgo: "5 days ago",
    reporter: "Nattaya S.",
    transporter: "Nattaya S.",
    transportStatus: "DELIVERED",
    vet: "Dr. Anuwat",
    quotedAmount: 22000,
    quoteNotes: "Emergency surgery for internal bleeding. ICU 3 days.",
    goal: 22000,
    raised: 22000,
    donors: 2,
    treatmentSummary: "Emergency surgery completed. Currently recovering in ICU day 2.",
    outcome: "ONGOING",
  },
  {
    id: "c0000000-0000-0000-0000-000000000009",
    photo: "https://placehold.co/600x400/F3C9A6/2D3748?text=Orange+Tabby",
    description: "Orange tabby with leg wound, found in Thonglor. Fully recovered now.",
    status: "IN_FOSTER",
    severity: "MEDIUM",
    condition: "Open Wound",
    confidence: 80,
    reasoning: "Minor wound on the leg. Otherwise healthy.",
    firstAid: ["Clean gently", "Monitor for infection", "Keep indoors"],
    location: "Thonglor",
    fuzzedLat: 13.737,
    fuzzedLng: 100.579,
    reportedAgo: "14 days ago",
    reporter: "Kannika W.",
    transporter: "Prawit C.",
    transportStatus: "DELIVERED",
    vet: "Dr. Siriporn",
    quotedAmount: 3500,
    quoteNotes: "Wound cleaning, topical antibiotics, follow-up.",
    goal: 3500,
    raised: 3500,
    donors: 1,
    treatmentSummary: "Wound fully healed. Vaccinations complete. Healthy.",
    outcome: "RECOVERED",
    fosterCaretaker: "Prawit C.",
    fosterDays: 7,
    personality: "Friendly, loves head scratches, enjoys sunbathing. Not afraid of people.",
    medicalNotes: "Vaccinations complete. Neutered. Healthy.",
    adoptionStatus: "OPEN",
  },
  {
    id: "c0000000-0000-0000-0000-000000000010",
    photo: "https://placehold.co/600x400/F3C9A6/2D3748?text=Adopted+Tabby",
    description: "Tabby with broken hind leg, found near Chulalongkorn University. Now adopted!",
    status: "ADOPTED",
    severity: "HIGH",
    condition: "Fracture",
    confidence: 87,
    reasoning: "Hind leg fracture detected. Immobile, requires immediate vet care.",
    firstAid: ["Stabilize on flat surface", "Keep warm and quiet", "Transport immediately"],
    location: "Chulalongkorn",
    fuzzedLat: 13.739,
    fuzzedLng: 100.533,
    reportedAgo: "21 days ago",
    reporter: "Thana P.",
    transporter: "Thana P.",
    transportStatus: "DELIVERED",
    vet: "Dr. Anuwat",
    quotedAmount: 18000,
    quoteNotes: "Hind leg fracture surgery, bone pinning, 4-week recovery.",
    goal: 18000,
    raised: 18000,
    donors: 2,
    treatmentSummary: "Fracture surgery successful. Leg healed, walks normally. Vaccinations complete.",
    outcome: "RECOVERED",
    fosterCaretaker: "Thana P.",
    fosterDays: 7,
    personality: "Affectionate, playful, follows people. Gets along with other cats.",
    medicalNotes: "Hind leg surgery fully healed. Vaccinations complete. Neutered.",
    adoptionStatus: "COMPLETED",
  },
];
