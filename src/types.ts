export enum UserRole {
  BUSINESS = 'BUSINESS',
  CARRIER = 'CARRIER',
  GUEST = 'GUEST'
}

export interface Shipment {
  id: string;
  origin: string;
  destination: string;
  weight: number;
  date: string;
  status: 'Pending' | 'In Transit' | 'Delivered' | 'Optimizing';
  cost: number;
  savings?: number;
}

export interface Truck {
  id: string;
  driverName: string;
  capacity: number;
  currentLoad: number;
  route: string[];
  status: 'Available' | 'On Route';
  location: string;
}

export interface ChartData {
  name: string;
  value: number;
  secondary?: number;
}