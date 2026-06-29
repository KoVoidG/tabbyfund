/**
 * Mock data for the community dashboard.
 * Based on our seed database for realistic demo content.
 * Will be replaced with real Supabase queries later.
 */

export const dashboardStats = {
  catsReported: 10,
  transportMissions: 3,
  totalDonated: 5200,
  successfulAdoptions: 1,
};

export const casesNeedingTransport = [
  {
    id: "c0000000-0000-0000-0000-000000000001",
    photo: "https://placehold.co/400x300/F3C9A6/2D3748?text=Cat+1",
    description: "Cat hit by car near Sukhumvit Soi 23. Hind leg fracture, unable to stand.",
    severity: "CRITICAL" as const,
    location: "Sukhumvit Soi 23",
    reportedAgo: "2 hours ago",
  },
];

export const activeFundraisers = [
  {
    id: "c0000000-0000-0000-0000-000000000004",
    photo: "https://placehold.co/400x300/F3C9A6/2D3748?text=Cat+4",
    title: "Skin treatment for malnourished cat",
    location: "Wat Phra Kaew",
    goal: 4500,
    raised: 2800,
    donors: 4,
    severity: "MEDIUM" as const,
  },
  {
    id: "c0000000-0000-0000-0000-000000000005",
    photo: "https://placehold.co/400x300/F3C9A6/2D3748?text=Cat+5",
    title: "Wound treatment for dog-bite victim",
    location: "Lumpini Park",
    goal: 8500,
    raised: 5200,
    donors: 4,
    severity: "HIGH" as const,
  },
  {
    id: "c0000000-0000-0000-0000-000000000006",
    photo: "https://placehold.co/400x300/F3C9A6/2D3748?text=Cat+6",
    title: "Fracture surgery for fallen cat",
    location: "Silom",
    goal: 15000,
    raised: 3000,
    donors: 2,
    severity: "HIGH" as const,
  },
];

export const treatmentUpdates = [
  {
    id: "c0000000-0000-0000-0000-000000000007",
    title: "Emergency surgery patient — ICU Day 2",
    vet: "Dr. Anuwat",
    outcome: "ONGOING" as const,
    lastUpdate: "3 days ago",
    summary: "Internal bleeding surgery completed. Recovering in ICU.",
  },
  {
    id: "c0000000-0000-0000-0000-000000000008",
    title: "Abdominal swelling — monitoring",
    vet: "Dr. Siriporn",
    outcome: "ONGOING" as const,
    lastUpdate: "4 days ago",
    summary: "Small cyst detected via ultrasound. Anti-inflammatory prescribed.",
  },
];

export const adoptionReady = [
  {
    id: "c0000000-0000-0000-0000-000000000009",
    photo: "https://placehold.co/400x300/F3C9A6/2D3748?text=Orange+Tabby",
    name: "Orange Tabby",
    personality: "Friendly, loves head scratches, enjoys sunbathing",
    age: "~1 year",
    status: "OPEN" as const,
  },
];

export const recentNotifications = [
  { id: "1", title: "Transport claimed", message: "Prawit C. is on the way.", time: "2 hours ago", read: false },
  { id: "2", title: "New donation", message: "Someone donated ฿500.", time: "5 hours ago", read: false },
  { id: "3", title: "Treatment update", message: "Dr. Anuwat: surgery successful.", time: "3 days ago", read: true },
];
