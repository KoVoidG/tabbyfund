/**
 * Mock notification data.
 */

export interface MockNotification {
  id: string;
  title: string;
  message: string;
  type: "rescue" | "funding" | "transport" | "treatment" | "adoption" | "system";
  time: string;
  read: boolean;
}

export const allNotifications: MockNotification[] = [
  { id: "1", title: "Transport claimed", message: "Prawit C. is transporting the cat from Sukhumvit.", type: "transport", time: "2 hours ago", read: false },
  { id: "2", title: "New donation received", message: "Someone donated ฿500 to the Lumpini Park case.", type: "funding", time: "5 hours ago", read: false },
  { id: "3", title: "Vet quote submitted", message: "Dr. Siriporn submitted a quote of ฿4,500.", type: "treatment", time: "8 hours ago", read: false },
  { id: "4", title: "Treatment update", message: "Dr. Anuwat: surgery completed successfully.", type: "treatment", time: "1 day ago", read: true },
  { id: "5", title: "Funding complete", message: "The Phahon Yothin case is fully funded!", type: "funding", time: "2 days ago", read: true },
  { id: "6", title: "New rescue reported", message: "A cat was reported near Chatuchak market.", type: "rescue", time: "2 days ago", read: true },
  { id: "7", title: "Adoption request", message: "Kannika W. wants to adopt the orange tabby.", type: "adoption", time: "3 days ago", read: true },
  { id: "8", title: "Welcome to TabbyFund", message: "Thank you for joining! Every life matters.", type: "system", time: "30 days ago", read: true },
];
