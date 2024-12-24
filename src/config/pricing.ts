export const PRICING_TIERS = [
  {
    name: "Pro",
    description: "Perfect for individuals who want to stay connected",
    monthly: {
      price: "$3.99",
      priceId: process.env.VITE_STRIPE_TIER1_MONTHLY_PRICE_ID,
    },
    annual: {
      price: "$39.99",
      priceId: process.env.VITE_STRIPE_TIER1_ANNUAL_PRICE_ID,
    },
  },
  {
    name: "Team",
    description: "Ideal for small teams and businesses",
    monthly: {
      price: "$9.99",
      priceId: process.env.VITE_STRIPE_TIER2_MONTHLY_PRICE_ID,
    },
    annual: {
      price: "$99.99",
      priceId: process.env.VITE_STRIPE_TIER2_ANNUAL_PRICE_ID,
    },
  },
];