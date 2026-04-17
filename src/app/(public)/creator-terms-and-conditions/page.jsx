import React from 'react'
import ContentTypesSection from '@/components/creators-terms/ContentTypesSection'
import EligibilitySection from '@/components/creators-terms/Eligibility'
import Hero from '@/components/creators-terms/Hero'
import IntroductionSection from '@/components/creators-terms/Introduction'
import LicenseSection from '@/components/creators-terms/LicenseSection'
import OwnershipSection from '@/components/creators-terms/OwnershipSection'
import Purpose from '@/components/creators-terms/Purpose'
import ResponsibilitiesSection from '@/components/creators-terms/ResponsibilitiesSection'
import PlatformRoleSection from '@/components/creators-terms/PlatformRoleSection'
import ProhibitedSubmissions from '@/components/creators-terms/ProhibitedSubmissions'
import SponsoredContent from '@/components/creators-terms/SponsoredContent'
import RemovalSection from '@/components/creators-terms/RemovalSection'
import AccountStatusSection from '../terms-and-conditions/AccountStatusSection'
import GuaranteeSection from '@/components/creators-terms/GuaranteeSection'
import LimitationSection from '@/components/creators-terms/LimitationSection'
import ForceMajeureSection from '@/components/creators-terms/ForceMajeureSection'
import ModificationSection from '@/components/creators-terms/ModificationSection'
import ContactSection from '@/components/creators-terms/ContactSection'
import GoverningLawSection from '@/components/creators-terms/GoverningLawSection'

export default function CreatorTermsPage() {
  return (
    <main className="min-h-screen bg-white">
      <Hero />
      {/* একটি সেন্ট্রাল কন্টেইনার ব্যবহার করছি যাতে সব সেকশন এলাইনমেন্ট ঠিক থাকে */}
      <div className="max-w-5xl mx-auto py-12 px-4 space-y-16">
        <IntroductionSection />
        <Purpose />
        <EligibilitySection />
        <ContentTypesSection />
        <OwnershipSection />
        <LicenseSection />
        <ResponsibilitiesSection />
        <PlatformRoleSection/>
        <ProhibitedSubmissions/>
        <SponsoredContent/>
        <RemovalSection/>
        <AccountStatusSection/>
        <GuaranteeSection/>
        <LimitationSection/>
        <ForceMajeureSection/>
        <ModificationSection/>
        <ContactSection/>
        <GoverningLawSection/>
      </div>
    </main>
  )
}