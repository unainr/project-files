import { PricingView } from '@/modules/pricing/components/pricing-view'
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Simple plans for every stage. Paid plans are coming soon.",
};
const PricingPage = () => {
  return (
    <>
      <PricingView/>  
    </>
  )
}

export default PricingPage