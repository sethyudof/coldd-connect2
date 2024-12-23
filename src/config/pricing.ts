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
console.log('Pricing configuration loaded:', {
  tier1: {
    monthly: PRICING_TIERS[0].monthly.priceId,
    annual: PRICING_TIERS[0].annual.priceId,
  },
  tier2: {
    monthly: PRICING_TIERS[1].monthly.priceId,
    annual: PRICING_TIERS[1].annual.priceId,
  }
});