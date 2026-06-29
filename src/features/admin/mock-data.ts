/**
 * Mock data for the Admin dashboard.
 */

export const adminStats = {
  activeCases: 10,
  activeFundraisers: 3,
  totalDonations: 52700,
  catsRehomed: 1,
  activeVolunteers: 5,
  verifiedVets: 2,
};

export const monthlyRescues = [
  { month: "Jan", count: 3 },
  { month: "Feb", count: 5 },
  { month: "Mar", count: 4 },
  { month: "Apr", count: 7 },
  { month: "May", count: 6 },
  { month: "Jun", count: 10 },
];

export const donationGrowth = [
  { month: "Jan", amount: 8000 },
  { month: "Feb", amount: 12000 },
  { month: "Mar", amount: 15000 },
  { month: "Apr", amount: 22000 },
  { month: "May", amount: 35000 },
  { month: "Jun", amount: 52700 },
];

export const recentUsers = [
  { id: "1", name: "Somchai K.", role: "community", joinedAgo: "2 hours ago" },
  { id: "2", name: "Nattaya S.", role: "community", joinedAgo: "5 hours ago" },
  { id: "3", name: "Dr. New Vet", role: "vet", joinedAgo: "1 day ago", pending: true },
];

export const platformHealth = {
  uptime: "99.9%",
  avgResponseMs: 142,
  activeUsers24h: 28,
  reportsToday: 2,
};
