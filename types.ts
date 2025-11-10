
export type Theme = 'light' | 'dark';

export interface User {
  id: string;
  email: string;
  credits: number;
  role: 'user' | 'admin';
  lastCreditGrantDate: string | null;
}

export type PlanType = 'Free' | 'Normal' | 'Pro' | 'Daily';

export interface PricingPlan {
  id: string;
  name: string;
  credits: number; // For one-time plans, this is the total credits. For daily, it can be an initial amount.
  price: number;
  description: string;
  type: PlanType;
  durationDays: number | null; // null for lifetime/one-time plans
  dailyCreditAmount: number | null; // Credits to grant each day
}

export type RequestStatus = 'Pending' | 'Approved' | 'Rejected';

export interface PurchaseRequest {
  id: string;
  userId: string;
  userEmail: string;
  planId: string;
  planName: string;
  creditsToAward: number;
  date: string;
  transactionId: string;
  status: RequestStatus;
  note?: string;
}

export interface PaymentMethod {
    id: string;
    name: string;
    details: string;
    hint: string;
}

export interface AdminSettings {
  qrCode: string | null;
  paymentMethods: PaymentMethod[];
}

export interface GeneratedImage {
  id: string;
  src: string;
  rating: number; // 0 for unrated, 1-5 for rated
}