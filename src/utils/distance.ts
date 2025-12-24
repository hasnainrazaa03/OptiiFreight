// src/utils/distance.ts

const zipCoords: Record<string, { lat: number; lng: number }> = {
  "10001": { lat: 40.7128, lng: -74.0060 }, // New York
  "90001": { lat: 34.0522, lng: -118.2437 }, // Los Angeles
  "60601": { lat: 41.8781, lng: -87.6298 },  // Chicago
  "77001": { lat: 29.7604, lng: -95.3698 },  // Houston
  "33101": { lat: 25.7617, lng: -80.1918 },  // Miami
  "98101": { lat: 47.6062, lng: -122.3321 }, // Seattle
  "07102": { lat: 40.7357, lng: -74.1724 },  // Newark (For short haul test)
  "default": { lat: 39.8283, lng: -98.5795 } // Center of US
};

const getDistanceFromLatLonInMiles = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 3958.8; 
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
};

const deg2rad = (deg: number) => deg * (Math.PI / 180);

export const calculateDistance = (originZip: string, destZip: string): number => {
  // CLEAN INPUTS: Remove spaces
  const cleanOrigin = originZip.trim();
  const cleanDest = destZip.trim();

  const origin = zipCoords[cleanOrigin] || zipCoords["default"];
  const dest = zipCoords[cleanDest] || zipCoords["default"];

  // LOGGING FOR DEBUGGING
  console.log(`Calculating Distance: ${cleanOrigin} -> ${cleanDest}`);
  if (!zipCoords[cleanOrigin]) console.warn(`Origin Zip ${cleanOrigin} not found, using default.`);
  if (!zipCoords[cleanDest]) console.warn(`Dest Zip ${cleanDest} not found, using default.`);

  if (cleanOrigin === cleanDest) return 5; // Minimal distance for same zip

  const miles = getDistanceFromLatLonInMiles(origin.lat, origin.lng, dest.lat, dest.lng);
  console.log(`Result: ${miles} miles`);
  
  return miles;
};