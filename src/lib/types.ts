export type DrillLevel = "cluster" | "namespace" | "pod";

export interface CostRow {
  id: string;
  name: string;
  cpu: number;
  ram: number;
  storage: number;
  network: number;
  gpu: number;
  efficiency: number;
  total: number;
}

export interface DrillState {
  level: DrillLevel;
  selectedCluster: string | null;
  selectedNamespace: string | null;
}

export interface BreadcrumbItem {
  label: string;
  level: DrillLevel;
}

export interface ApiUser {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  email: string;
}

export interface ApiProduct {
  id: number;
  title: string;
  price: number;
  stock: number;
  rating: number;
  discountPercentage: number;
}

export interface ApiResponse {
  users?: ApiUser[];
  products?: ApiProduct[];
}