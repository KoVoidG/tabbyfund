/**
 * Mock data for the Vet Portal.
 * Based on seed.sql cases assigned to vets.
 */

export interface VetCase {
  id: string;
  photo: string;
  description: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  condition: string;
  location: string;
  reporter: string;
  reportedAgo: string;
  status: "waiting" | "quoted" | "in_treatment" | "recovering" | "completed";
  aiConfidence: number;
  aiReasoning: string;
  firstAid: string[];
}

export interface TreatmentUpdate {
  id: string;
  date: string;
  note: string;
  status: "examining" | "treating" | "recovering" | "recovered";
}

export const vetStats = {
  waiting: 2,
  inTreatment: 2,
  quotesSent: 5,
  completedToday: 0,
};

export const vetCases: VetCase[] = [
  {
    id: "c0000000-0000-0000-0000-000000000003",
    photo: "https://placehold.co/600x400/F3C9A6/2D3748?text=Cat+3",
    description: "Cat with swollen eye and discharge, found in Ari area.",
    severity: "MEDIUM",
    condition: "Eye Injury",
    location: "Ari",
    reporter: "Prawit C.",
    reportedAgo: "1 day ago",
    status: "waiting",
    aiConfidence: 78,
    aiReasoning: "Swollen left eye with visible discharge. Otherwise healthy and mobile.",
    firstAid: ["Do not attempt to clean the eye", "Keep calm environment"],
  },
  {
    id: "c0000000-0000-0000-0000-000000000004",
    photo: "https://placehold.co/600x400/F3C9A6/2D3748?text=Cat+4",
    description: "Severely malnourished with skin condition. Multiple patches of fur loss.",
    severity: "MEDIUM",
    condition: "Skin Condition",
    location: "Wat Phra Kaew",
    reporter: "Kannika W.",
    reportedAgo: "3 days ago",
    status: "quoted",
    aiConfidence: 74,
    aiReasoning: "Severe malnutrition and widespread skin condition.",
    firstAid: ["Provide food if available", "Contact shelter"],
  },
  {
    id: "c0000000-0000-0000-0000-000000000007",
    photo: "https://placehold.co/600x400/F3C9A6/2D3748?text=Cat+7",
    description: "Cat hit by vehicle. Heavy bleeding from hind leg. Conscious but immobile.",
    severity: "CRITICAL",
    condition: "Road Accident",
    location: "Phahon Yothin",
    reporter: "Nattaya S.",
    reportedAgo: "5 days ago",
    status: "in_treatment",
    aiConfidence: 92,
    aiReasoning: "Likely hit by vehicle. Heavy bleeding from hind leg.",
    firstAid: ["Do not move", "Keep warm", "Emergency transport"],
  },
  {
    id: "c0000000-0000-0000-0000-000000000008",
    photo: "https://placehold.co/600x400/F3C9A6/2D3748?text=Cat+8",
    description: "Cat with abdominal swelling, found in Khlong Toei market.",
    severity: "MEDIUM",
    condition: "Unknown",
    location: "Khlong Toei",
    reporter: "Prawit C.",
    reportedAgo: "6 days ago",
    status: "in_treatment",
    aiConfidence: 62,
    aiReasoning: "Visible abdominal swelling. Unable to determine cause from image.",
    firstAid: ["Provide quiet resting area", "Do not press on swelling"],
  },
  {
    id: "c0000000-0000-0000-0000-000000000009",
    photo: "https://placehold.co/600x400/F3C9A6/2D3748?text=Orange+Tabby",
    description: "Orange tabby with leg wound. Fully recovered, now in foster care.",
    severity: "MEDIUM",
    condition: "Open Wound",
    location: "Thonglor",
    reporter: "Kannika W.",
    reportedAgo: "14 days ago",
    status: "completed",
    aiConfidence: 80,
    aiReasoning: "Minor wound on the leg. Otherwise healthy.",
    firstAid: ["Clean gently", "Monitor for infection"],
  },
];

export const treatmentTimeline: TreatmentUpdate[] = [
  { id: "1", date: "Day 1", note: "Initial examination complete. X-ray shows no internal bleeding.", status: "examining" },
  { id: "2", date: "Day 2", note: "Surgery to repair hind leg fracture. Successful.", status: "treating" },
  { id: "3", date: "Day 3", note: "Post-surgery check. Vitals stable, eating normally.", status: "recovering" },
];

export const quoteItems = [
  { name: "X-Ray", cost: 1500 },
  { name: "Blood Test", cost: 800 },
  { name: "Surgery", cost: 15000 },
  { name: "Medication (7 days)", cost: 2500 },
  { name: "Hospital Stay (3 days)", cost: 3000 },
];
