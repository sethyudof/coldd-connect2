import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Export price IDs from environment variables
export const TIER1_MONTHLY = import.meta.env.VITE_STRIPE_TIER1_MONTHLY_PRICE_ID;
export const TIER1_ANNUAL = import.meta.env.VITE_STRIPE_TIER1_ANNUAL_PRICE_ID;
export const TIER2_MONTHLY = import.meta.env.VITE_STRIPE_TIER2_MONTHLY_PRICE_ID;
export const TIER2_ANNUAL = import.meta.env.VITE_STRIPE_TIER2_ANNUAL_PRICE_ID;