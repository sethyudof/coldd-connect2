export const PRICING_TIERS = [
  {
    name: "Basic",
    description: "Perfect for individuals and small teams",
    monthly: {
      priceId: import.meta.env.VITE_STRIPE_TIER1_MONTHLY_PRICE_ID,
      price: "$3.99",
    },
    annual: {
      priceId: import.meta.env.VITE_STRIPE_TIER1_ANNUAL_PRICE_ID,
      price: "$35.99",
    },
  },
  {
    name: "Pro",
    description: "Advanced features for power users",
    monthly: {
      priceId: import.meta.env.VITE_STRIPE_TIER2_MONTHLY_PRICE_ID,
      price: "$6.99",
    },
    annual: {
      priceId: import.meta.env.VITE_STRIPE_TIER2_ANNUAL_PRICE_ID,
      price: "$62.99",
    },
  },
];

// Enhanced logging for price ID debugging
console.log('Stripe Price IDs loaded:', {
  tier1Monthly: import.meta.env.VITE_STRIPE_TIER1_MONTHLY_PRICE_ID || 'NOT SET',
  tier1Annual: import.meta.env.VITE_STRIPE_TIER1_ANNUAL_PRICE_ID || 'NOT SET',
  tier2Monthly: import.meta.env.VITE_STRIPE_TIER2_MONTHLY_PRICE_ID || 'NOT SET',
  tier2Annual: import.meta.env.VITE_STRIPE_TIER2_ANNUAL_PRICE_ID || 'NOT SET'
});

// Log all environment variables for debugging
console.log('All available env variables:', import.meta.env);