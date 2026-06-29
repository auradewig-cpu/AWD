import { Navbar } from '../components/Navbar';
import { Hero } from '../components/sections/Hero';
import { TrustBar } from '../components/sections/TrustBar';
import { ProcessSteps } from '../components/sections/ProcessSteps';
import { BehindTheScenes } from '../components/sections/BehindTheScenes';
import { PricingSection } from '../components/sections/PricingSection';
import { WhyAWD } from '../components/sections/WhyAWD';
import { FAQ } from '../components/sections/FAQ';
import { Contact } from '../components/sections/Contact';
import { Footer } from '../components/Footer';
// import { ContinuousScrollBackground } from '../components/ContinuousScrollBackground';
import { ScrollScrubContainer } from '@/components/scroll/ScrollScrubContainer';

export function HomePage() {
  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      {/* <ContinuousScrollBackground /> */}
      <ScrollScrubContainer />
      <div style={{ position: 'relative', zIndex: 2 }}>
        <Navbar />
        <Hero />
        <TrustBar />
        <PricingSection />
        <ProcessSteps />
        <BehindTheScenes />
        <WhyAWD />
        <FAQ />
        <Contact />
        <Footer />
      </div>
    </div>
  );
}
