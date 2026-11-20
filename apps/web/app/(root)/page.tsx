import { Chat } from "@/components/chat-ui"
import { CtaSection } from "@/modules/home/components/cta-section"
import { FaqSection } from "@/modules/home/components/faq-section"
import { FeaturesSection } from "@/modules/home/components/features-section"
import { HeroSection } from "@/modules/home/components/hero-section"
import { HowItWorksSection } from "@/modules/home/components/how-it-works-section"
import { PrivacySection } from "@/modules/home/components/privacy-section"

const HomePage = () => {
  return (
    <main>
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <PrivacySection />
      <FaqSection />
      <CtaSection />
    </main>
  )
}

export default HomePage