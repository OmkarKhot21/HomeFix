'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Marquee from '@/components/landing/Marquee';
import QuickBook from '@/components/landing/QuickBook';
import Services from '@/components/Services';
import RapidRepairMenu from '@/components/RapidRepairMenu';
import HowItWorks from '@/components/landing/HowItWorks';
import TrackingShowcase from '@/components/landing/TrackingShowcase';
import { WhyHomeFix } from '@/components/landing/TrustAndPricing';
import { Coverage, ForProfessionals } from '@/components/landing/CoverageAndPartners';
import { Faq, FinalCta } from '@/components/landing/FaqAndCta';
import Footer from '@/components/Footer';
import LeadCaptureModal from '@/components/LeadCaptureModal';
import ServiceModal from '@/components/ServiceModal';
import { useCurrentUser } from '@/components/useCurrentUser';
import type { Service } from '@/lib/services';

export default function LandingPage() {
  const [isInvestorModalOpen, setIsInvestorModalOpen] = useState(false);
  const [activeService, setActiveService] = useState<Service | null>(null);
  const { user } = useCurrentUser();

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-white">
      {/* White / black / yellow sections alternate down the page */}
      <div className="relative">
        <Navbar user={user} onOpenInvestor={() => setIsInvestorModalOpen(true)} />
        <Hero onSelect={setActiveService} />
        <Marquee />
        <RapidRepairMenu onSelect={setActiveService} />
        <HowItWorks />
        <Services onSelect={setActiveService} />
        <QuickBook onSelect={setActiveService} />
        <TrackingShowcase />
        <WhyHomeFix />
        <Coverage />
        <ForProfessionals />
        <Faq />
        <FinalCta />
        <Footer onOpenInvestor={() => setIsInvestorModalOpen(true)} />
      </div>

      <ServiceModal
        service={activeService}
        isLoggedIn={Boolean(user)}
        onClose={() => setActiveService(null)}
      />

      <LeadCaptureModal 
        isOpen={isInvestorModalOpen} 
        onClose={() => setIsInvestorModalOpen(false)} 
      />

    </main>
  );
}
