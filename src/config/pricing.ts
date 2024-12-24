// Log all environment variables to see what's available
console.log('Loading pricing configuration...');

// Using the environment variables without VITE_ prefix to match Edge Function
const TIER1_MONTHLY = import.meta.env.STRIPE_TIER1_MONTHLY_PRICE_ID;
const TIER1_ANNUAL = import.meta.env.STRIPE_TIER1_ANNUAL_PRICE_ID;
const TIER2_MONTHLY = import.meta.env.STRIPE_TIER2_MONTHLY_PRICE_ID;
const TIER2_ANNUAL = import.meta.env.STRIPE_TIER2_ANNUAL_PRICE_ID;

console.log('Stripe Price IDs loaded:', {
  TIER1_MONTHLY,
  TIER1_ANNUAL,
  TIER2_MONTHLY,
  TIER2_ANNUAL,
});

export const PRICING_TIERS = [
  {
    name: "Pro",
    description: "Perfect for individuals who want to stay connected",
    monthly: {
      price: "$3.99",
      priceId: TIER1_MONTHLY,
    },
    annual: {
      price: "$39.99",
      priceId: TIER1_ANNUAL,
    },
  },
  {
    name: "Team",
    description: "Ideal for small teams and businesses",
    monthly: {
      price: "$9.99",
      priceId: TIER2_MONTHLY,
    },
    annual: {
      price: "$99.99",
      priceId: TIER2_ANNUAL,
    },
  },
];