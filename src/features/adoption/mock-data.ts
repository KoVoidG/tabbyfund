/**
 * Mock data for the adoption experience.
 * Represents cats that have completed treatment and are ready for homes.
 */

export interface AdoptableCat {
  id: string;
  name: string;
  photos: string[];
  age: string;
  gender: "Male" | "Female";
  breed: string;
  location: string;
  // Behavioural (foster-owned)
  personality: string[];
  energyLevel: string;
  goodWithChildren?: boolean;
  goodWithCats?: boolean;
  indoorOnly: boolean;
  idealHome: string[];
  favouriteActivities: string[];
  // Medical (vet-owned)
  health: string[];
  vaccination: string;
  neutered: boolean;
  specialNeeds?: string;
  treatmentSummary: string;
  vet: string;
  // General
  story: string;
  fosterCaretaker: string;
  fosterDays: number;
  matchReasons: string[];
  journeyComplete: boolean;
}

export const adoptableCats: AdoptableCat[] = [
  {
    id: "c0000000-0000-0000-0000-000000000009",
    name: "Somtam",
    photos: [
      "https://placehold.co/600x800/F3C9A6/2D3748?text=Somtam+1",
      "https://placehold.co/600x800/A788FA/FFFFFF?text=Somtam+2",
      "https://placehold.co/600x800/6C5CE7/FFFFFF?text=Somtam+3",
    ],
    age: "~1 year",
    gender: "Male",
    breed: "Orange Tabby",
    location: "Thonglor, Bangkok",
    // Behavioural (foster-owned)
    personality: ["Affectionate", "Playful", "Curious", "Lap Cat"],
    energyLevel: "Medium",
    goodWithChildren: true,
    goodWithCats: true,
    indoorOnly: true,
    idealHome: ["Apartment friendly", "First-time owners welcome", "Calm household"],
    favouriteActivities: ["Sunbathing", "Playing with string toys", "Head scratches", "Window watching"],
    // Medical (vet-owned)
    health: ["Vaccinated", "Neutered", "Recovered"],
    vaccination: "complete",
    neutered: true,
    treatmentSummary: "Wound fully healed. Vaccinations complete. Healthy and ready for adoption.",
    vet: "Dr. Siriporn",
    // General
    story: "Somtam was found with a leg wound in Thonglor. After 2 weeks of treatment by Dr. Siriporn, he made a full recovery. He's been in foster care for 7 days and is now looking for his forever home. He loves head scratches and sunbathing by the window.",
    fosterCaretaker: "Prawit C.",
    fosterDays: 7,
    matchReasons: ["Apartment friendly", "Loves first-time owners", "Calm temperament", "Great with adults", "Low maintenance"],
    journeyComplete: true,
  },
  {
    id: "adopt-002",
    name: "Mochi",
    photos: [
      "https://placehold.co/600x800/FFF3E0/2D3748?text=Mochi+1",
      "https://placehold.co/600x800/F3C9A6/2D3748?text=Mochi+2",
    ],
    age: "~2 years",
    gender: "Female",
    breed: "Calico",
    location: "Ari, Bangkok",
    personality: ["Independent", "Calm", "Shy", "Talkative"],
    energyLevel: "Low",
    goodWithChildren: false,
    goodWithCats: false,
    indoorOnly: true,
    idealHome: ["Quiet household", "Patient owner", "No small children", "Indoor with window access"],
    favouriteActivities: ["Napping in boxes", "Bird watching", "Gentle play", "Quiet companionship"],
    health: ["Vaccinated", "Neutered", "Microchipped", "Recovered"],
    vaccination: "complete",
    neutered: true,
    treatmentSummary: "Eye infection fully resolved. Vision normal. Vaccinations and microchip complete.",
    vet: "Dr. Siriporn",
    story: "Mochi was rescued from a construction site with an eye infection. After successful treatment, she's blossomed into a gentle, independent cat who loves quiet spaces. She takes time to warm up but becomes deeply loyal.",
    fosterCaretaker: "Nattaya S.",
    fosterDays: 14,
    matchReasons: ["Perfect for quiet homes", "Independent nature", "Low energy", "Good for working professionals", "Loyal companion"],
    journeyComplete: true,
  },
  {
    id: "adopt-003",
    name: "Tuna",
    photos: [
      "https://placehold.co/600x800/A788FA/FFFFFF?text=Tuna+1",
      "https://placehold.co/600x800/6C5CE7/FFFFFF?text=Tuna+2",
      "https://placehold.co/600x800/F7F7FB/2D3748?text=Tuna+3",
    ],
    age: "~6 months",
    gender: "Male",
    breed: "Tuxedo",
    location: "Silom, Bangkok",
    personality: ["Playful", "Curious", "Affectionate", "Energetic"],
    energyLevel: "High",
    goodWithChildren: true,
    goodWithCats: true,
    indoorOnly: false,
    idealHome: ["Active household", "Cat-friendly home", "Secure balcony", "Experienced owner preferred"],
    favouriteActivities: ["Chasing toys", "Climbing", "Wrestling with siblings", "Zoomies at 3am"],
    health: ["Vaccinated", "Neutered", "Recovered", "Special Needs"],
    vaccination: "complete",
    neutered: true,
    specialNeeds: "Monthly joint supplement for healed fracture",
    treatmentSummary: "Front leg fracture surgery successful. Fully healed. Requires monthly joint supplement.",
    vet: "Dr. Anuwat",
    story: "Tuna survived a fall from a condo balcony. His front leg healed perfectly after surgery. He's now an incredibly energetic kitten who loves to play and explore. He needs a home that can keep up with his energy.",
    fosterCaretaker: "Somchai K.",
    fosterDays: 10,
    matchReasons: ["Great with other cats", "High energy playmate", "Young and adaptable", "Resilient spirit", "Entertaining personality"],
    journeyComplete: true,
  },
];
