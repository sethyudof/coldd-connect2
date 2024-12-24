import path from "path"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import { componentTagger } from "lovable-tagger"

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  server: {
    host: "::",
    port: 8080,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  envPrefix: ['VITE_'],
  define: {
    'process.env': {
      VITE_STRIPE_TIER1_MONTHLY_PRICE_ID: JSON.stringify(process.env.VITE_STRIPE_TIER1_MONTHLY_PRICE_ID),
      VITE_STRIPE_TIER1_ANNUAL_PRICE_ID: JSON.stringify(process.env.VITE_STRIPE_TIER1_ANNUAL_PRICE_ID),
      VITE_STRIPE_TIER2_MONTHLY_PRICE_ID: JSON.stringify(process.env.VITE_STRIPE_TIER2_MONTHLY_PRICE_ID),
      VITE_STRIPE_TIER2_ANNUAL_PRICE_ID: JSON.stringify(process.env.VITE_STRIPE_TIER2_ANNUAL_PRICE_ID),
    },
  },
}))