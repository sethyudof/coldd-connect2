export const PRICING_TIERS = [
  {
    name: "Basic",
    description: "Perfect for individuals and small teams",
    monthly: {
      priceId: import.meta.env.VITE_STRIPE_TIER1_MONTHLY_PRICE_ID || 'price_1OqwKqKZnZPzwuQ9GvsFWGj8',
      price: "$3.99",
    },
    annual: {
      priceId: import.meta.env.VITE_STRIPE_TIER1_ANNUAL_PRICE_ID || 'price_1OqwKqKZnZPzwuQ9xHfKWn2L',
      price: "$35.99",
    },
  },
  {
    name: "Pro",
    description: "Advanced features for power users",
    monthly: {
      priceId: import.meta.env.VITE_STRIPE_TIER2_MONTHLY_PRICE_ID || 'price_1OqwKqKZnZPzwuQ9YHfKWn2M',
      price: "$6.99",
    },
    annual: {
      priceId: import.meta.env.VITE_STRIPE_TIER2_ANNUAL_PRICE_ID || 'price_1OqwKqKZnZPzwuQ9ZHfKWn2N',
      price: "$62.99",
    },
  },
];

// Log price IDs on load for debugging
console.log('Pricing configuration loaded:', {
  tier1Monthly: PRICING_TIERS[0].monthly.priceId,
  tier1Annual: PRICING_TIERS[0].annual.priceId,
  tier2Monthly: PRICING_TIERS[1].monthly.priceId,
  tier2Annual: PRICING_TIERS[1].annual.priceId,
});