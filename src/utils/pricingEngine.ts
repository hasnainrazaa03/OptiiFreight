// src/utils/pricingEngine.ts

export interface ShipmentDetails {
  weight: number; // lbs
  length: number; // feet
  width: number; // feet
  height: number; // feet
  distance: number; // miles
}

export interface CarrierRates {
  rateA: number; // Per Mile
  rateB: number; // Per Cubic Foot
  rateC: number; // Per Pound
}

export interface QuoteResult {
  chargeableBasis: 'WEIGHT' | 'VOLUME';
  density: number;
  volume: number; // cubic feet
  baseCharge: number;
  mileageCharge: number;
  finalCost: number;
  transitTimeHours: number;
  transitTimeDisplay: string;
  breakdown: string; // Explanation for the user
}

export const calculateSOP = (shipment: ShipmentDetails, rates: CarrierRates): QuoteResult => {
  // --- 1. FREIGHT CHARGE CALCULATION (SOP Section 5.0) ---

  // Step 1: Volume (ft³)
  // Ensure we handle inputs that might be strings or numbers
  const vol = Number(shipment.length) * Number(shipment.width) * Number(shipment.height);
  const weight = Number(shipment.weight);

  // Step 2: Density (lbs/ft³)
  // Avoid division by zero
  const density = vol > 0 ? (weight / vol) : 0;

  // Step 3: Determine Chargeable Basis
  // High Density threshold = 12.5 lbs/ft³
  const isHighDensity = density >= 12.5;
  const basis = isHighDensity ? 'WEIGHT' : 'VOLUME';

  // Step 4: Calculate Base Freight Charge
  let baseCharge = 0;
  
  if (basis === 'VOLUME') {
    // Rate B: Price per cubic foot
    baseCharge = vol * (rates.rateB || 0.50); // Default fallback if missing
  } else {
    // Rate C: Price per pound
    baseCharge = weight * (rates.rateC || 0.10); // Default fallback if missing
  }

  // Mileage Check (Rate A)
  const mileageCharge = shipment.distance * (rates.rateA || 2.00);

  // Final Charge = MAX(Base, Mileage)
  const finalCost = baseCharge + mileageCharge;


  // --- 2. TRANSIT TIME CALCULATION (SOP Section 6.0) ---

  // Step 1: Base Driving Time (50 mph)
  const baseTime = shipment.distance / 50;

  // Step 2: Determine Buffer
  let bufferPercent = 0;
  if (shipment.distance < 100) bufferPercent = 0.10;
  else if (shipment.distance <= 500) bufferPercent = 0.20;
  else if (shipment.distance <= 1000) bufferPercent = 0.30;
  else bufferPercent = 0.50;

  // Step 3: Total Estimated Time
  const bufferTime = baseTime * bufferPercent;
  const totalHours = baseTime + bufferTime;

  // Formatting for display (e.g. "5.5 Hours" or "2 Days")
  let timeDisplay = "";
  if (totalHours > 24) {
      const days = (totalHours / 24).toFixed(1);
      timeDisplay = `${days} Days`;
  } else {
      timeDisplay = `${Math.ceil(totalHours)} Hours`;
  }

  return {
    chargeableBasis: basis,
    density: parseFloat(density.toFixed(2)),
    volume: parseFloat(vol.toFixed(2)),
    baseCharge: parseFloat(baseCharge.toFixed(2)),
    mileageCharge: parseFloat(mileageCharge.toFixed(2)),
    finalCost: Math.round(finalCost), // Round to nearest dollar for clean UI
    transitTimeHours: totalHours,
    transitTimeDisplay: timeDisplay,
    breakdown: `Mileage ($${mileageCharge.toFixed(0)}) + ${basis} Charge ($${baseCharge.toFixed(0)})`
  };
};