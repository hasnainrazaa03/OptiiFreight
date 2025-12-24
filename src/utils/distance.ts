// src/utils/distance.ts

// 1. Mini Database of Coordinates (Mocking a real Geocoding API)
// In a real app, you'd use Google Maps Geocoding API
const zipCoords: Record<string, { lat: number; lng: number }> = {
  "10001": { lat: 40.7128, lng: -74.0060 }, // New York
  "90001": { lat: 34.0522, lng: -118.2437 }, // Los Angeles
  "60601": { lat: 41.8781, lng: -87.6298 },  // Chicago
  "77001": { lat: 29.7604, lng: -95.3698 },  // Houston
  "33101": { lat: 25.7617, lng: -80.1918 },  // Miami
  "98101": { lat: 47.6062, lng: -122.3321 }, // Seattle
  "default": { lat: 39.8283, lng: -98.5795 } // Center of US
};

// 2. The Haversine Formula (Calculates miles between two coords)
const getDistanceFromLatLonInMiles = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 3958.8; // Radius of the earth in miles
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in miles
  return Math.round(d);
};

const deg2rad = (deg: number) => {
  return deg * (Math.PI / 180);
};

// 3. The Public Function to use in your app
export const calculateDistance = (originZip: string, destZip: string): number => {
  const origin = zipCoords[originZip] || zipCoords["default"];
  const dest = zipCoords[destZip] || zipCoords["default"];

  // If zips are unknown/same, return a default mock distance to prevent 0
  if (origin === dest) return 500; 

  return getDistanceFromLatLonInMiles(origin.lat, origin.lng, dest.lat, dest.lng);
};