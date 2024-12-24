import {
  TIER1_ANNUAL,
  TIER1_MONTHLY,
  TIER2_ANNUAL,
  TIER2_MONTHLY,
} from "@/lib/utils";

export const PRICING_PLANS = {
  tier1: {
    name: "Tier 1",
    description: "Perfect for getting started with contact management",
    features: [
      "Up to 100 SMS reminders per month",
      "Up to 50 AI responses per month",
      "Basic contact management",
      "Email support"
    ],
    monthly: {
      price: "$3.99",
      priceId: TIER1_MONTHLY,
    },
    annual: {
      price: "$35.99",
      priceId: TIER1_ANNUAL,
    },
  },
  tier2: {
    name: "Tier 2",
    description: "For power users who need more features",
    features: [
      "Up to 400 SMS reminders per month",
      "Unlimited AI responses",
      "Advanced contact management",
      "Priority email support",
      "Dedicated account manager"
    ],
    monthly: {
      price: "$6.99",
      priceId: TIER2_MONTHLY,
    },
    annual: {
      price: "$62.99",
      priceId: TIER2_ANNUAL,
    },
  },
};