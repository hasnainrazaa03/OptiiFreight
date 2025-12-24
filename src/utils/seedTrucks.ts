import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../lib/firebase";

export const seedTrucks = async () => {
  const trucksCollection = collection(db, "carriers");
  
  // Check if we already seeded to prevent duplicates
  const snapshot = await getDocs(trucksCollection);
  if (!snapshot.empty) {
    alert("Database already has trucks! Skipping seed.");
    return;
  }

  const mockTrucks = [
    {
      name: 'Speedy Haulage Inc.',
      rating: 4.8,
      ratePerMile: 1.85,
      transitTime: '2 Days',
      equipment: "53' Dry Van",
      reviews: 124,
      verified: true,
      dotNumber: 'US-88421',
      yearsActive: 4,
      insurance: '$1M Cargo'
    },
    {
      name: 'US Logistics Co.',
      rating: 4.5,
      ratePerMile: 1.60,
      transitTime: '3 Days',
      equipment: "Box Truck 26'",
      reviews: 85,
      verified: true,
      dotNumber: 'US-99312',
      yearsActive: 7,
      insurance: '$500k Cargo'
    },
    {
      name: 'Prime Movers LLC',
      rating: 4.9,
      ratePerMile: 2.10,
      transitTime: '1 Day',
      equipment: "Reefer (Refrigerated)",
      reviews: 312,
      verified: true,
      dotNumber: 'US-11244',
      yearsActive: 12,
      insurance: '$2M Liability'
    },
    {
      name: 'Blue Star Freight',
      rating: 4.2,
      ratePerMile: 1.50,
      transitTime: '4 Days',
      equipment: "Standard Van",
      reviews: 45,
      verified: true,
      dotNumber: 'US-33211',
      yearsActive: 2,
      insurance: '$250k Cargo'
    }
  ];

  try {
    for (const truck of mockTrucks) {
      await addDoc(trucksCollection, truck);
    }
    alert("Success! 4 Trucks added to Firestore.");
  } catch (error) {
    console.error("Error seeding trucks:", error);
    alert("Error adding trucks. Check console.");
  }
};