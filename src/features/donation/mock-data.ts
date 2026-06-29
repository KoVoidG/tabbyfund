/**
 * Mock data for the donation experience.
 * Based on seed.sql fundraisers.
 */

export interface DonationCase {
  id: string;
  photo: string;
  title: string;
  description: string;
  location: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  goal: number;
  raised: number;
  donors: number;
  vet: string;
  quoteNotes: string;
  reportedAgo: string;
}

export const activeFundraisers: DonationCase[] = [
  {
    id: "c0000000-0000-0000-0000-000000000004",
    photo: "https://placehold.co/600x400/F3C9A6/2D3748?text=Cat+4",
    title: "Skin treatment for malnourished cat",
    description: "Severely malnourished with widespread skin condition. Multiple patches of fur loss.",
    location: "Wat Phra Kaew",
    severity: "MEDIUM",
    goal: 4500,
    raised: 2800,
    donors: 4,
    vet: "Dr. Siriporn",
    quoteNotes: "Topical medication, oral antibiotics, nutritional supplements. 2 weeks recovery.",
    reportedAgo: "3 days ago",
  },
  {
    id: "c0000000-0000-0000-0000-000000000005",
    photo: "https://placehold.co/600x400/F3C9A6/2D3748?text=Cat+5",
    title: "Wound treatment for dog-bite victim",
    description: "Multiple bite wounds, some appear infected. The cat is alert but in pain.",
    location: "Lumpini Park",
    severity: "HIGH",
    goal: 8500,
    raised: 5200,
    donors: 4,
    vet: "Dr. Siriporn",
    quoteNotes: "Wound cleaning, stitches, antibiotics, 1-week follow-up.",
    reportedAgo: "2 days ago",
  },
  {
    id: "c0000000-0000-0000-0000-000000000006",
    photo: "https://placehold.co/600x400/F3C9A6/2D3748?text=Cat+6",
    title: "Fracture surgery for fallen cat",
    description: "Front leg broken from a fall. Unable to put weight on it.",
    location: "Silom",
    severity: "HIGH",
    goal: 15000,
    raised: 3000,
    donors: 2,
    vet: "Dr. Anuwat",
    quoteNotes: "Fracture surgery: bone pinning, cast, pain medication, 3-week recovery.",
    reportedAgo: "4 days ago",
  },
];

export const urgentCases = activeFundraisers.filter((c) => c.severity === "HIGH" || c.severity === "CRITICAL");
export const almostFunded = activeFundraisers.filter((c) => c.raised / c.goal >= 0.6).sort((a, b) => b.raised / b.goal - a.raised / a.goal);

export const presetAmounts = [100, 200, 500, 1000, 2000, 5000];
